import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { MessageSquare, Users, Calendar, Bell } from "lucide-react";

export const metadata: Metadata = { title: "LIB.COM" };

export default function LibComPage() {
  return (
    <>
      <PageHeader
        title="LIB.COM"
        subtitle="Library Communication Platform for students and staff"
        breadcrumbs={[{ label: "LIB.COM" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-lg text-gray-600 leading-relaxed">
            LIB.COM is the university library&apos;s communication and engagement platform. 
            Stay updated with library announcements, events, and community activities.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Bell, title: "Announcements", desc: "Stay informed about library updates, new acquisitions, and policy changes." },
              { icon: Calendar, title: "Events", desc: "Upcoming library events, workshops, seminars, and book fairs." },
              { icon: Users, title: "Community", desc: "Connect with fellow readers, join book clubs, and participate in discussions." },
              { icon: MessageSquare, title: "Feedback", desc: "Share your suggestions and help us improve our services." },
            ].map((item) => (
              <div key={item.title} className="card">
                <item.icon className="h-8 w-8 text-maroon-600" />
                <h3 className="mt-3 font-heading text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
