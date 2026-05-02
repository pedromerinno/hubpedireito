import { cn } from "@/lib/utils";

interface EditorialBlockProps {
  /** Imagem do bloco. Quando `videoSrc` é passado, vira poster de fallback. */
  src: string;
  alt: string;
  /**
   * Quando passado, renderiza vídeo no lugar da imagem (autoplay, loop, muted).
   * `src` continua como poster pré-carregamento.
   */
  videoSrc?: string;
  imagePosition?: "left" | "right";
  /** object-position da imagem — default "center" */
  imageFocus?: string;
  children: React.ReactNode;
  className?: string;
}

export function EditorialBlock({
  src,
  alt,
  videoSrc,
  imagePosition = "right",
  imageFocus = "center",
  children,
  className,
}: EditorialBlockProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]", className)}>
      <div
        className={cn(
          "flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-28",
          imagePosition === "left"
            ? "lg:order-2 max-w-2xl lg:mr-auto"
            : "lg:order-1 max-w-2xl lg:ml-auto",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "relative min-h-[320px] sm:min-h-[420px] lg:min-h-0 overflow-hidden",
          imagePosition === "left" ? "lg:order-1" : "lg:order-2",
        )}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={src}
            autoPlay
            loop
            muted
            playsInline
            aria-label={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: imageFocus }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: imageFocus }}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
