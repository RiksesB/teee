#!/usr/bin/env node

/**
 * Script de migración para subir preguntas del quiz a MongoDB
 * 
 * Uso:
 * node migrate-questions.js [options]
 * 
 * Opciones:
 * --upload     : Sube las preguntas desde preguntas-quiz.json a MongoDB
 * --download   : Descarga las preguntas desde MongoDB a preguntas-backup.json
 * --reset      : Borra todas las preguntas y las vuelve a crear desde JSON
 * --check      : Verifica el estado de las preguntas en la base de datos
 * --help       : Muestra esta ayuda
 */

import { MongoClient } from 'mongodb';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const DATABASE_URI = process.env.DATABASE_URI;
const JSON_FILE = join(__dirname, 'preguntas-quiz.json');
const BACKUP_FILE = join(__dirname, 'preguntas-backup.json');

let client;
let db;

// Función para conectar a MongoDB
async function connectToDatabase() {
  if (!DATABASE_URI) {
    console.error('❌ ERROR: DATABASE_URI no está configurada');
    console.log('Agrega DATABASE_URI=tu_mongodb_uri en tu archivo .env');
    process.exit(1);
  }

  try {
    client = new MongoClient(DATABASE_URI);
    await client.connect();
    db = client.db('niblion_analytics');
    console.log('✅ Conectado a MongoDB exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

// Función para cerrar la conexión
async function closeConnection() {
  if (client) {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Función para leer el archivo JSON
function leerPreguntasDesdeJSON() {
  try {
    const contenido = readFileSync(JSON_FILE, 'utf8');
    const data = JSON.parse(contenido);
    return data.modulos;
  } catch (error) {
    console.error(`❌ Error leyendo ${JSON_FILE}:`, error.message);
    process.exit(1);
  }
}

// Función para subir preguntas a MongoDB
async function subirPreguntas() {
  console.log('📚 Subiendo preguntas desde JSON a MongoDB...');
  
  const modulosJSON = leerPreguntasDesdeJSON();
  const collection = db.collection('quiz_questions');
  
  // Convertir a formato esperado por la BD
  const documentos = Object.entries(modulosJSON).map(([numero, modulo]) => ({
    modulo: parseInt(numero),
    titulo: modulo.titulo,
    preguntas: modulo.preguntas,
    activo: true,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    migracion: {
      version: '1.0.0',
      origen: 'preguntas-quiz.json',
      fecha_migracion: new Date()
    }
  }));

  try {
    // Verificar si ya existen preguntas
    const existentes = await collection.countDocuments();
    
    if (existentes > 0) {
      console.log(`⚠️  Ya existen ${existentes} módulos en la base de datos`);
      console.log('Use --reset para borrar y recrear, o --check para ver el estado actual');
      return;
    }

    // Insertar documentos
    const resultado = await collection.insertMany(documentos);
    console.log(`✅ ${resultado.insertedCount} módulos subidos exitosamente`);
    
    // Mostrar resumen
    for (let doc of documentos) {
      console.log(`   📋 Módulo ${doc.modulo}: ${doc.preguntas.length} preguntas - ${doc.titulo}`);
    }
    
  } catch (error) {
    console.error('❌ Error subiendo preguntas:', error.message);
  }
}

// Función para descargar preguntas desde MongoDB
async function descargarPreguntas() {
  console.log('📥 Descargando preguntas desde MongoDB...');
  
  const collection = db.collection('quiz_questions');
  
  try {
    const preguntas = await collection.find({ activo: true }).sort({ modulo: 1 }).toArray();
    
    if (preguntas.length === 0) {
      console.log('⚠️  No se encontraron preguntas en la base de datos');
      return;
    }

    // Convertir a formato JSON
    const modulosJSON = {};
    preguntas.forEach(item => {
      modulosJSON[item.modulo] = {
        titulo: item.titulo,
        preguntas: item.preguntas
      };
    });

    const backup = {
      version: '1.0.0',
      fecha_backup: new Date().toISOString(),
      descripcion: 'Backup de preguntas desde MongoDB',
      modulos: modulosJSON
    };

    // Guardar en archivo
    writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
    console.log(`✅ Backup guardado en ${BACKUP_FILE}`);
    console.log(`📋 ${preguntas.length} módulos descargados`);
    
  } catch (error) {
    console.error('❌ Error descargando preguntas:', error.message);
  }
}

// Función para resetear las preguntas
async function resetearPreguntas() {
  console.log('🔄 Reseteando preguntas...');
  
  const collection = db.collection('quiz_questions');
  
  try {
    // Borrar existentes
    const eliminados = await collection.deleteMany({});
    console.log(`🗑️  ${eliminados.deletedCount} documentos eliminados`);
    
    // Crear de nuevo
    await subirPreguntas();
    
  } catch (error) {
    console.error('❌ Error reseteando preguntas:', error.message);
  }
}

// Función para verificar el estado
async function verificarEstado() {
  console.log('🔍 Verificando estado de las preguntas...');
  
  const collection = db.collection('quiz_questions');
  
  try {
    const preguntas = await collection.find({ activo: true }).sort({ modulo: 1 }).toArray();
    
    if (preguntas.length === 0) {
      console.log('❌ No hay preguntas en la base de datos');
      console.log('💡 Use --upload para subirlas desde el archivo JSON');
      return;
    }

    console.log(`✅ Encontrados ${preguntas.length} módulos en la base de datos:`);
    console.log('');
    
    for (let pregunta of preguntas) {
      console.log(`📋 Módulo ${pregunta.modulo}:`);
      console.log(`   📝 Título: ${pregunta.titulo}`);
      console.log(`   ❓ Preguntas: ${pregunta.preguntas.length}`);
      console.log(`   📅 Creado: ${pregunta.fecha_creacion.toISOString()}`);
      console.log(`   🔄 Actualizado: ${pregunta.fecha_actualizacion.toISOString()}`);
      if (pregunta.migracion) {
        console.log(`   🔧 Migración: ${pregunta.migracion.version} (${pregunta.migracion.fecha_migracion.toISOString()})`);
      }
      console.log('');
    }
    
    // Verificar integridad
    const totalPreguntas = preguntas.reduce((sum, p) => sum + p.preguntas.length, 0);
    console.log(`📊 Total de preguntas: ${totalPreguntas}`);
    console.log(`🎯 Módulos esperados: 1-6, encontrados: ${preguntas.map(p => p.modulo).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error.message);
  }
}

// Función para mostrar ayuda
function mostrarAyuda() {
  console.log(`
📚 Script de Migración de Preguntas del Quiz
===========================================

Uso: node migrate-questions.js [opción]

Opciones:
  --upload     Sube preguntas desde preguntas-quiz.json a MongoDB
  --download   Descarga preguntas desde MongoDB a preguntas-backup.json
  --reset      Borra todas las preguntas y las recrea desde JSON
  --check      Verifica el estado actual de las preguntas en DB
  --help       Muestra esta ayuda

Ejemplos:
  node migrate-questions.js --check      # Verificar estado
  node migrate-questions.js --upload     # Subir preguntas por primera vez
  node migrate-questions.js --reset      # Resetear y actualizar preguntas
  node migrate-questions.js --download   # Crear backup

Archivos:
  📄 preguntas-quiz.json    - Archivo fuente con las preguntas
  📄 preguntas-backup.json  - Backup descargado desde MongoDB

Variables requeridas:
  DATABASE_URI - URI de conexión a MongoDB (en .env)
`);
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    mostrarAyuda();
    return;
  }

  await connectToDatabase();

  try {
    if (args.includes('--upload')) {
      await subirPreguntas();
    } else if (args.includes('--download')) {
      await descargarPreguntas();
    } else if (args.includes('--reset')) {
      await resetearPreguntas();
    } else if (args.includes('--check')) {
      await verificarEstado();
    } else {
      console.log('❌ Opción no reconocida. Use --help para ver las opciones disponibles.');
    }
  } catch (error) {
    console.error('❌ Error ejecutando el script:', error.message);
  } finally {
    await closeConnection();
  }
}

// Manejar errores no capturados
process.on('uncaughtException', async (error) => {
  console.error('❌ Error no capturado:', error.message);
  await closeConnection();
  process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
  console.error('❌ Promesa rechazada:', reason);
  await closeConnection();
  process.exit(1);
});

// Ejecutar script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}