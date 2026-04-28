import { Package, Users } from "lucide-react";

const urgencyItems = [
  {
    icon: Package,
    text: "São apenas 10 mil pares no primeiro lote",
  },
  {
    icon: Users,
    text: "Mais de 50.000 pessoas aguardando",
  },
];

export function UrgencySection() {
  return (
    <section className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-foreground mb-5 text-center">
        Por que a urgência é real
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {urgencyItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-card rounded-xl p-5 sm:p-6 shadow-sm border border-border min-h-[88px]"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-base text-foreground leading-snug">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
