/**
 * Editable contact section — map embed + form copy.
 */
export const contactSectionCopy = {
  eyebrow: "Contact",
  title: "Tell us what you're building.",
  body: "Share the brief, the constraint, or the half-finished idea. We'll reply with how we'd begin.",
  submitLabel: "Send message",
  submittingLabel: "Sending…",
  successMessage: "Thanks — your message is on its way. We'll reply soon.",
  errorMessage: "Something went wrong. Please try again in a moment.",
  map: {
    /** Google Maps embed — Xoomplus studio (from maps.app.goo.gl/gUywR3SxgCF4esyN8) */
    embedSrc:
      "https://www.google.com/maps?q=Xoomplus@33.6559732,73.042949&z=17&output=embed",
    title: "Xoomplus studio location map",
  },
  fields: {
    name: {
      id: "contact-name",
      name: "name",
      label: "Your name",
      required: true,
      autoComplete: "name",
      type: "text" as const,
    },
    email: {
      id: "contact-email",
      name: "email",
      label: "Your Email",
      required: true,
      autoComplete: "email",
      type: "email" as const,
    },
    subject: {
      id: "contact-subject",
      name: "subject",
      label: "Your Subject",
      required: true,
      autoComplete: "off",
      type: "text" as const,
    },
    message: {
      id: "contact-message",
      name: "message",
      label: "Write Message",
      required: true,
      rows: 5,
    },
  },
} as const;
