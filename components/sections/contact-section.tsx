"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type FormEventHandler,
} from "react";

import Magnet from "@/components/ui/magnet";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { contactSectionCopy } from "@/lib/data/contact";
import type { SectionCopy } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./contact-section.module.css";

type ContactSectionProps = {
  className?: string;
  /** WordPress homepage headings only — form/map stay local */
  headings?: SectionCopy;
};

type FieldErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

type SubmitStatus = "idle" | "loading" | "ok" | "error";

/**
 * Contact — map + form posting to `/api/contact`.
 */
export function ContactSection({ className, headings }: ContactSectionProps) {
  const copy = contactSectionCopy;
  const eyebrow = headings?.eyebrow || copy.eyebrow;
  const title = headings?.title || copy.title;
  const body = headings?.body || copy.body;
  const formId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  useSectionReveal(sectionRef);

  const validate = (form: HTMLFormElement): FieldErrors => {
    const data = new FormData(form);
    const next: FieldErrors = {};

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = "Please enter your name.";
    if (!email) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (!subject) next.subject = "Please enter a subject.";
    if (!message) next.message = "Please write a message.";

    return next;
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const next = validate(form);
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setStatus("idle");
      setFormError(null);
      const firstKey = Object.keys(next)[0];
      const el = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    setStatus("loading");
    setFormError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      } | null;

      if (!response.ok || !result?.ok) {
        if (result?.fieldErrors) {
          setErrors(result.fieldErrors);
          const firstKey = Object.keys(result.fieldErrors)[0];
          if (firstKey) {
            form
              .querySelector<HTMLElement>(`[name="${firstKey}"]`)
              ?.focus();
          }
        }
        setFormError(result?.error || copy.errorMessage);
        setStatus("error");
        return;
      }

      setErrors({});
      setFormError(null);
      setStatus("ok");
      form.reset();
    } catch {
      setFormError(copy.errorMessage);
      setStatus("error");
    }
  };

  const isLoading = status === "loading";

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby={`${formId}-title`}
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <NoiseTexture
        aria-hidden
        frequency={0.65}
        octaves={4}
        slope={0.12}
        noiseOpacity={0.35}
        className={styles.noise}
      />

      <div className={styles.inner}>
        <div data-reveal className={styles.intro}>
          <SectionEyebrow className={styles.eyebrow}>
            {eyebrow}
          </SectionEyebrow>
          <h2 id={`${formId}-title`} className={styles.title}>
            {title}
          </h2>
          <p className={styles.body}>{body}</p>
        </div>

        <div className={styles.grid}>
          <div data-reveal className={styles.mapCol}>
            <div className={styles.mapFrame}>
              <iframe
                title={copy.map.title}
                src={copy.map.embedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className={styles.map}
              />
            </div>
          </div>

          <div data-reveal className={styles.formCol}>
            <form
              className={styles.form}
              noValidate
              onSubmit={onSubmit}
              aria-busy={isLoading || undefined}
              aria-describedby={
                status === "ok"
                  ? `${formId}-success`
                  : status === "error"
                    ? `${formId}-form-error`
                    : undefined
              }
            >
              <Field
                {...copy.fields.name}
                error={errors.name}
                errorId={`${formId}-name-error`}
                disabled={isLoading}
              />
              <Field
                {...copy.fields.email}
                error={errors.email}
                errorId={`${formId}-email-error`}
                disabled={isLoading}
              />
              <Field
                {...copy.fields.subject}
                error={errors.subject}
                errorId={`${formId}-subject-error`}
                disabled={isLoading}
              />
              <TextAreaField
                {...copy.fields.message}
                error={errors.message}
                errorId={`${formId}-message-error`}
                disabled={isLoading}
              />

              <div className={styles.actions}>
                <Magnet padding={60} magnetStrength={3} disabled={isLoading}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? copy.submittingLabel : copy.submitLabel}
                    {!isLoading ? (
                      <span aria-hidden className="translate-y-px text-[0.95em]">
                        →
                      </span>
                    ) : null}
                  </button>
                </Magnet>
                {status === "ok" ? (
                  <p
                    id={`${formId}-success`}
                    role="status"
                    className={styles.success}
                  >
                    {copy.successMessage}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p
                    id={`${formId}-form-error`}
                    role="alert"
                    className={styles.error}
                  >
                    {formError || copy.errorMessage}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  autoComplete?: string;
  type: "text" | "email";
  error?: string;
  errorId: string;
  disabled?: boolean;
};

function Field({
  id,
  name,
  label,
  required,
  autoComplete,
  type,
  error,
  errorId,
  disabled,
}: FieldProps) {
  const invalid = Boolean(error);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(styles.input, invalid && styles.inputError)}
      />
      {invalid ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextAreaProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  rows: number;
  error?: string;
  errorId: string;
  disabled?: boolean;
};

function TextAreaField({
  id,
  name,
  label,
  required,
  rows,
  error,
  errorId,
  disabled,
}: TextAreaProps) {
  const invalid = Boolean(error);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(styles.textarea, invalid && styles.inputError)}
      />
      {invalid ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
