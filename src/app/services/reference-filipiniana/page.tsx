import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, MapPin, Clock, Globe, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Reference and Filipiniana Section",
};

export default function ReferenceFilipianaPage() {
  return (
    <>
      <PageHeader
        title="Reference and Filipiniana Section"
        subtitle="Philippine-authored materials, references, and research support"
        breadcrumbs={[
          { label: "Services", href: "/services/reference-filipiniana" },
          { label: "Reference and Filipiniana" },
        ]}
      />

      <div className="container-page section-padding">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              The Reference and Filipiniana Section houses Philippine-authored materials, 
              encyclopedias, dictionaries, atlases, and other reference resources. This section 
              supports research and academic work by providing access to authoritative sources 
              and Filipino literary heritage.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: BookOpen, title: "Reference Collection", desc: "Encyclopedias, dictionaries, almanacs, atlases, and other non-circulating reference materials." },
                { icon: Globe, title: "Filipiniana Collection", desc: "Books, journals, and documents by Filipino authors or about the Philippines." },
                { icon: FileText, title: "Theses & Dissertations", desc: "Research papers and academic works by MSEUF students and faculty." },
                { icon: MapPin, title: "Readers' Assistance", desc: "Professional assistance in locating materials and conducting research." },
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
              <p className="mt-2 text-sm text-gray-600">1st Floor, University Library Building</p>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800">
                <Clock className="h-5 w-5" /> Service Hours
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Monday – Friday: 7:00 AM – 7:00 PM</p>
                <p>Saturday: 8:00 AM – 5:00 PM</p>
              </div>
            </div>
            <div className="rounded-xl bg-maroon-50 border border-maroon-200 p-6">
              <p className="text-sm font-medium text-maroon-800">Note: Reference materials are for in-library use only and cannot be borrowed.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
