import { cn } from "@/lib/utils";

interface FullBleedImageProps {
  /** Imagem de fundo. Quando `videoSrc` é passado, vira poster de fallback. */
  src: string;
  alt: string;
  /**
   * Quando passado, renderiza vídeo no lugar da imagem (autoplay, loop, muted).
   * `src` continua sendo usado como poster pré-carregamento.
   */
  videoSrc?: string;
  children?: React.ReactNode;
  /** Aspect ratio class — defaults to 16/9 landscape */
  aspectClass?: string;
  /** Overlay darkness 0–100, default 35 */
  overlay?: number;
  className?: string;
}

export function FullBleedImage({
  src,
  alt,
  videoSrc,
  children,
  aspectClass = "aspect-[16/9] sm:aspect-[21/9]",
  overlay = 35,
  className,
}: FullBleedImageProps) {
  return (
    <section className={cn("relative w-full overflow-hidden", aspectClass, className)}>
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
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {overlay > 0 && (
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: `rgba(0,0,0,${overlay / 100})` }}
          aria-hidden
        />
      )}
      {children && (
        <div className="relative z-[2] h-full flex items-center justify-center px-6 sm:px-10">
          {children}
        </div>
      )}
    </section>
  );
}
