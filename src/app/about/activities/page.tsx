import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Calendar, MapPin, BookOpen, Users, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "MSEUF University Library events and activities — orientations, book fairs, and literacy programs.",
};

const ACTIVITIES = [
  {
    id: 1,
    title: "Library Orientation for New Students",
    date: "August 2024",
    description:
      "Comprehensive orientation sessions introducing new students to library services, OPAC usage, and digital resources.",
    icon: GraduationCap,
    category: "Orientation",
  },
  {
    id: 2,
    title: "Book Fair & Reading Month",
    date: "November 2024",
    description:
      "Annual book fair featuring local publishers and discounted academic titles. Reading month activities and contests.",
    icon: BookOpen,
    category: "Events",
  },
  {
    id: 3,
    title: "Information Literacy Workshop",
    date: "September 2024",
    description:
      "Hands-on workshops on database search strategies, citation management, and avoiding plagiarism.",
    icon: Users,
    category: "Workshop",
  },
  {
    id: 4,
    title: "Research Support Sessions",
    date: "Ongoing",
    description:
      "One-on-one and group sessions for thesis and research support. Schedule an appointment through the library.",
    icon: GraduationCap,
    category: "Support",
  },
  {
    id: 5,
    title: "Library Week Celebration",
    date: "April 2024",
    description:
      "Special activities, exhibits, and recognition of top library users. Join us for a week of learning and fun.",
    icon: Calendar,
    category: "Events",
  },
  {
    id: 6,
    title: "E-Resource Training",
    date: "October 2024",
    description:
      "Training sessions on ProQuest, EBSCO, IG Library, and Philippine E-Journal. Learn to maximize our digital collections.",
    icon: BookOpen,
    category: "Workshop",
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <PageHeader
        title="Activities"
        subtitle="Library events and programs"
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Activities" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-subtitle">
              The MSEUF University Library hosts a variety of events,
              orientations, and programs throughout the year to engage our
              community and promote lifelong learning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                className="card group transition-all hover:border-maroon-200 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-800 text-gold-400 transition-colors group-hover:bg-maroon-900">
                    <activity.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block rounded-full bg-maroon-50 px-2.5 py-0.5 text-xs font-medium text-maroon-700">
                      {activity.category}
                    </span>
                    <h3 className="mt-2 font-heading text-lg font-semibold text-maroon-800">
                      {activity.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {activity.date}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-linear-to-r from-maroon-800 to-maroon-900 p-8 text-white">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-gold-400" />
              <h2 className="font-heading text-xl font-bold">
                Stay Updated
              </h2>
            </div>
            <p className="mt-3 text-maroon-100">
              For the latest schedule of library activities, visit our office,
              check the bulletin boards, or follow our official announcements.
              Contact the library for inquiries about upcoming events.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
