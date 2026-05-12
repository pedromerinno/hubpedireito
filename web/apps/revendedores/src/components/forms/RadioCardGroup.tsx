import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioCardOption<V extends string = string> {
  value: V;
  label: string;
  description?: string;
}

interface RadioCardGroupProps<V extends string> {
  value: V | undefined;
  onChange: (value: V) => void;
  options: RadioCardOption<V>[];
  /** layout: column (default) ou grid (2 colunas em sm+) */
  layout?: "column" | "grid";
  id?: string;
  name?: string;
}

export function RadioCardGroup<V extends string>({
  value,
  onChange,
  options,
  layout = "column",
  id,
  name,
}: RadioCardGroupProps<V>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as V)}
      className={cn(
        layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-2" : "flex flex-col gap-2"
      )}
      id={id}
      name={name}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const optId = `${id ?? name ?? "opt"}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={optId}
            className={cn(
              "group flex items-start gap-3 cursor-pointer rounded-xl border-2 bg-white px-4 py-3.5 transition-all",
              isSelected
                ? "border-[#2B9402] bg-[#2B9402]/[0.05]"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <RadioGroupItem value={opt.value} id={optId} className="mt-0.5" />
            <span className="flex-1">
              <span
                className={cn(
                  "block text-sm sm:text-[15px] font-medium",
                  isSelected ? "text-[#2B9402]" : "text-foreground"
                )}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
