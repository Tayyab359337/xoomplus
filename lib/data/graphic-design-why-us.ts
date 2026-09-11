import type { WhyUsBentoItem } from "@/components/ui/why-us-bento";
import { graphicDesignSubServices } from "@/lib/data/graphic-design-sub-services";

export const graphicDesignWhyUsCopy = {
  eyebrow: "Why choose us",
  title: "Design partners who think past the mockup.",
  body: "Strategy, systems, and speed — without the agency fog.",
} as const;

/** Five bento panels — order matches the WhyUsBento grid layout. */
export const graphicDesignWhyUsItems: WhyUsBentoItem[] = [
  {
    id: "01",
    title: "Strategic thinking",
    description:
      "Audience, offer, and constraint first — so every frame earns its place in the brand story.",
  },
  {
    id: "02",
    title: "Brief to brand",
    description:
      "Mark, type, and campaign applications held as one system — not a pile of disconnected files.",
  },
  {
    id: "03",
    title: "Creative direction",
    description:
      "Senior taste on the work from day one. Direction that stays sharp through every revision.",
  },
  {
    id: "04",
    title: "One team pipeline",
    description:
      "Discover to deliver without handoffs. The designers on the first call ship the final assets.",
  },
  {
    id: "05",
    title: "Digital-first systems",
    description:
      "UI, social, print, and identity built to travel — consistent wherever the brand lands.",
  },
];

/** Craft thumbs for the avatar stack — reuse GD service imagery. */
export const graphicDesignWhyUsAvatars = graphicDesignSubServices.map(
  (service) => service.image,
);
