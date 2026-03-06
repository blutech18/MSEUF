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
        <div className="space-y-12">
          <p className="mx-auto max-w-3xl text-center text-lg text-gray-600 leading-relaxed">
            The EMRC provides audio-visual equipment, multimedia resources, and function rooms 
            for academic presentations, seminars, and special events. The center includes 
            four AV function rooms and a Little Theater.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Projector, title: "Function Room 1", desc: "Capacity: 30 persons. Equipped with projector and sound system." },
              { icon: Monitor, title: "Function Room 2", desc: "Capacity: 50 persons. Ideal for seminars and workshops." },
              { icon: Video, title: "Function Room 3", desc: "Capacity: 30 persons. Multimedia-equipped conference room." },
              { icon: Music, title: "Little Theater", desc: "Capacity: 100+ persons. For large events and performances." },
            ].map((room) => (
              <div key={room.title} className="card text-center">
                <room.icon className="mx-auto h-10 w-10 text-maroon-600" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">{room.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{room.desc}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl bg-maroon-800 p-8 text-center text-white">
            <h3 className="font-heading text-xl font-bold">Reserve a Function Room</h3>
            <p className="mt-2 text-maroon-200">Submit your reservation request at least 3 working days in advance.</p>
            <Link href="/forms/appointment" className="btn-gold mt-6 inline-flex">
              Book an Appointment
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800"><MapPin className="h-5 w-5" /> Location</h3>
              <p className="mt-2 text-sm text-gray-600">University Library Building, MSEUF Campus</p>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800"><Clock className="h-5 w-5" /> Hours</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Monday – Friday: 7:00 AM – 7:00 PM</p>
                <p>Saturday: 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
