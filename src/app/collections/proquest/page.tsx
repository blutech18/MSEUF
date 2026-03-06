import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink, Search, FileText, GraduationCap } from "lucide-react";

export const metadata: Metadata = { title: "ProQuest" };

export default function ProQuestPage() {
  return (
    <>
      <PageHeader title="ProQuest" subtitle="Academic journals, dissertations, and scholarly content" breadcrumbs={[{ label: "Collections" }, { label: "ProQuest" }]} />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            ProQuest provides access to a vast collection of academic journals, dissertations, theses, 
            newspapers, and scholarly content across multiple disciplines.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Search, title: "Advanced Search", desc: "Search across millions of academic papers." },
              { icon: GraduationCap, title: "Dissertations", desc: "Access global dissertations and theses." },
              { icon: FileText, title: "Full Text", desc: "Download and read full-text articles." },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <f.icon className="mx-auto h-8 w-8 text-maroon-600" />
                <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
          <a href="https://www.proquest.com/search" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex gap-2">
            <ExternalLink className="h-4 w-4" /> Access ProQuest
          </a>
          <p className="text-sm text-gray-500">Accessible on campus network. Contact library for off-campus credentials.</p>
        </div>
      </div>
    </>
  );
}
