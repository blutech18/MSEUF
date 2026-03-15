import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Monitor, Music, Video, Projector, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Educational Media Resource Center" };

export default function EMRCPage() {
  return (
    <>
      <PageHeader
        title="Educational Media Resource Center (EMRC)"
        subtitle="Audio-visual facilities, function rooms, and multimedia resources"
        breadcrumbs={[{ label: "Services" }, { label: "EMRC" }]}
      />
      <div className="container-page section-padding">
        <div className="space-y-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              The Educational Media Resource Center (EMRC) provides a variety of audio-visual 
              function rooms, theater facilities, and multimedia equipment to support the 
              Instructional, Research, and Extension programs of the University.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "EMRC Office", location: "1st Floor, Library Complex", detail: "General administration and equipment borrowing." },
              { title: "EMRC I (Main)", location: "2nd Floor, AEC Bldg.", detail: "Primary AV facility for large academic sessions." },
              { title: "EMRC II", location: "2nd Floor, CET Bldg.", detail: "Dedicated support for Engineering and Technology." },
              { title: "EMRC III", location: "Ground Floor, Library Complex", detail: "Centralized AV services within the main library." },
              { title: "EMRC IV", location: "Grade School Department", detail: "Specialized resources for primary education." },
              { title: "AEC Little Theater", location: "AEC Bldg.", detail: "Premier venue for performances and large seminars." },
            ].map((loc) => (
              <div key={loc.title} className="card group hover:border-maroon-200">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 group-hover:text-maroon-800 transition-colors">{loc.title}</h3>
                    <p className="mt-1 text-sm font-medium text-maroon-600">{loc.location}</p>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{loc.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-linear-to-br from-maroon-800 to-maroon-950 p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Video className="h-32 w-32" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <h3 className="font-heading text-2xl font-bold">Reserve a Function Room</h3>
              <p className="mt-4 text-maroon-100 max-w-xl">
                Reservation of AV rooms and the Little Theater should be made at least 
                three (3) working days in advance to ensure availability and technical setup.
              </p>
              <Link href="/forms/appointment" className="btn-gold mt-8 px-10 rounded-full">
                Book Reservation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
