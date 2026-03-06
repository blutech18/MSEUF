import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Quality Objectives",
  description:
    "MSEUF University Library quality objectives — our commitment to excellence in library services and user satisfaction.",
};

const QUALITY_OBJECTIVES = [
  {
    id: 1,
    objective:
      "To maintain a 95% user satisfaction rating through responsive and courteous service delivery.",
  },
  {
    id: 2,
    objective:
      "To ensure 98% availability of core library resources and systems during operating hours.",
  },
  {
    id: 3,
    objective:
      "To process book requests and inter-library loans within 24–48 hours.",
  },
  {
    id: 4,
    objective:
      "To provide timely orientation and information literacy sessions for new students each semester.",
  },
  {
    id: 5,
    objective:
      "To continuously expand the digital collection and maintain up-to-date subscriptions to academic databases.",
  },
  {
    id: 6,
    objective:
      "To achieve zero critical complaints regarding service quality through proactive feedback mechanisms.",
  },
  {
    id: 7,
    objective:
      "To support faculty research by providing specialized reference assistance and resource recommendations.",
  },
  {
    id: 8,
    objective:
      "To maintain a clean, organized, and conducive physical environment for study and research.",
  },
  {
    id: 9,
    objective:
      "To comply with ISO quality standards and institutional accreditation requirements.",
  },
  {
    id: 10,
    objective:
      "To foster partnerships with other academic libraries for resource sharing and professional development.",
  },
];

export default function QualityObjectivesPage() {
  return (
    <>
      <PageHeader
        title="Quality Objectives"
        subtitle="Our commitment to excellence in library services"
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Quality Objectives" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-subtitle">
              The MSEUF University Library establishes clear quality objectives
              to ensure consistent, high-quality service delivery and continuous
              improvement aligned with institutional goals.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {QUALITY_OBJECTIVES.map((item) => (
              <div
                key={item.id}
                className="card flex items-start gap-4 transition-all hover:border-maroon-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon-50 text-maroon-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    {item.objective}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-maroon-50 p-8 text-center">
            <p className="text-lg font-medium text-maroon-800">
              These objectives are reviewed annually and aligned with the
              university&apos;s strategic plan and accreditation standards.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
