import logoSinNombre from '../../assets/logo sin nombre.png';

export const NiblionLogo = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-16",
    xxl: "h-20"
  };

  const heightClass = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSinNombre} 
        alt="Niblion" 
        className={`${heightClass} w-auto object-contain`}
      />
    </div>
  );
};
