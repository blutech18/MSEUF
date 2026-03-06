import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink, FileText, Globe, BookOpen } from "lucide-react";

export const metadata: Metadata = { title: "Philippine E-Journal" };

export default function PhilippineEJournalPage() {
  return (
    <>
      <PageHeader title="Philippine E-Journal" subtitle="Local research publications and academic journals" breadcrumbs={[{ label: "Collections" }, { label: "Philippine E-Journal" }]} />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            The Philippine E-Journal portal provides access to peer-reviewed academic journals 
            published by Filipino researchers and institutions, supporting local research and scholarship.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: FileText, title: "Local Journals", desc: "Philippine peer-reviewed publications." },
              { icon: Globe, title: "Open Access", desc: "Free access to many Filipino research outputs." },
              { icon: BookOpen, title: "Multi-Discipline", desc: "Covers sciences, humanities, education, and more." },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <f.icon className="mx-auto h-8 w-8 text-maroon-600" />
                <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
          <a href="https://ejournals.ph" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex gap-2">
            <ExternalLink className="h-4 w-4" /> Access Philippine E-Journal
          </a>
        </div>
      </div>
    </>
  );
}
