import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, ExternalLink, Laptop, Globe } from "lucide-react";

export const metadata: Metadata = { title: "E-Books" };

const PLATFORMS = [
  { name: "IG Library", url: "https://portal.igpublish.com", desc: "Access thousands of e-books across multiple disciplines from international publishers." },
  { name: "ProQuest Ebook Central", url: "https://www.proquest.com", desc: "Digital textbooks and scholarly works available for online reading." },
  { name: "EBSCO eBooks", url: "https://search.ebscohost.com", desc: "Collection of academic e-books with offline reading capabilities." },
];

export default function EBooksPage() {
  return (
    <>
      <PageHeader title="E-Books" subtitle="Access digital books and publications online" breadcrumbs={[{ label: "Collections" }, { label: "E-Books" }]} />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: BookOpen, label: "Digital Titles", value: "5,000+" },
              { icon: Laptop, label: "24/7 Access", value: "Online" },
              { icon: Globe, label: "Platforms", value: "3+" },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <s.icon className="mx-auto h-8 w-8 text-maroon-600" />
                <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="card flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{p.desc}</p>
                </div>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 gap-2 text-xs">
                  Access <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-maroon-50 border border-maroon-200 p-6">
            <p className="text-sm text-maroon-800">
              <strong>Access Note:</strong> E-books are available on campus through the library network. 
              For off-campus access, please contact the library for login credentials.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
