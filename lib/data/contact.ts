/**
 * Editable contact section — map embed + form copy.
 * Form is client-only until a backend is wired.
 */
export const contactSectionCopy = {
  eyebrow: "Contact",
  title: "Tell us what you're building.",
  body: "Share the brief, the constraint, or the half-finished idea. We'll reply with how we'd begin.",
  submitLabel: "Send message",
  successMessage: "Message ready — connect a backend to deliver it.",
  map: {
    /** Google Maps embed URL — replace with your studio location. */
    embedSrc:
      "https://maps.google.com/maps?q=Dubai%20Internet%20City&t=&z=13&ie=UTF8&iwloc=&output=embed",
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
