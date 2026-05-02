import pedireitoLogo from "@/assets/pedireito-logo.svg";

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

export function BrandLogo({ className = "h-10", alt = "Pé Direito" }: BrandLogoProps) {
  return <img src={pedireitoLogo} alt={alt} className={className} />;
}
