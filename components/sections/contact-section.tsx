"use client";

import {
  useId,
  useState,
  type FormEvent,
  type FormEventHandler,
} from "react";

import { Reveal } from "@/components/motion/reveal";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { contactSectionCopy } from "@/lib/data/contact";
import { cn } from "@/lib/utils";

import styles from "./contact-section.module.css";

type ContactSectionProps = {
  className?: string;
};

type FieldErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

/**
 * Contact — map + form, Magic UI noise underlay, no backend yet.
 */
export function ContactSection({ className }: ContactSectionProps) {
  const copy = contactSectionCopy;
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "ok">("idle");

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

  const onSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const next = validate(form);
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setStatus("idle");
      const firstKey = Object.keys(next)[0];
      const el = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    // Structured for a future fetch — no external backend yet.
    setStatus("ok");
    form.reset();
  };

  return (
    <section
      id="contact"
      aria-labelledby={`${formId}-title`}
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
        <Reveal variant="fadeUp" className={styles.intro}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 id={`${formId}-title`} className={styles.title}>
            {copy.title}
          </h2>
          <p className={styles.body}>{copy.body}</p>
        </Reveal>

        <div className={styles.grid}>
          <Reveal variant="fadeUp" className={styles.mapCol}>
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
          </Reveal>

          <Reveal variant="fadeUp" delay={0.06} className={styles.formCol}>
            <form
              className={styles.form}
              noValidate
              onSubmit={onSubmit}
              aria-describedby={
                status === "ok" ? `${formId}-success` : undefined
              }
            >
              <Field
                {...copy.fields.name}
                error={errors.name}
                errorId={`${formId}-name-error`}
              />
              <Field
                {...copy.fields.email}
                error={errors.email}
                errorId={`${formId}-email-error`}
              />
              <Field
                {...copy.fields.subject}
                error={errors.subject}
                errorId={`${formId}-subject-error`}
              />
              <TextAreaField
                {...copy.fields.message}
                error={errors.message}
                errorId={`${formId}-message-error`}
              />

              <div className={styles.actions}>
                <button type="submit" className={styles.submit}>
                  {copy.submitLabel}
                </button>
                {status === "ok" ? (
                  <p
                    id={`${formId}-success`}
                    role="status"
                    className={styles.success}
                  >
                    {copy.successMessage}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
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
};

function TextAreaField({
  id,
  name,
  label,
  required,
  rows,
  error,
  errorId,
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
