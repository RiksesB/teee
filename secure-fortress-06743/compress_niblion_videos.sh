#!/usr/bin/env bash
set -euo pipefail

# Comprime "Video 1 Niblion.mp4" ... "Video 6 Niblion.mp4" a ~9.8 MiB sin perder mucha calidad.
# Requisitos: ffmpeg y ffprobe instalados.
# Parámetros opcionales (por variables de entorno):
#   TARGET_MIB   Tamaño objetivo en MiB (por defecto 9.8)
#   AUDIO_KBIT   Bitrate de audio en kbps (por defecto 128)
#   MAX_WIDTH    Ancho máximo del video (por defecto 1280)
#   OVERHEAD_KIB Margen para contenedor/variación en KiB (por defecto 250)
#   PRESET       Preset de x264 (ultrafast..veryslow) (por defecto slow)
# Ejemplo de uso:
#   ./compress_niblion_videos.sh
#   TARGET_MIB=9.9 AUDIO_KBIT=96 MAX_WIDTH=1280 ./compress_niblion_videos.sh

TARGET_MIB=${TARGET_MIB:-9.8}
AUDIO_KBIT=${AUDIO_KBIT:-128}
MAX_WIDTH=${MAX_WIDTH:-1280}
OVERHEAD_KIB=${OVERHEAD_KIB:-250}
PRESET=${PRESET:-slow}

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg no está instalado" >&2
  exit 1
fi
if ! command -v ffprobe >/dev/null 2>&1; then
  echo "Error: ffprobe no está instalado" >&2
  exit 1
fi

# Convierte MiB objetivo a bytes para comparación
TARGET_BYTES=$(awk -v m="$TARGET_MIB" 'BEGIN { printf "%d", m*1024*1024 }')

process_one() {
  local input_file="$1"
  if [[ ! -f "$input_file" ]]; then
    echo "[AVISO] No existe: $input_file (se omite)"
    return 0
  fi

  # Si ya pesa menos que el objetivo, no recomprimir
  local current_size
  current_size=$(stat -c%s -- "$input_file")
  if (( current_size <= TARGET_BYTES )); then
    echo "[OK] Ya <= ${TARGET_MIB}MiB: $input_file (se omite)"
    return 0
  fi

  # Duración en segundos (con decimales)
  local duration_s
  duration_s=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -- "$input_file")
  if [[ -z "$duration_s" || "$duration_s" == "N/A" ]]; then
    echo "Error: No pude leer la duración de $input_file" >&2
    return 1
  fi

  # Cálculo de bitrate de video (kbps) para cumplir tamaño objetivo
  # Fórmula: video_kbps = ((target_bits - overhead_bits) / duration_s - audio_kbps*1000) / 1000
  local video_kbps
  video_kbps=$(awk -v target_mib="$TARGET_MIB" -v overhead_kib="$OVERHEAD_KIB" -v duration="$duration_s" -v audio_kbps="$AUDIO_KBIT" 'BEGIN {
    target_bits   = target_mib * 1024 * 1024 * 8;
    overhead_bits = overhead_kib * 1024 * 8;
    available_bits = target_bits - overhead_bits;
    if (available_bits <= 0 || duration <= 0) { print 100; exit }
    video_bps  = (available_bits / duration) - (audio_kbps * 1000);
    video_kbps = int(video_bps / 1000);
    if (video_kbps < 100) video_kbps = 100;
    print video_kbps;
  }')

  local base ext output_file
  base=${input_file%.*}
  ext=${input_file##*.}
  output_file="${base}_compressed.mp4"

  echo "[INFO] Comprimendo: $input_file -> $output_file"
  echo "       Duración: ${duration_s}s | Video ~${video_kbps} kbps | Audio ${AUDIO_KBIT} kbps | MaxWidth ${MAX_WIDTH}"

  # Carpeta temporal para logs de 2-pass
  tmpdir=$(mktemp -d)
  passlog="$tmpdir/ffmpeg2pass"

  # Primera pasada (solo video, sin audio, a null)
  ffmpeg -hide_banner -loglevel error -y \
    -i "$input_file" \
    -c:v libx264 -b:v "${video_kbps}k" -pass 1 -passlogfile "$passlog" \
    -preset "$PRESET" -tune film \
    -vf "scale='min(${MAX_WIDTH},iw)':'-2':force_original_aspect_ratio=decrease" \
    -an -f mp4 /dev/null

  # Segunda pasada (video + audio)
  ffmpeg -hide_banner -loglevel error -y \
    -i "$input_file" \
    -c:v libx264 -b:v "${video_kbps}k" -pass 2 -passlogfile "$passlog" \
    -preset "$PRESET" -tune film \
    -vf "scale='min(${MAX_WIDTH},iw)':'-2':force_original_aspect_ratio=decrease" \
    -pix_fmt yuv420p \
    -c:a aac -b:a "${AUDIO_KBIT}k" -ac 2 \
    -movflags +faststart \
    "$output_file"

  # Limpieza de logs
  rm -rf "$tmpdir"
  rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree 2>/dev/null || true

  # Verificación de tamaño final
  if [[ -f "$output_file" ]]; then
    local out_size
    out_size=$(stat -c%s -- "$output_file")
    if (( out_size <= TARGET_BYTES )); then
      echo "[OK] Generado: $output_file (\"$(awk -v b=$out_size 'BEGIN{printf "%.2f", b/1024/1024}') MiB\")"
    else
      echo "[AVISO] $output_file excede ${TARGET_MIB}MiB (actual: $(awk -v b=$out_size 'BEGIN{printf "%.2f", b/1024/1024}') MiB).\n       Puedes bajar AUDIO_KBIT o TARGET_MIB y reintentar." >&2
    fi
  else
    echo "Error: No se generó el archivo de salida para $input_file" >&2
    return 1
  fi
}

# Permitir pasar índices como argumentos (ej: 1 3 5). Si no hay, usa 1..6
if (( $# > 0 )); then
  indices=("$@")
else
  indices=(1 2 3 4 5 6)
fi

# Procesa los videos del root
for i in "${indices[@]}"; do
  process_one "Video $i Niblion.mp4"
  echo
done

echo "Listo."
