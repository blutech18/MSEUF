import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Monitor, Wifi, Database, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Library User Information System Section" };

export default function LUISSPage() {
  return (
    <>
      <PageHeader
        title="Library User Information System Section (LUISS)"
        subtitle="Technology services and digital access for library users"
        breadcrumbs={[{ label: "Services" }, { label: "LUISS" }]}
      />
      <div className="container-page section-padding">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              LUISS provides technology-based services including computer stations for research, 
              internet access, digital catalog access, and technical assistance for using 
              library information systems.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Monitor, title: "Computer Stations", desc: "Workstations with internet access for research and catalog browsing." },
                { icon: Wifi, title: "Internet Access", desc: "Wi-Fi connectivity for students using personal devices." },
                { icon: Database, title: "Digital Catalog", desc: "Access to OPAC and online databases from library terminals." },
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
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800"><MapPin className="h-5 w-5" /> Location</h3>
              <p className="mt-2 text-sm text-gray-600">University Library Building</p>
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
