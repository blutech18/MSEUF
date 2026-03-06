import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Newspaper, BookOpen, Globe, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Periodicals Section" };

export default function PeriodicalsPage() {
  return (
    <>
      <PageHeader
        title="Periodicals Section"
        subtitle="Magazines, newspapers, journals, and serial publications"
        breadcrumbs={[{ label: "Services" }, { label: "Periodicals Section" }]}
      />
      <div className="container-page section-padding">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              The Periodicals Section maintains a comprehensive collection of magazines, newspapers, 
              journals, and other serial publications. These resources provide current information 
              and support academic research with up-to-date content.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Newspaper, title: "Newspapers", desc: "Daily local and national newspapers for current events." },
                { icon: BookOpen, title: "Journals", desc: "Academic and professional journals across disciplines." },
                { icon: Globe, title: "Magazines", desc: "Popular and scholarly magazines on various topics." },
              ].map((item) => (
                <div key={item.title} className="card text-center">
                  <item.icon className="mx-auto h-8 w-8 text-maroon-600" />
                  <h3 className="mt-3 font-heading text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800">
                <MapPin className="h-5 w-5" /> Location
              </h3>
              <p className="mt-2 text-sm text-gray-600">2nd Floor, University Library</p>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800">
                <Clock className="h-5 w-5" /> Hours
              </h3>
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
