import { useId } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
  // Namespace único por instância — evita colisão de id quando vários
  // RadioCardGroup convivem na mesma página (mesmas options "sim"/"nao").
  const reactId = useId();
  const groupNs = id ?? name ?? reactId;

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
        const optId = `${groupNs}-${opt.value}`;
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

interface RadioCardFieldProps<T extends FieldValues, V extends string> {
  control: Control<T>;
  name: Path<T>;
  options: RadioCardOption<V>[];
  layout?: "column" | "grid";
  /** Pergunta/título mostrado acima do grupo */
  question?: string;
}

/**
 * Versão integrada com react-hook-form: mostra <FormMessage /> automático
 * em caso de erro de validação. Use sempre que estiver dentro de um <Form>.
 */
export function RadioCardField<T extends FieldValues, V extends string = string>({
  control,
  name,
  options,
  layout = "column",
  question,
}: RadioCardFieldProps<T, V>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {question && (
            <p className="text-sm font-semibold text-gray-700 mb-2">{question}</p>
          )}
          <FormControl>
            <RadioCardGroup<V>
              value={field.value as V | undefined}
              onChange={(v) => field.onChange(v)}
              options={options}
              layout={layout}
              name={field.name}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
