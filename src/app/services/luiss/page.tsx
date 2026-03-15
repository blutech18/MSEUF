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
              The Library User Information System Section (LUISS) provides Internet workstations 
              for research and educational purposes. The facility is equipped with 14 computers, 
              including 7 dedicated Internet terminals, server units, makerspace workstations, 
              and faculty-accessible systems.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Monitor, title: "14 Workstations", desc: "Equipped for research, OPAC access, and academic projects." },
                { icon: Wifi, title: "Connectivity", desc: "High-speed internet access for authorized research activities." },
                { icon: Database, title: "Digital Access", desc: "Direct access to our subscribed databases and digital archives." },
              ].map((item) => (
                <div key={item.title} className="card text-center transition-all hover:border-maroon-100">
                  <item.icon className="mx-auto h-8 w-8 text-maroon-600" />
                  <h3 className="mt-3 font-heading text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
              <h3 className="font-heading text-xl font-bold text-blue-900">Usage Guidelines</h3>
              <ul className="mt-4 space-y-3 text-sm text-blue-700">
                <li className="flex gap-2">
                  <span className="font-bold underline">Research First:</span> Computer use is strictly for research and educational purposes. Social media and recreational games are prohibited.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold underline">Time Limit:</span> Students are entitled to 40 hours of internet use per month, with a maximum of 2 hours per day.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold underline">Access:</span> Valid student ID and library registration are required for login.
                </li>
              </ul>
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
