import { useCallback } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";

/**
 * Retorna um handler `onInvalid` pro `form.handleSubmit(onValid, onInvalid)`
 * que faz scroll suave até o primeiro campo com erro. Procura primeiro por
 * `[name="field"]`, depois por `#field` como fallback.
 */
export function useScrollToFirstError<T extends FieldValues>() {
  return useCallback((errors: FieldErrors<T>) => {
    const firstName = findFirstErrorPath(errors);
    if (!firstName) return;

    const candidates = [
      document.querySelector<HTMLElement>(`[name="${cssEscape(firstName)}"]`),
      document.getElementById(firstName),
    ].filter(Boolean) as HTMLElement[];

    const target = candidates[0];
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const offset = window.scrollY + rect.top - 96;
    window.scrollTo({ top: offset, behavior: "smooth" });

    if (typeof target.focus === "function") {
      const isFocusable =
        target.matches("input, textarea, select, button, [tabindex]");
      if (isFocusable) {
        target.focus({ preventScroll: true });
      }
    }
  }, []);
}

function findFirstErrorPath(errors: unknown, prefix = ""): string | null {
  if (!errors || typeof errors !== "object") return null;
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if ("message" in (value as Record<string, unknown>)) return path;
    const nested = findFirstErrorPath(value, path);
    if (nested) return nested;
  }
  return null;
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/(["\\])/g, "\\$1");
}
