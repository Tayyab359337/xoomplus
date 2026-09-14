import React from "react";

import { Timeline } from "@/components/ui/timeline";

export default function TimelineDemo() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Changelog",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-muted-foreground md:text-sm">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8 space-y-2 text-xs text-muted-foreground md:text-sm">
            <p>Card grid component</p>
            <p>Startup template Aceternity</p>
            <p>Random file upload lol</p>
            <p>Himesh Reshammiya Music CD</p>
            <p>Salman Bhai Fan Club registrations open</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline
        data={data}
        title="Changelog from my journey"
        description="I've been working on Aceternity for the past 2 years. Here's a timeline of my journey."
      />
    </div>
  );
}
