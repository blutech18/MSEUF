import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Mail, User, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Library Personnel",
  description:
    "Meet the MSEUF University Library staff — our dedicated team serving the academic community.",
};

const STAFF_GROUPS = [
  {
    section: "Administration",
    members: [
      {
        name: "Myrna Macapia-Casipit, RL, Ed.D",
        role: "Acting Director, University Libraries",
        credentials: "Ed.D, MLIS, RL",
        highlight: true,
      },
      {
        name: "Liberato A. Albacea",
        role: "EMRC Supervisor II",
        credentials: "BSECE",
      },
    ],
  },
  {
    section: "Circulation and Reserve Section",
    members: [
      {
        name: "Charlyn P. Salcedo, RL, MALS",
        role: "Librarian III",
        credentials: "MALS, RL",
      },
      {
        name: "Kim Davis Q. De Leon, RL",
        role: "Library Staff",
        credentials: "RL, MLIS (ongoing)",
      },
    ],
  },
  {
    section: "Reference and Filipiniana Section",
    members: [
      {
        name: "Aisa G. Zeta, RL, MLIS",
        role: "Librarian II",
        credentials: "MLIS, RL",
      },
      {
        name: "Illinois F. Lachica, RL",
        role: "Library Staff",
        credentials: "RL, MLIS (ongoing)",
      },
    ],
  },
  {
    section: "Technical Services Unit",
    members: [
      {
        name: "Geraldine M. Eustaquio, RL, MLIS",
        role: "Librarian II",
        credentials: "MLIS, RL",
      },
      {
        name: "Carolina B. Engaña",
        role: "Senior Library Staff",
        credentials: "BSBA, 36 units LS",
      },
    ],
  },
  {
    section: "Periodicals Section",
    members: [
      {
        name: "Zoren B. Alcantara, RL, MLIS",
        role: "Librarian II",
        credentials: "MLIS, RL",
      },
    ],
  },
  {
    section: "Institute of Graduate Studies & Research Library",
    members: [
      {
        name: "Princess Clanette L. Lazo, RL, MLIS",
        role: "Librarian I",
        credentials: "MLIS, RL",
      },
    ],
  },
  {
    section: "Library Users Information System Section",
    members: [
      {
        name: "Genevieve C. Calvendra, RL, MLIS",
        role: "Librarian I",
        credentials: "MLIS, RL",
      },
    ],
  },
  {
    section: "Basic Education Department Library",
    members: [
      {
        name: "Sheryl C. Farquerabao, RL, MLIS",
        role: "Librarian II",
        credentials: "MLIS, RL",
      },
      {
        name: "May A. Alcantara, RL, MLIS",
        role: "Librarian II",
        credentials: "MLIS, RL",
      },
      {
        name: "Danica H. Lanceta, RL",
        role: "Library Staff",
        credentials: "RL, MLIS (ongoing)",
      },
    ],
  },
  {
    section: "Enverga Law Library",
    members: [
      {
        name: "Christine Mae M. Frias, RL",
        role: "Library Staff",
        credentials: "RL, MLIS (ongoing)",
      },
    ],
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
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Our Professional Team</h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              The MSEUF University Library is led by qualified professionals 
              dedicated to providing exceptional service and supporting the 
              university's instructional and research programs.
            </p>
          </div>

          <div className="space-y-20">
            {STAFF_GROUPS.map((group) => (
              <div key={group.section}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <h3 className="font-heading text-xl font-bold text-maroon-800 uppercase tracking-widest px-4 text-center">
                    {group.section}
                  </h3>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((person) => (
                    <div
                      key={person.name}
                      className={`card group relative overflow-hidden transition-all hover:border-maroon-200 hover:shadow-xl ${
                        person.highlight ? 'ring-2 ring-maroon-100 border-maroon-100' : ''
                      }`}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="h-20 w-20 text-maroon-800" />
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-600 transition-transform group-hover:scale-110 shadow-sm ${
                          person.highlight ? 'bg-maroon-800 text-gold-400' : ''
                        }`}>
                          <User className="h-8 w-8" />
                        </div>

                        <div className="mt-6">
                          <h4 className="font-heading text-lg font-bold text-gray-900 group-hover:text-maroon-800 transition-colors">
                            {person.name}
                          </h4>
                          <p className="mt-1 text-sm font-semibold text-gold-600">
                            {person.role}
                          </p>
                          <div className="mt-4 flex items-center justify-center gap-2">
                             <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                               <Users className="h-3 w-3" />
                               {person.credentials}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col lg:flex-row items-center gap-8 rounded-[2.5rem] bg-linear-to-br from-maroon-800 to-maroon-950 p-10 lg:p-16 text-white shadow-2xl">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <Users className="h-8 w-8 text-gold-400" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="font-heading text-2xl font-bold">Dedicated to Excellence</h3>
              <p className="mt-2 text-lg text-maroon-100 italic">
                "Providing quality library services that support the university's 
                vision of becoming a globally competitive research institution."
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
