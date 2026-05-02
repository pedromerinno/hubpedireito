import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  color: string;
  image: string;
}

const products: Product[] = [
  {
    id: "amarelo",
    name: "Amarelo",
    color: "#F5C518",
    image: "/images/product-amarelo.png",
  },
  {
    id: "azul",
    name: "Azul",
    color: "#1A3FC7",
    image: "/images/product-azul.png",
  },
  {
    id: "branco",
    name: "Branco",
    color: "#F2F0EB",
    image: "/images/product-branco.png",
  },
  {
    id: "verde",
    name: "Verde",
    color: "#006B3F",
    image: "/images/product-verde.png",
  },
];

const SPACING = 320;

interface ProductCarouselProps {
  inline?: boolean;
}

export function ProductCarousel({ inline = false }: ProductCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const last = products.length - 1;

    function updatePositions() {
      const p = progressRef.current.value;
      const currentIdx = Math.min(Math.round(p * last), last);
      setActive(currentIdx);

      products.forEach((_, i) => {
        const el = itemsRef.current[i];
        if (!el) return;

        const offset = i - p * last;
        const x = offset * SPACING;
        const scale = 1.15 - Math.min(Math.abs(offset) * 0.25, 0.5);
        const opacity = 1 - Math.min(Math.abs(offset) * 0.55, 0.75);

        gsap.set(el, {
          x,
          scale,
          opacity,
          zIndex: 10 - Math.round(Math.abs(offset)),
        });
      });
    }

    updatePositions();

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 50%",
      end: "bottom 30%",
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current.value = self.progress;
        updatePositions();
      },
    });

    return () => st.kill();
  }, []);

  const content = (
    <div ref={wrapperRef} className="relative">
      <div className="relative flex items-center justify-center h-[380px] sm:h-[460px] lg:h-[620px] overflow-hidden">
        {products.map((product, index) => (
          <div
            key={product.id}
            ref={(el) => { itemsRef.current[index] = el; }}
            className="absolute"
            style={{ willChange: "transform, opacity" }}
          >
                <div className="w-[340px] sm:w-[400px] lg:w-[560px] aspect-square flex items-center justify-center">
              <img
                src={product.image}
                alt={`Chinelo Pé Direito ${product.name}`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 sm:mt-8">
        <span
          className="inline-block font-narrow font-semibold uppercase tracking-wide text-sm sm:text-base rounded-full px-6 py-2 transition-colors duration-300"
          style={{
            backgroundColor: products[active].color,
            color: products[active].id === "branco" ? "#1B3A2D" : "#FFF",
          }}
        >
          {products[active].name}
        </span>
      </div>
    </div>
  );

  if (inline) {
    return <div className="mt-8 sm:mt-10 lg:mt-12 -mx-6 sm:-mx-10">{content}</div>;
  }

  return (
    <section className="bg-verde-escuro py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {content}
      </div>
    </section>
  );
}
