import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const checklistItems = [
  "Salve esta página nos favoritos",
  "Coloque um alarme para segunda às 8h55",
  "Esteja nesse site 5 minutos antes do lançamento para clicar no link de abertura",
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
    <section className="w-full max-w-2xl mx-auto bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-5">
        O que fazer agora:
      </h2>
      <ul className="space-y-5">
        {checklistItems.map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <Checkbox
              id={`item-${index}`}
              checked={checkedItems[index]}
              onCheckedChange={() => toggleItem(index)}
              className="mt-0.5 border-primary data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <label
              htmlFor={`item-${index}`}
              className={`text-base cursor-pointer transition-colors leading-snug ${
                checkedItems[index]
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
