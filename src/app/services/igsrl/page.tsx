import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { GraduationCap, BookOpen, FileText, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Institute of Graduate Studies & Research Library",
};

export default function IGSRLPage() {
  return (
    <>
      <PageHeader
        title="Institute of Graduate Studies & Research Library"
        subtitle="Dedicated resources for graduate-level research and academic excellence"
        breadcrumbs={[
          { label: "Services", href: "/services/igsrl" },
          { label: "IGSRL" },
        ]}
      />

      <div className="container-page section-padding">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              The IGSRL provides specialized resources and services for graduate students, 
              researchers, and faculty members. The collection includes advanced academic 
              materials, research journals, dissertations, and digital databases.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: GraduationCap, title: "Graduate Materials", desc: "Specialized collections for master's and doctoral-level research across all disciplines." },
                { icon: FileText, title: "Research Papers", desc: "Access to institutional repository of theses, dissertations, and faculty research." },
                { icon: BookOpen, title: "Academic Journals", desc: "Subscriptions to international and local peer-reviewed academic journals." },
              ].map((item) => (
                <div key={item.title} className="card">
                  <item.icon className="h-8 w-8 text-maroon-600" />
                  <h3 className="mt-3 font-heading text-lg font-semibold text-gray-900">{item.title}</h3>
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
              <p className="mt-2 text-sm text-gray-600">IGSRL Building, MSEUF Campus</p>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800">
                <Clock className="h-5 w-5" /> Service Hours
              </h3>
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
