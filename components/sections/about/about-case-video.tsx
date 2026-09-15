"use client";

import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { aboutCaseVideo } from "@/lib/data/about";

/**
 * About case-study video — hosted WP webm, lazy thumbnail, dialog on demand.
 */
export function AboutCaseVideo() {
  return (
    <HeroVideoDialog
      animationStyle="from-center"
      videoSrc={aboutCaseVideo.src}
      thumbnailSrc={aboutCaseVideo.thumbnailSrc}
      thumbnailAlt={aboutCaseVideo.thumbnailAlt}
      title={aboutCaseVideo.title}
      className="mx-auto w-full max-w-4xl"
    />
  );
}
