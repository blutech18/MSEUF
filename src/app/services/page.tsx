import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  Newspaper, 
  Monitor, 
  Video,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Library Services",
  description: "Explore the various sections and services offered by the MSEUF University Libraries.",
};

const SERVICES = [
  {
    title: "Circulation and Reserve",
    subtitle: "CRS",
    description: "The core lending hub for textbooks and multi-disciplinary resources. Manages book loans, returns, and renewals.",
    icon: BookOpen,
    href: "/services/circulation-reserve",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Reference and Filipiniana",
    subtitle: "RFS",
    description: "General reference materials and a specialized collection of Philippine history, culture, and research collateral.",
    icon: Search,
    href: "/services/reference-filipiniana",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Graduate Studies & Research",
    subtitle: "IGSRL",
    description: "Dedicated research support for advanced studies, including theses, dissertations, and faculty-focused resources.",
    icon: GraduationCap,
    href: "/services/igsrl",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Periodicals Section",
    subtitle: "PS",
    description: "Daily newspapers, academic journals, and magazines. Provides access to thousands of titles via ProQuest and Gale.",
    icon: Newspaper,
    href: "/services/periodicals",
    color: "bg-purple-50 text-purple-700 border-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Technology & Systems",
    subtitle: "LUISS",
    description: "Your gateway to digital research. internet workstations, OPAC access, and technical library assistance.",
    icon: Monitor,
    href: "/services/luiss",
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Media Resource Center",
    subtitle: "EMRC",
    description: "Multimedia facilities, function rooms, and the Little Theater for academic presentations and events.",
    icon: Video,
    href: "/services/emrc",
    color: "bg-rose-50 text-rose-700 border-rose-100",
    iconColor: "text-rose-600",
  }
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive support for your academic and research journey"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Library Sections & Units</h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              The MSEUF University Library is organized into specialized sections to provide targeted 
              assistance and resources tailored to your specific academic needs.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Link
                key={service.subtitle}
                href={service.href}
                className="group flex flex-col h-full rounded-3xl border border-gray-100 bg-white p-8 transition-all hover:border-maroon-100 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} border transition-transform duration-300 group-hover:scale-110`}>
                  <service.icon className="h-7 w-7" />
                </div>
                
                <div className="mt-8 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-maroon-700">
                      {service.subtitle}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-maroon-800" />
                  </div>
                  
                  <h3 className="mt-2 font-heading text-xl font-bold text-gray-900 group-hover:text-maroon-800 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    {service.description}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-maroon-800 transition-opacity opacity-0 group-hover:opacity-100">
                  Explore Section
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 rounded-[2.5rem] bg-linear-to-br from-maroon-800 to-maroon-950 p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 h-64 w-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            
            <div className="flex-1 relative z-10">
              <h2 className="font-heading text-3xl font-bold">Need Research Assistance?</h2>
              <p className="mt-4 text-lg text-maroon-100 leading-relaxed max-w-xl">
                Our professional librarians are ready to guide you through our databases, 
                citation standards, and specialized collections.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/forms/appointment" className="btn-gold rounded-full px-8 py-3 font-bold">
                  Schedule Consultation
                </Link>
                <Link href="/about/personnel" className="rounded-full border border-white/20 bg-white/10 px-8 py-3 font-bold backdrop-blur-md transition-colors hover:bg-white/20">
                  Meet Our Staff
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <span className="block text-3xl font-bold text-gold-400">7:00</span>
                  <span className="text-sm font-medium text-maroon-200 uppercase tracking-wider">Opening Time</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mt-8">
                  <span className="block text-3xl font-bold text-gold-400">19:00</span>
                  <span className="text-sm font-medium text-maroon-200 uppercase tracking-wider">Closing Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
