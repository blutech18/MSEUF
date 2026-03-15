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
              The Periodicals Section is the central hub for journals, magazines, newspapers, 
              and serial literature. We maintain an extensive collection of current information 
              resources to support the university's research and academic curriculum.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Newspaper, title: "70+ Print Titles", desc: "Current local and national newspapers and specialized magazines." },
                { icon: Globe, title: "4,000+ Online", desc: "Digital access to world-class journals via ProQuest and Gale databases." },
                { icon: BookOpen, title: "Back Issues", desc: "Bound and unbound back issues of academic journals for longitudinal research." },
              ].map((item) => (
                <div key={item.title} className="card text-center transition-all hover:border-maroon-100">
                  <item.icon className="mx-auto h-8 w-8 text-maroon-600" />
                  <h3 className="mt-3 font-heading text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
              <h3 className="font-heading text-xl font-bold text-maroon-800">Section Services</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon-600"></div>
                  <p className="text-sm text-gray-700">Display of latest local and foreign newspapers.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon-600"></div>
                  <p className="text-sm text-gray-700">Digital indexing of journal articles for easy retrieval.</p>
                </li>
              </ul>
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
