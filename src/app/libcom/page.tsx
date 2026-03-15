import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { MessageSquare, Users, Calendar, Bell } from "lucide-react";

export const metadata: Metadata = { title: "LIB.COM" };

export default function LibComPage() {
  return (
    <>
      <PageHeader
        title="LIB.COM"
        subtitle="Official and exclusive student organization of the Bachelor of Library and Information Science"
        breadcrumbs={[{ label: "LIB.COM" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-16">
          
          {/* Official WordPress Content with Logo */}
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                src="https://envergalibrary.wordpress.com/wp-content/uploads/2014/09/lib-com_logo.jpg" 
                alt="LIB.COM Logo" 
                className="w-full rounded-2xl shadow-sm border border-gray-100"
              />
            </div>
            <div className="w-full md:w-2/3 space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                <strong className="text-gray-900 font-semibold">LIB.COM</strong> is an official and exclusive student organization of the Bachelor of Library and Information Science. 
              </p>
              <p>
                The Bachelor of Library and Information Science (BLIS) program is designed to provide students with knowledge and skills on the theories and concepts of the provision of library and information services. It includes topics on the basic principles and fundamental laws of library science. The program seeks to train students on the management of libraries and the techniques of effective librarianship as well as management of information systems for better organization and use of information resources.
              </p>
            </div>
          </section>

          {/* Original System Design Content */}
          <section className="space-y-12 border-t border-gray-100 pt-16">
            <div>
              <p className="text-center text-lg text-gray-600 leading-relaxed">
                LIB.COM is the university library&apos;s communication and engagement platform. 
                Stay updated with library announcements, events, and community activities.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
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

            {/* History and details section */}
            <div className="space-y-12">
              <section>
                <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900 border-b border-gray-100 pb-2">History of LIB.COM</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
                  <p>
                    Lib.Com is an organization of the Bachelor of Library and Information Science (BLIS) students of the Manuel S. Enverga University Foundation. It was formerly known as Knowledge and Information Specialist Society (KISS) which was organized in 2003 by the students of BSED major in Library Science.
                  </p>
                  <p>
                    Lib.Com was organized through the cooperation of the Director of the University Libraries, Dr. Augusta Rosario A. Villamater. At present, Lib.Com has 37 members who are engaging in different activities concerning library and books.
                  </p>
                </div>
              </section>

            <div className="grid gap-8 md:grid-cols-2">
              <section className="bg-maroon-50 rounded-2xl p-6 border border-maroon-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-maroon-200" />
                <div className="relative">
                  <h2 className="mb-3 font-heading text-xl font-bold text-maroon-900">MISSION</h2>
                  <p className="text-gray-800 leading-relaxed text-[15px]">
                    The LIB.COM is committed to promote librarianship, create and establish a camaraderie among each members and people around them. To build up a community that will enhance the skills of the associates responsive to the needs of the organization.
                  </p>
                </div>
              </section>

              <section className="bg-maroon-50 rounded-2xl p-6 border border-maroon-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-maroon-200" />
                 <div className="relative">
                  <h2 className="mb-3 font-heading text-xl font-bold text-maroon-900">VISION</h2>
                  <p className="text-gray-800 leading-relaxed text-[15px]">
                    LIB.COM exists to perform its opportunity in the promotion of library and information science profession in the university.
                  </p>
                 </div>
              </section>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <section className="rounded-2xl p-6 border border-gray-100 shadow-sm bg-white">
                <h2 className="mb-4 font-heading text-xl font-bold text-gray-900">Objectives</h2>
                <ol className="list-decimal list-outside ml-4 space-y-3 text-gray-600 leading-relaxed text-[15px]">
                  <li><span className="text-gray-700">To uphold the mission statement of the university and the college of education and be instrumental in its ultimate realization.</span></li>
                  <li><span className="text-gray-700">To promote love for books, and other information materials.</span></li>
                  <li><span className="text-gray-700">To encourage the good reading habits, and develop research.</span></li>
                  <li><span className="text-gray-700">To promote research in various aspects of information science.</span></li>
                  <li><span className="text-gray-700">To outreach the non-member students and network them with other Library and Information Science (LIS) students.</span></li>
                  <li><span className="text-gray-700">To contribute to overall development of the library and information science profession and create an impression in social developments.</span></li>
                </ol>
              </section>

              <section className="rounded-2xl p-6 border border-gray-100 shadow-sm bg-white h-fit">
                <h2 className="mb-4 font-heading text-xl font-bold text-gray-900">Core Values</h2>
                <ol className="list-decimal list-outside ml-4 space-y-3 text-gray-600 leading-relaxed text-[15px]">
                  <li><span className="text-gray-700">Leadership through demonstrated example.</span></li>
                  <li><span className="text-gray-700">Respect for one&apos;s reading habits.</span></li>
                  <li><span className="text-gray-700">Harmony with reading materials.</span></li>
                  <li><span className="text-gray-700">Personal commitment for worthwhile spending of leisure time.</span></li>
                  <li><span className="text-gray-700">Unity for the common good of each member and the other organization.</span></li>
                </ol>
              </section>
            </div>

          </section>

        </div>
      </div>
    </>
  );
}
