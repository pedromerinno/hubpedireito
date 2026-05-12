import { forwardRef } from "react";
import { PORTAS } from "@/lib/portas";
import { PortaCard } from "./PortaCard";

interface PortasGridProps {
  id?: string;
}

export const PortasGrid = forwardRef<HTMLElement, PortasGridProps>(
  function PortasGrid({ id }, ref) {
    return (
      <section
        ref={ref}
        id={id}
        className="bg-[#F9F1D1] py-16 sm:py-24 px-4 sm:px-6"
        aria-label="As 5 portas de entrada"
      >
        <div className="max-w-[1720px] mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center rounded-full bg-[#FEBF00] px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase text-[#2B9402]">
              As 5 portas
            </span>
            <h2 className="mt-4 text-[#2B9402] text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.95] tracking-tight uppercase">
              escolha por onde
              <br />
              você entra.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PORTAS.map((porta, i) => (
              <PortaCard key={porta.id} porta={porta} index={i + 1} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
