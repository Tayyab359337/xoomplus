import {
  servicesMegaColumns,
} from "@/lib/data/services-mega-menu";

/** Short one-line taglines for Services mega Category 1. */
export const CATEGORY_TAGLINES: Record<string, string> = {
  "Digital Marketing": "SEO, social, ads & growth campaigns",
  "Web Solutions": "Sites, stores & platform builds",
  "Graphic Design Solutions": "Brand, UI & creative design",
};

/** Theme icons: replace hardcoded brand orange with currentColor. */
export function themeIconSvg(svg: string): string {
  return svg
    .replaceAll('fill="#FEA106"', 'fill="currentColor"')
    .replaceAll("fill='#FEA106'", "fill='currentColor'")
    .replaceAll('stroke="#FEA106"', 'stroke="currentColor"')
    .replaceAll("stroke='#FEA106'", "stroke='currentColor'");
}

export function getServicesCategory(index: number) {
  return servicesMegaColumns[index] ?? servicesMegaColumns[0];
}
