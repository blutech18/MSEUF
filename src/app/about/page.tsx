import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { ABOUT_ITEMS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the MSEUF University Library — our vision, mission, personnel, and activities.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About the Library"
        subtitle="Learn about our mission, team, and programs"
        breadcrumbs={[{ label: "About" }]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card group flex items-center justify-between transition-all hover:border-maroon-200 hover:shadow-lg"
              >
                <span className="font-heading text-lg font-semibold text-maroon-800">
                  {item.label}
                </span>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-maroon-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
