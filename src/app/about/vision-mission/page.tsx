import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Target, Eye, Flag, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Vision, Mission & Goal",
  description:
    "MSEUF University Library's vision, mission, and goal — committed to academic excellence and lifelong learning.",
};

export default function VisionMissionPage() {
  return (
    <>
      <PageHeader
        title="Vision, Mission & Goal"
        subtitle="Guiding principles of the MSEUF University Library"
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Vision, Mission & Goal" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page space-y-16">
          {/* Vision */}
          <div className="card border-l-4 border-l-gold-500">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-800 text-gold-400">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-maroon-800">
                  Vision
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-700">
                  The MSEUF University Library envisions itself as a premier
                  academic resource center in the Southern Tagalog Region,
                  providing world-class information services and fostering a
                  culture of lifelong learning, research excellence, and
                  intellectual growth for the entire MSEUF community.
                </p>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="card border-l-4 border-l-gold-500">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-800 text-gold-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-maroon-800">
                  Mission
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-700">
                  To support the academic and research needs of MSEUF students,
                  faculty, and staff by providing comprehensive access to
                  print and digital resources, innovative library services,
                  and a conducive learning environment that promotes
                  discovery, critical thinking, and scholarly achievement.
                </p>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div className="card border-l-4 border-l-gold-500">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-800 text-gold-400">
                <Flag className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-maroon-800">
                  Goal
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-700">
                  To be the largest and most accessible university library in
                  the Southern Tagalog Region, continuously expanding our
                  collections, enhancing our digital infrastructure, and
                  delivering exceptional service that empowers every user to
                  achieve their academic and professional aspirations.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values Callout */}
          <div className="rounded-2xl bg-linear-to-br from-maroon-800 to-maroon-900 p-8 text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-gold-400" />
              <h2 className="font-heading text-2xl font-bold">
                Our Commitment
              </h2>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-maroon-100">
              Guided by our vision, mission, and goal, the MSEUF University
              Library remains dedicated to excellence in service, innovation
              in delivery, and unwavering support for the academic mission of
              Manuel S. Enverga University Foundation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
