import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CtaButton } from "@/components/CtaButton";
import { useLeadModal } from "@/lib/leadModal";
import { whatsappInviteUrl } from "@/lib/whatsapp";
import {
  buildPayload,
  formatPhoneBR,
  leadSchema,
  submitLead,
  type LeadFormInput,
} from "@/lib/leadCapture";

const TURNSTILE_SITEKEY =
  (import.meta.env.VITE_TURNSTILE_SITEKEY as string | undefined) ?? "";

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact" | "invisible";
          appearance?: "always" | "execute" | "interaction-only";
        },
      ) => string;
      execute: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (document.getElementById(TURNSTILE_SCRIPT_ID)) {
    return new Promise((res) => {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          res();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        res();
      }, 5000);
    });
  }
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.id = TURNSTILE_SCRIPT_ID;
    s.src = TURNSTILE_SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error("turnstile script load failed"));
    document.head.appendChild(s);
  });
}

export function LeadCaptureModal() {
  const { isOpen, close, source } = useLeadModal();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenResolveRef = useRef<((t: string) => void) | null>(null);

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      consent: undefined as unknown as true,
      hp_url: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!isOpen) return;
    loadTurnstile().catch(() => {
      // continua — pegar erro no submit
    });
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignora
        }
        widgetIdRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // reseta tudo ao fechar pra próxima abertura ser limpa
      const t = setTimeout(() => {
        form.reset();
        setDone(false);
        setSubmitting(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen, form]);

  const ensureTurnstileToken = async (): Promise<string> => {
    if (!TURNSTILE_SITEKEY) {
      // dev/preview sem sitekey configurada: passa string fixa que o backend
      // rejeita em produção (intencional — não submete leads sem captcha)
      return "DEV_NO_SITEKEY";
    }
    await loadTurnstile();
    if (!window.turnstile) throw new Error("turnstile indisponível");

    return new Promise<string>((resolve, reject) => {
      tokenResolveRef.current = resolve;
      const el = turnstileRef.current;
      if (!el) {
        reject(new Error("turnstile container ausente"));
        return;
      }
      // re-render se já existe
      if (widgetIdRef.current) {
        try {
          window.turnstile!.reset(widgetIdRef.current);
        } catch {
          // ignora
        }
      }
      widgetIdRef.current = window.turnstile!.render(el, {
        sitekey: TURNSTILE_SITEKEY,
        size: "invisible",
        appearance: "interaction-only",
        callback: (token) => {
          tokenResolveRef.current?.(token);
          tokenResolveRef.current = null;
        },
        "error-callback": () => {
          reject(new Error("captcha falhou"));
          tokenResolveRef.current = null;
        },
        "expired-callback": () => {
          // token expirou antes do submit — força reset
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch {
              // ignora
            }
          }
        },
      });
      // dispara verificação invisível
      window.turnstile!.execute(widgetIdRef.current);
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (values.hp_url) return; // honeypot — bot

    // CRÍTICO (mobile): pré-abre a aba do Zenhub SÍNCRONO dentro do gesto do
    // clique. Browsers mobile (iOS Safari, Chrome iOS, Android) bloqueiam
    // window.open chamado depois de qualquer await — sai da call stack do
    // gesto e vira "popup não solicitado". Abrindo já com a URL final, se
    // o popup pegar, sucesso garantido. Se for bloqueado (popup === null),
    // fallback pra navegação na mesma aba mais abaixo.
    const popup = window.open(whatsappInviteUrl, "_blank", "noopener,noreferrer");

    setSubmitting(true);
    try {
      let token = "";
      try {
        token = await ensureTurnstileToken();
      } catch {
        if (popup && !popup.closed) popup.close();
        toast.error("Não conseguimos validar você. Tenta de novo?");
        setSubmitting(false);
        return;
      }
      const payload = buildPayload(
        { nome: values.nome, email: values.email, telefone: values.telefone },
        token,
        source,
      );
      const res = await submitLead(payload);

      if (res.ok) {
        toast.success("Pronto! Estamos com você.");
      }
      // Buffer silencioso: se !res.ok, lead já foi salvo no localStorage pelo
      // submitLead() e será reenviado depois. Não mostramos nada ao usuário —
      // ele segue direto pro Zenhub.

      setDone(true);

      // Garante o redirecionamento. Caso o popup tenha sido bloqueado pelo
      // browser (mobile com popup blocker, modo privado etc.), navega na
      // mesma aba como fallback bombproof — usuário SEMPRE chega no Zenhub.
      if (!popup || popup.closed) {
        window.location.assign(whatsappInviteUrl);
        return; // não fechamos o modal — a página vai navegar fora
      }

      // Fecha modal após beat curto pro usuário ver o estado de sucesso
      setTimeout(() => close(), 900);
    } catch (err) {
      if (popup && !popup.closed) popup.close();
      toast.error("Algo deu errado. Tenta de novo em alguns segundos.");
      // eslint-disable-next-line no-console
      console.error("[lead-capture] submit error", err);
    } finally {
      setSubmitting(false);
    }
  });

  const labelClass =
    "block text-xs font-narrow uppercase tracking-wide text-verde-escuro/70 mb-2";
  const inputClass =
    "w-full rounded-xl bg-cream border-2 border-verde-escuro/15 px-4 py-3 text-base font-narrow text-verde-escuro placeholder:text-verde-escuro/35 focus:border-verde-escuro focus:outline-none focus:ring-2 focus:ring-amarelo focus:ring-offset-0 transition-colors disabled:opacity-50";
  const errorClass =
    "mt-1.5 text-xs font-narrow text-azul";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v && !submitting) close();
      }}
    >
      <DialogContent
        className="bg-cream border-2 border-verde-escuro/15 sm:max-w-md p-0 overflow-hidden gap-0"
        onInteractOutside={(e) => {
          if (submitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (submitting) e.preventDefault();
        }}
      >
        {/* faixa amarela superior — assinatura visual da marca */}
        <div className="bg-amarelo px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
          <p className="font-narrow uppercase text-xs tracking-wide text-verde-escuro/70 mb-3">
            Acesso antecipado
          </p>
          <h2 className="font-display uppercase text-verde-escuro leading-[0.95] text-3xl sm:text-4xl">
            Entra no Grupo no WhatsApp do <br className="hidden sm:block" />
            Pé Direito.
          </h2>
          <p className="font-narrow text-verde-escuro/85 mt-3 text-sm sm:text-[15px] leading-snug">
            Quem está dentro recebe o link com prioridade no dia 14.05.
          </p>
        </div>

        <div className="px-6 sm:px-8 pt-6 pb-7">
          {done ? (
            <div className="py-10 text-center" role="status" aria-live="polite">
              <div className="mx-auto w-14 h-14 rounded-full bg-verde-escuro flex items-center justify-center mb-4">
                <Check className="w-7 h-7 text-amarelo" strokeWidth={3} />
              </div>
              <p className="font-display uppercase text-2xl text-verde-escuro mb-2">
                Você entrou.
              </p>
              <p className="font-narrow text-sm text-verde-escuro/75">
                Abrindo o grupo agora...
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="lead-nome" className={labelClass}>
                  Nome
                </label>
                <input
                  id="lead-nome"
                  type="text"
                  autoComplete="name"
                  inputMode="text"
                  className={inputClass}
                  placeholder="Como podemos te chamar?"
                  disabled={submitting}
                  aria-invalid={!!form.formState.errors.nome}
                  {...form.register("nome")}
                />
                {form.formState.errors.nome && (
                  <p className={errorClass}>{form.formState.errors.nome.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lead-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  className={inputClass}
                  placeholder="seu@email.com"
                  disabled={submitting}
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className={errorClass}>{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lead-telefone" className={labelClass}>
                  WhatsApp
                </label>
                <input
                  id="lead-telefone"
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="tel"
                  className={inputClass}
                  placeholder="(11) 91234-5678"
                  disabled={submitting}
                  aria-invalid={!!form.formState.errors.telefone}
                  {...form.register("telefone", {
                    onChange: (e) => {
                      e.target.value = formatPhoneBR(e.target.value);
                    },
                  })}
                />
                {form.formState.errors.telefone && (
                  <p className={errorClass}>
                    {form.formState.errors.telefone.message}
                  </p>
                )}
              </div>

              {/* honeypot — escondido visualmente e do screen reader */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Não preencha
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...form.register("hp_url")}
                  />
                </label>
              </div>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-[3px] w-4 h-4 rounded border-2 border-verde-escuro/40 text-verde-escuro focus:ring-amarelo focus:ring-2 cursor-pointer accent-verde-escuro"
                  disabled={submitting}
                  {...form.register("consent")}
                />
                <span className="font-narrow text-xs text-verde-escuro/80 leading-snug">
                  Concordo em receber comunicações da Pé Direito sobre o
                  lançamento. Seus dados ficam só com a gente.
                </span>
              </label>
              {form.formState.errors.consent && (
                <p className={errorClass}>{form.formState.errors.consent.message}</p>
              )}

              {/* container invisível do Turnstile — ocupado em runtime */}
              <div ref={turnstileRef} className="cf-turnstile" aria-hidden="true" />

              <div className="pt-2">
                <CtaButton
                  type="submit"
                  variant="amarelo"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                      Enviando...
                    </>
                  ) : (
                    "Entrar no grupo"
                  )}
                </CtaButton>
              </div>

              <p className="font-narrow text-[11px] text-verde-escuro/50 text-center pt-1">
                Protegido por Cloudflare Turnstile.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
