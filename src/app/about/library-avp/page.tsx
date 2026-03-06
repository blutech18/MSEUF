import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Play, Film } from "lucide-react";

export const metadata: Metadata = {
  title: "University Library AVP",
  description:
    "Watch the MSEUF University Library audio-visual presentation — a virtual tour of our facilities and services.",
};

export default function LibraryAVPPage() {
  return (
    <>
      <PageHeader
        title="University Library AVP"
        subtitle="Audio-Visual Presentation"
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "University Library AVP" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            {/* Video Embed Placeholder */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-maroon-900 shadow-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 ring-4 ring-gold-500/30">
                  <Play className="h-10 w-10 ml-1" />
                </div>
                <p className="text-lg font-medium text-maroon-200">
                  University Library AVP 2024
                </p>
                <p className="text-sm text-maroon-300">
                  Video embed placeholder — replace with actual video URL
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-800 text-gold-400">
                  <Film className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-maroon-800">
                    About This Presentation
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-gray-700">
                    The MSEUF University Library Audio-Visual Presentation (AVP)
                    offers a comprehensive virtual tour of our facilities,
                    collections, and services. Discover our circulation and
                    reserve sections, reference and Filipiniana collections,
                    periodicals, digital resources, and the Educational Media
                    Resource Center — all designed to support your academic
                    journey.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="font-heading text-lg font-semibold text-maroon-800">
                  What You&apos;ll See
                </h3>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    Library layout and section overview
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    OPAC and digital catalog access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    Database subscriptions (ProQuest, EBSCO, IG Library)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    Study areas and research support services
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    Library hours and contact information
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
