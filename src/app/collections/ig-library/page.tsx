import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink, BookOpen, Globe, Download } from "lucide-react";

export const metadata: Metadata = { title: "IG Library" };

export default function IGLibraryPage() {
  return (
    <>
      <PageHeader title="IG Library" subtitle="E-books from international publishers" breadcrumbs={[{ label: "Collections" }, { label: "IG Library" }]} />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            IG Library (IGPublish) provides access to e-books from leading international publishers 
            covering a wide range of academic subjects.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: BookOpen, title: "E-Books", desc: "Thousands of titles from top publishers." },
              { icon: Globe, title: "Global Content", desc: "International academic publications." },
              { icon: Download, title: "Online Reading", desc: "Read online with bookmarking and notes." },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <f.icon className="mx-auto h-8 w-8 text-maroon-600" />
                <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
          <a href="http://portal.igpublish.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex gap-2">
            <ExternalLink className="h-4 w-4" /> Access IG Library
          </a>
          <p className="text-sm text-gray-500">Accessible on campus network. Contact library for off-campus credentials.</p>
        </div>
      </div>
    </>
  );
}
