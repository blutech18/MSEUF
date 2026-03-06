import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink, BookOpen, Search, Monitor } from "lucide-react";

export const metadata: Metadata = { title: "Follett Destiny - OPAC" };

export default function FollettDestinyPage() {
  return (
    <>
      <PageHeader
        title="Follett Destiny (OPAC)"
        subtitle="Online Public Access Catalog for browsing the library collection"
        breadcrumbs={[{ label: "Follett Destiny" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Follett Destiny is our Online Public Access Catalog (OPAC) system. Use it to search 
              for books, check availability, and browse the complete library collection.
            </p>
            <a
              href="https://envergalibrary.com/follett"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 inline-flex gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Follett Destiny
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Search, title: "Search Catalog", desc: "Search by title, author, subject, ISBN, or keywords." },
              { icon: BookOpen, title: "Check Availability", desc: "View real-time availability status of library materials." },
              { icon: Monitor, title: "Browse Collection", desc: "Explore the complete catalog organized by classification." },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <item.icon className="mx-auto h-8 w-8 text-maroon-600" />
                <h3 className="mt-3 font-heading text-base font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Monitor className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">
              The Follett Destiny OPAC opens in a new window. You can also use our AI chatbot 
              to search the catalog directly from this website.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
