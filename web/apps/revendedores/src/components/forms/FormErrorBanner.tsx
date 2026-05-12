import { AlertCircle } from "lucide-react";
import type { FieldErrors, FieldValues } from "react-hook-form";

interface FormErrorBannerProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  /** Erro de envio retornado pelo backend */
  submitError?: string | null;
}

/**
 * Banner único pra:
 *  - alertar que existem campos com erro de validação
 *  - mostrar erro de envio do backend
 *
 * Aparece logo acima do botão de submit pra que o usuário entenda
 * porque o "enviar" não está progredindo.
 */
export function FormErrorBanner<T extends FieldValues>({
  errors,
  submitError,
}: FormErrorBannerProps<T>) {
  const fieldErrorCount = countErrors(errors);
  const hasFieldErrors = fieldErrorCount > 0;

  if (!hasFieldErrors && !submitError) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" aria-hidden />
      <div className="space-y-1.5">
        {hasFieldErrors && (
          <p className="font-semibold">
            {fieldErrorCount === 1
              ? "1 campo precisa de atenção. Verifique acima e tente de novo."
              : `${fieldErrorCount} campos precisam de atenção. Verifique acima e tente de novo.`}
          </p>
        )}
        {submitError && <p>{submitError}</p>}
      </div>
    </div>
  );
}

function countErrors(errors: unknown): number {
  if (!errors || typeof errors !== "object") return 0;
  let total = 0;
  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    if ("message" in (value as Record<string, unknown>)) {
      total += 1;
    } else {
      total += countErrors(value);
    }
  }
  return total;
}
