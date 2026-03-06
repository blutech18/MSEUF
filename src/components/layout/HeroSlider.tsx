"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = "https://mseuf.edu.ph/web4_assets/homepage/banners";

const SLIDES = [
  `${BASE}/391674700-668507781954294-3067839720638549274-n-2.webp`,
  `${BASE}/464808091-941978937951487-4842697172298353565-n.webp`,
  `${BASE}/64274982-2823734851000881-8046690618547634176-n.webp`,
  `${BASE}/dal9513.webp`,
  `${BASE}/drone.webp`,
  `${BASE}/ccjc-homepage-banner.webp`,
  `${BASE}/mg-0281.webp`,
];

const INTERVAL = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "clamp(420px, 65vh, 680px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={src}
            alt={`MSEUF campus slide ${i + 1}`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-maroon-950/80 via-maroon-900/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-maroon-950/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative flex h-full items-center">
        <div className="container-page w-full">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Gateway to Enverga&apos;s{" "}
              <span className="text-gold-400">Academic Excellence</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85 sm:text-xl drop-shadow">
              The largest university library in the Southern Tagalog Region.
              Search our catalog, access digital resources, and get AI-powered
              assistance — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/follett-destiny" className="btn-gold gap-2">
                <BookOpen className="h-4 w-4" />
                Browse OPAC Catalog
              </Link>
              <Link
                href="/tutorials"
                className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                View Tutorials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-gold-400"
                : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
