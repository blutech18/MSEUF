import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink, Database, BookOpen, Search } from "lucide-react";

export const metadata: Metadata = { title: "EBSCO" };

export default function EBSCOPage() {
  return (
    <>
      <PageHeader title="EBSCO" subtitle="Multidisciplinary research databases" breadcrumbs={[{ label: "Collections" }, { label: "EBSCO" }]} />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            EBSCO provides access to a wide range of research databases including academic journals, 
            magazines, e-books, and other resources across all major subject areas.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Database, title: "Multi-Database", desc: "Search across multiple databases simultaneously." },
              { icon: BookOpen, title: "E-Books", desc: "Thousands of academic e-books available." },
              { icon: Search, title: "Smart Search", desc: "Advanced search tools with citation export." },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <f.icon className="mx-auto h-8 w-8 text-maroon-600" />
                <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
          <a href="http://search.ebscohost.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex gap-2">
            <ExternalLink className="h-4 w-4" /> Access EBSCO
          </a>
          <p className="text-sm text-gray-500">Accessible on campus network. Contact library for off-campus credentials.</p>
        </div>
      </div>
    </>
  );
}
