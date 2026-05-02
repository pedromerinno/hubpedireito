import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const checklistItems = [
  "Salve esta página nos favoritos",
  "Coloque um alarme para 1º.05 às 8h55",
  "Esteja nesse site 5 min antes para clicar no link de abertura",
  "Tenha seus dados de pagamento prontos",
];

export function PreparationChecklist() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(checklistItems.length).fill(false)
  );

  const toggleItem = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  return (
    <section
      className="bg-verde-escuro px-6 sm:px-10 lg:px-16 py-20 sm:py-28"
      aria-labelledby="checklist-heading"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <span className="inline-block font-narrow font-medium text-amarelo/80 text-xs sm:text-sm bg-amarelo/10 rounded-full px-5 py-2">
            O que fazer agora
          </span>
        </div>

        <ul className="space-y-3 sm:space-y-4">
          {checklistItems.map((item, index) => (
            <li key={index}>
              <label
                htmlFor={`item-${index}`}
                className={`flex items-center gap-5 bg-white/[0.06] rounded-2xl p-5 sm:p-6 cursor-pointer transition-all hover:bg-white/[0.09] ${
                  checkedItems[index] ? "opacity-70" : ""
                }`}
              >
                <Checkbox
                  id={`item-${index}`}
                  checked={checkedItems[index]}
                  onCheckedChange={() => toggleItem(index)}
                  className="flex-shrink-0 h-6 w-6 border-2 border-amarelo bg-transparent data-[state=checked]:bg-amarelo data-[state=checked]:border-amarelo data-[state=checked]:text-verde-escuro rounded-md"
                />
                <span className="flex items-center gap-3 flex-1">
                  <span className="font-lead text-amarelo/40 text-sm shrink-0 w-8">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span
                    className={`font-narrow text-base sm:text-lg text-cream leading-snug ${
                      checkedItems[index] ? "line-through opacity-80" : ""
                    }`}
                  >
                    {item}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
