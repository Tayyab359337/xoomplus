export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  avatarAlt?: string;
};

/**
 * Editable homepage testimonials — feed InfiniteMovingCards from this object only.
 */
export const testimonials: Testimonial[] = [
  {
    id: "mira",
    quote:
      "Xoomplus didn't decorate our product — they clarified it. The brand finally matches how the product actually feels in someone's hands.",
    name: "Mira Chen",
    role: "Head of Brand",
    company: "Northline",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    avatarAlt: "Portrait of Mira Chen",
  },
  {
    id: "julian",
    quote:
      "We expected decks. We got a system — strategy, craft, and launch moving as one. Revenue followed because the story finally held.",
    name: "Julian Ortega",
    role: "Founder",
    company: "Pulse Lab",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    avatarAlt: "Portrait of Julian Ortega",
  },
  {
    id: "amina",
    quote:
      "The site feels like walking through our studio. Quiet confidence, sharp pacing — clients understand us before the first call.",
    name: "Amina Okonkwo",
    role: "Principal",
    company: "Atelier Nine",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
    avatarAlt: "Portrait of Amina Okonkwo",
  },
  {
    id: "theo",
    quote:
      "Performance creative without the noise. Every asset had a job. CAC dropped, and the brand didn't get cheaper looking in the process.",
    name: "Theo Rankin",
    role: "VP Growth",
    company: "Signal OS",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    avatarAlt: "Portrait of Theo Rankin",
  },
  {
    id: "elena",
    quote:
      "They treat hospitality like cinema — every touchpoint carries tone. Guests notice before they can explain why.",
    name: "Elena Vasquez",
    role: "Creative Director",
    company: "Harbor & Co.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
    avatarAlt: "Portrait of Elena Vasquez",
  },
  {
    id: "noah",
    quote:
      "Embedded partnership, not vendor theater. Decisions landed fast because the team understood the constraint as well as the ambition.",
    name: "Noah Park",
    role: "CMO",
    company: "Ledger Form",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
    avatarAlt: "Portrait of Noah Park",
  },
];

export const testimonialsSectionCopy = {
  eyebrow: "Clients",
  title: "Words from people who shipped with us.",
  body: "Not reviews for the algorithm — notes from partners who stayed.",
} as const;
