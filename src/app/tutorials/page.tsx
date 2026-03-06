import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, Search, Database, Monitor, Globe, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Tutorials" };

const TUTORIALS = [
  { icon: Search, title: "How to Search the Catalog", desc: "Learn to use Follett Destiny OPAC to find books by title, author, subject, or keywords.", category: "Getting Started" },
  { icon: Database, title: "Accessing Digital Databases", desc: "Step-by-step guide to accessing ProQuest, EBSCO, IG Library, and Philippine E-Journal.", category: "Digital Resources" },
  { icon: BookOpen, title: "Using the Dewey Decimal System", desc: "Understanding call numbers and how to locate books on library shelves.", category: "Getting Started" },
  { icon: Globe, title: "Off-Campus Database Access", desc: "How to access library digital resources from outside the campus network.", category: "Digital Resources" },
  { icon: Monitor, title: "Using Library Computer Stations", desc: "Guidelines for using LUISS computer workstations for research.", category: "Facilities" },
  { icon: FileText, title: "Citing Sources Properly", desc: "Guide to APA, MLA, and Chicago citation formats for academic papers.", category: "Research" },
];

export default function TutorialsPage() {
  return (
    <>
      <PageHeader
        title="Tutorials"
        subtitle="Learn how to make the most of library resources and services"
        breadcrumbs={[{ label: "Tutorials" }]}
      />
      <div className="container-page section-padding">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TUTORIALS.map((t) => (
            <div key={t.title} className="card group cursor-pointer">
              <span className="inline-block rounded-full bg-maroon-50 px-3 py-1 text-xs font-medium text-maroon-700">{t.category}</span>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700 transition-colors group-hover:bg-maroon-800 group-hover:text-white">
                <t.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">{t.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
