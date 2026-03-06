import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Mail, User, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Library Personnel",
  description:
    "Meet the MSEUF University Library staff — our dedicated team serving the academic community.",
};

const STAFF = [
  {
    id: 1,
    name: "Dr. Maria Elena Santos",
    role: "University Librarian / Director",
    email: "library.director@mseuf.edu.ph",
    section: "Administration",
  },
  {
    id: 2,
    name: "Engr. Roberto Cruz",
    role: "Assistant University Librarian",
    email: "assistant.librarian@mseuf.edu.ph",
    section: "Administration",
  },
  {
    id: 3,
    name: "Ms. Ana Maria Reyes",
    role: "Section Head",
    email: "circulation@mseuf.edu.ph",
    section: "Circulation and Reserve",
  },
  {
    id: 4,
    name: "Mr. Juan Carlos dela Cruz",
    role: "Section Head",
    email: "reference@mseuf.edu.ph",
    section: "Reference and Filipiniana",
  },
  {
    id: 5,
    name: "Ms. Patricia Fernandez",
    role: "Section Head",
    email: "periodicals@mseuf.edu.ph",
    section: "Periodicals",
  },
  {
    id: 6,
    name: "Mr. Miguel Santiago",
    role: "Section Head",
    email: "luiss@mseuf.edu.ph",
    section: "Library User Information System",
  },
  {
    id: 7,
    name: "Ms. Carmen Villanueva",
    role: "Section Head",
    email: "emrc@mseuf.edu.ph",
    section: "Educational Media Resource Center",
  },
  {
    id: 8,
    name: "Ms. Lourdes Mendoza",
    role: "Librarian",
    email: "igsrl@mseuf.edu.ph",
    section: "Institute of Graduate Studies & Research Library",
  },
];

export default function PersonnelPage() {
  return (
    <>
      <PageHeader
        title="Library Personnel"
        subtitle="Meet our dedicated library staff"
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Library Personnel" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-subtitle">
              The MSEUF University Library is staffed by qualified professionals
              committed to providing excellent service and support to students,
              faculty, and researchers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STAFF.map((person) => (
              <div
                key={person.id}
                className="card group text-center transition-all hover:border-maroon-200 hover:shadow-lg"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon-800 text-gold-400 transition-colors group-hover:bg-maroon-900">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-maroon-800">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-gold-600">
                  {person.role}
                </p>
                <p className="mt-2 text-xs text-gray-500">{person.section}</p>
                <a
                  href={`mailto:${person.email}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-maroon-600 hover:text-maroon-800"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {person.email}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 rounded-2xl bg-maroon-800 p-6 text-white">
            <Users className="h-6 w-6 text-gold-400" />
            <p className="text-center text-sm text-maroon-100">
              For general inquiries, visit the library or contact us during
              operating hours. We are here to help you succeed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
