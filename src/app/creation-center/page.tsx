import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Printer, Box, Scissors, Palette, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Creation Center" };

export default function CreationCenterPage() {
  return (
    <>
      <PageHeader
        title="Creation Center"
        subtitle="Printing, 3D printing, and digital fabrication services"
        breadcrumbs={[{ label: "Creation Center" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-12">
          <p className="text-center text-lg text-gray-600 leading-relaxed">
            The Creation Center is the library&apos;s hub for making and creating. From standard 
            printing to 3D printing and digital fabrication, we provide the tools and support 
            for your creative and academic projects.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: Printer, title: "Printing Services", desc: "Black & white and color printing, photocopying, and document scanning." },
              { icon: Box, title: "3D Printing", desc: "Bring your designs to life with our 3D printing capabilities." },
              { icon: Scissors, title: "Binding & Finishing", desc: "Spiral binding, lamination, and document finishing services." },
              { icon: Palette, title: "Creative Workspace", desc: "Collaborative spaces with tools for creative projects and prototyping." },
            ].map((s) => (
              <div key={s.title} className="card">
                <s.icon className="h-10 w-10 text-maroon-600" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-linear-to-r from-maroon-800 to-maroon-900 p-8 text-center text-white">
            <h3 className="font-heading text-xl font-bold">Need Printing or 3D Printing?</h3>
            <p className="mt-2 text-maroon-200">Visit us at the Creation Center or book an appointment online.</p>
            <Link href="/forms/appointment" className="btn-gold mt-6 inline-flex">Book Appointment</Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800"><MapPin className="h-5 w-5" /> Location</h3>
              <p className="mt-2 text-sm text-gray-600">University Library Building, MSEUF Campus</p>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800"><Clock className="h-5 w-5" /> Hours</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
                <p>Saturday: 8:00 AM – 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
