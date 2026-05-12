import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldValues, Control, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

const inputClasses =
  "h-11 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-foreground placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#005CE1]/20 focus-visible:border-[#005CE1] transition-colors";

const textareaClasses =
  "min-h-[110px] rounded-lg border border-gray-200 bg-white px-4 py-3 text-foreground placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#005CE1]/20 focus-visible:border-[#005CE1] transition-colors resize-y";

const labelClasses = "text-sm font-semibold text-gray-700";

interface BaseFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  optional?: boolean;
  required?: boolean;
}

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  placeholder,
  type = "text",
  inputMode,
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>
            {label}
            {optional && <span className="ml-1 text-xs text-muted-foreground font-normal">(opcional)</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              inputMode={inputMode}
              className={inputClasses}
              placeholder={placeholder}
              {...field}
              value={(field.value as string | undefined) ?? ""}
            />
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
  minLength?: number;
  /** Mostra contador de chars */
  showCounter?: boolean;
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  placeholder,
  minLength,
  showCounter,
}: TextareaFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const length = ((field.value as string | undefined) ?? "").length;
        const showWarn = minLength != null && length > 0 && length < minLength;
        return (
          <FormItem>
            <FormLabel className={labelClasses}>
              {label}
              {optional && <span className="ml-1 text-xs text-muted-foreground font-normal">(opcional)</span>}
            </FormLabel>
            <FormControl>
              <Textarea
                className={textareaClasses}
                placeholder={placeholder}
                {...field}
                value={(field.value as string | undefined) ?? ""}
              />
            </FormControl>
            <div className="flex items-center justify-between gap-2">
              {description ? (
                <FormDescription className="text-xs">{description}</FormDescription>
              ) : (
                <span />
              )}
              {showCounter && minLength != null && (
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    showWarn ? "text-[#FEBF00]" : "text-muted-foreground"
                  )}
                >
                  {length}/{minLength}
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
  options: { value: string; label: string }[];
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  placeholder,
  options,
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>
            {label}
            {optional && <span className="ml-1 text-xs text-muted-foreground font-normal">(opcional)</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} value={(field.value as string | undefined) ?? ""}>
            <FormControl>
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const ESTADOS_BR = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];
