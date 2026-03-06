import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Newsletter" };

const NEWSLETTERS = [
  { title: "Library Newsletter — Q1 2024", date: "March 2024", desc: "New digital resources, partnership with DLL, and upcoming events." },
  { title: "Library Newsletter — Q4 2023", date: "December 2023", desc: "Year-end review, new acquisitions, and reading programs." },
  { title: "Library Newsletter — Q3 2023", date: "September 2023", desc: "Orientation week activities, database training, and new services." },
  { title: "Library Newsletter — Q2 2023", date: "June 2023", desc: "Summer reading program, facility improvements, and staff updates." },
  { title: "Library Newsletter — Q1 2023", date: "March 2023", desc: "New year initiatives, research support programs, and EMRC updates." },
  { title: "Library Newsletter — Q4 2022", date: "December 2022", desc: "Annual report highlights, collection statistics, and plans for 2023." },
];

export default function NewsletterPage() {
  return (
    <>
      <PageHeader
        title="Newsletter"
        subtitle="Stay updated with the latest library news and events"
        breadcrumbs={[{ label: "Newsletter" }]}
      />
      <div className="container-page section-padding">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NEWSLETTERS.map((nl) => (
            <div key={nl.title} className="card group cursor-pointer">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                {nl.date}
              </div>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <Newspaper className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">{nl.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{nl.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-maroon-700 group-hover:text-maroon-900">
                Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
