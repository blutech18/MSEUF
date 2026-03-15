"use client";

import { useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import { Calendar, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

const ACTIVITIES = [
  {
    title: "22nd Library Staff In-Service Training",
    date: "August 03, 2022",
    description: "The University Libraries, MSEUF Lucena City organized and conducted 22nd Library and EMRC Staff In-Service Training with a theme \"University Libraries in Digital Environment 2.0 Retooling Follett Destiny and Proquest\" last August 03, 2022. This activity aims to prepare the staff in the upcoming school year with the different and newest services of the library in the new normal set-up.",
    images: [
      "https://envergalibrary.wordpress.com/wp-content/uploads/2022/08/dsc_5719.jpg",
      "https://envergalibrary.wordpress.com/wp-content/uploads/2022/08/dsc_5754.jpg",
      "https://envergalibrary.wordpress.com/wp-content/uploads/2022/08/dsc_5671.jpg",
      "https://envergalibrary.wordpress.com/wp-content/uploads/2022/08/dsc_5813.jpg"
    ]
  },
  {
    title: "Video Spoken Word Poetry: Loverary Stories",
    date: "2020",
    description: "Congratulations to the winner of the Video Spoken word Poetry with the theme LoveRary Stories from the heart amidst COVID-19 Pandemic. Cash prizes for the top five winners and consolation for the participants were awarded.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2022/08/loverary-2022.jpg"]
  },
  {
    title: "LoveRary Day 2021: Magical Love at the EU Library",
    date: "2021",
    description: "Congratulations to the winners of the Video Spoken word Poetry with the theme LoveRary Day 2021: Magical Love at the EU Library. share your Experiences, Thoughts, and Hopes.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/154672766_10158770411442347_8262212738209875121_n.jpg"]
  },
  {
    title: "Christmas Fam-boding: Reading together",
    date: "July 1, 2021",
    description: "Congratulations to the winners of the Photography contest with the theme Christmas Fam-boding: Reading together amidst COVID-19.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/131402595_10158585318927347_5139965617230261706_n.jpg"]
  },
  {
    title: "Zombie Reading Habit Photography Contest",
    date: "June 1, 2021",
    description: "Be scary with your favorite books! Congratulations to the winners of the Photography contest with the theme Zombie Reading Habit.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/photography-contest.png"]
  },
  {
    title: "20th Library Staff In-Service Training",
    date: "August 07, 2020",
    description: "The University Libraries conducted their 20th Library Staff In-Service Training with a theme of \"Flexibility and Adaptability of EU Library in the New Normal Environment\".",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/edited-100-3.jpg"]
  },
  {
    title: "Library REAdS through Instructions",
    date: "October 29, 2012",
    description: "The University Libraries held its 12th Library & EMRC In-service Training focused on Reviewing, Evolving, and Advancing Services through instructions.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2012/11/12th-in-service-training2.jpg"]
  },
  {
    title: "Teaching Information Literacy",
    date: "August 17, 2012",
    description: "The Philippine Association of School Librarians, Inc. (PASLI) conducted a half-day seminar-workshop on Teaching Information Literacy to School-Age Children.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2012/10/pasli-enverga2.jpg"]
  },
  {
    title: "Organization of Library Materials",
    date: "September 14, 2012",
    description: "Librarians Association of Quezon Province-Lucena, Inc. (LAQueP-LInc) workshop on Organization of Library Materials.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2012/10/laquep-linc-2012.jpg"]
  },
  {
    title: "Revisiting Libraries' Collection",
    date: "August 15, 2012",
    description: "The PLAI-STRLC National Conference aimed to provide significance of collection management in the new era of challenges.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2012/10/plai-strlc-20124.jpg"]
  },
  {
    title: "11th In-Service-Training",
    date: "June 5, 2012",
    description: "Theme: \"Building Info-Skills by Design: Embedding Information Literacy in Library Services\".",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/building-info-skills.png"]
  },
  {
    title: "Springer Southeast Asia Road Show",
    date: "June 26, 2012",
    description: "Changing your library for new generation users. Conducted by Springer, one of the world's largest international publishers.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2012/07/springer.png"]
  },
  {
    title: "Preservation of Paper-Based Collection",
    date: "May 30, 2012",
    description: "Society of Filipino Archivists 3-day seminar workshop on Preservation of Paper-Based Collection.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/sfa-2012.jpg"]
  },
  {
    title: "K to 12 Curriculum and the School Library",
    date: "May 18, 2012",
    description: "PASLI forum on the direction and support for school curriculum development plans.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/pasli_k-to-12.jpg"]
  },
  {
    title: "Managing Digitization & Research Projects",
    date: "April 20, 2012",
    description: "PAARL National Summer Conference on emerging trends in library digitization projects.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/coron.jpg"]
  },
  {
    title: "ALAM 2012",
    date: "March 9, 2012",
    description: "Advancements in Libraries, Archives, and Museums: Organization of Information Resources and Converging Practices.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/cdo.jpg"]
  },
  {
    title: "Teaching Info Literacy in School Media Centers",
    date: "January 27, 2012",
    description: "PASLI seminar-workshop to help professional librarians upgrade information skills.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/pasli_c-and-e.jpg"]
  },
  {
    title: "Media Literacy for School Librarians",
    date: "October 13, 2011",
    description: "PASLI sponsored seminar-forum on Media Literacy and School Library Standards.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2011/12/paslimiriam.jpg"]
  },
  {
    title: "Risk Preparedness for Cultural Heritage",
    date: "September 20, 2011",
    description: "Seminar on the Conservation of Built Heritage including integrated emergency management.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/mi-casa.jpg"]
  },
  {
    title: "32nd MIBF Forum",
    date: "September 15, 2011",
    description: "Association of Special Libraries of the Philippines forum on Web Safety and Security.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/mibf-forum.jpg"]
  },
  {
    title: "Emergency and Recovery Team Training",
    date: "August 12, 2011",
    description: "SFA Seminar-Workshop on Emergency and Recovery Team for Records and Heritage Collections.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/dumaguete-city.jpg"]
  },
  {
    title: "Collection Assessment: Tools and Methodologies",
    date: "August 12, 2011",
    description: "PNULISAA seminar workshop held at East Point Hotel by the Sea, Marinduque.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/picture-not-available.jpg?w=150"]
  },
  {
    title: "Library Services & Teaching Portfolios",
    date: "July 13, 2011",
    description: "PAARL lecture-forum on collecting and creating professional portfolios.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/10th-in-service-training.jpg"]
  },
  {
    title: "Library Operations in a Virtual Environment",
    date: "2011",
    description: "10th In-service training on cutting-edge library services for Gen X, Y, and Z clienteles.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/10th-in-service-training.jpg"]
  },
  {
    title: "Bibliotherapy Services",
    date: "May 20, 2011",
    description: "PAARL modular training program on bibliotherapy services through book prescription shops.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/bibliotheraphy.jpg?w=150"]
  },
  {
    title: "3rd National Electronic Subscribers Conference",
    date: "May 13, 2011",
    description: "CE Logic National Conference focused on leveling up electronic library resources.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/picture-not-available.jpg?w=150"]
  },
  {
    title: "Empowering School Administrators",
    date: "May 12, 2011",
    description: "PASLI three-day national seminar-workshop in Baguio City for library service empowerment.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/pasli-baguio-city-2011.jpg?w=150"]
  },
  {
    title: "Library Study Tour 2011",
    date: "May 6, 2011",
    description: "LAQuePLInc study tour of selected libraries and museums in Manila.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/laquep-linc-tour-2011.jpg?w=150"]
  },
  {
    title: "Library Strategic Planning 2011",
    date: "April 9, 2011",
    description: "Annual strategic planning session held at Ouan's Worth Farm and Resort.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/strat-plan-2011.jpg?w=150"]
  },
  {
    title: "Standardization of Library Services",
    date: "April 15, 2011",
    description: "PLAI summer conference in Calapan City on accreditation and standardization.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/plai-strlc-mindoro.jpg?w=300"]
  },
  {
    title: "LibSpeak 2011: Evolve. Engage. Energize.",
    date: "February 26, 2011",
    description: "UP FLIPP conference for BLIS students held at UP Diliman.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/upflipp.jpg?w=150"]
  },
  {
    title: "Handling Difficult Library Customers",
    date: "February 18, 2011",
    description: "PAARL forum entitled \"Face2Face: Finding your Balance in Handling Difficult Library Customers\".",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/face-to-face.jpg?w=300"]
  },
  {
    title: "PAARL General Assembly 2011",
    date: "January 28, 2011",
    description: "Annual general assembly held at the National Library of the Philippines Auditorium.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/paarl-assembly1.jpg?w=150"]
  },
  {
    title: "Keeping Records and Archives",
    date: "December 10, 2010",
    description: "SFA Seminar-Workshop in Baguio City on maintaining and controlling institutional records.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/sfa2010.jpg?w=150"]
  },
  {
    title: "Photo-documentation of School Events",
    date: "November 12, 2010",
    description: "PASLI workshop on archiving and documentation held at Powerbooks, Makati.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/pasli-greenbelt.jpg?w=150"]
  },
  {
    title: "Follett CirCat Training",
    date: "2010",
    description: "Comprehensive training course on library automation software held in Davao City.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/davao-training.jpg?w=150"]
  },
  {
    title: "Storytelling as Marketing Tool",
    date: "September 18, 2010",
    description: "LAQueP-LInc forum on storytelling techniques for library promotion.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2010/09/laquep-linc-storytelling.jpg?w=300"]
  },
  {
    title: "Parallel Session: Library and Web 2011",
    date: "August 20, 2010",
    description: "PAARL workshop in Angeles City on the integration of Web 2.0 in library services.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2010/09/paarl.jpg?w=300"]
  },
  {
    title: "9th In-Service Training",
    date: "June 04, 2010",
    description: "Facing the Advances and Challenges of Technology: Libraries in the 21st Century.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/in-service-bulletin.jpg?w=150"]
  },
  {
    title: "Library Study Tour 2010",
    date: "May 21, 2010",
    description: "Tour of Security Plant Complex Gallery, Ateneo Rizal Library, and UP libraries.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/library-study-tour-collage.jpg?w=150"]
  },
  {
    title: "Librarians Skills Enhancement",
    date: "April 30, 2010",
    description: "PLAI-STLRC Palawan Summer Conference for professional skill development.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/palawan.jpg?w=150"]
  },
  {
    title: "Global Preparedness for Librarians",
    date: "April 23, 2010",
    description: "National Seminar-Workshop in Bohol focused on current library trends.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/pasli-bulletin.jpg?w=150"]
  },
  {
    title: "Strategic Planning in Baguio",
    date: "April 16, 2010",
    description: "Annual library planning retreat held in the City of Pines.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/strat1.jpg?w=150"]
  },
  {
    title: "Environmental Sustainability Congress",
    date: "November 27, 2009",
    description: "PLAI National Congress on promotion of environmental sustainability through libraries.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/picture-not-available.jpg?w=150"]
  },
  {
    title: "Challenges of Librarianship Across Barriers",
    date: "October 9, 2009",
    description: "PLAI-STRLC conference in Antipolo City addressing professional challenges.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/10/plai-strlc.jpg?w=150"]
  },
  {
    title: "Personality Enhancement Workshop",
    date: "September 11, 2009",
    description: "P.E.A.C.E. Workshop in Library Management held at CEFI Lucena.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/library-and-emrc-staff-training-seminar-and-conference1.jpg?w=150"]
  },
  {
    title: "Web Technologies for Teaching Resources",
    date: "July 10, 2009",
    description: "Training for development of library resources held in Naga City.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/08/nagalandscape.jpg?w=150"]
  },
  {
    title: "8th In-Service Training Program",
    date: "June 05, 2009",
    description: "Annual staff training program held at Ouan's Worth Farm.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/team.jpg?w=150"]
  },
  {
    title: "Digitization of Library Resources",
    date: "May 15, 2009",
    description: "CE Logic 1st National Conference on digital library materials.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/ce-logic.jpg?w=150"]
  },
  {
    title: "Effective Library Services",
    date: "May 13, 2009",
    description: "Seminar-Workshop in Baguio City on new strategies for service delivery.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/baguio.jpg?w=150"]
  },
  {
    title: "Library Staff Educational Tour 2009",
    date: "May 8, 2009",
    description: "Staff visits to LCC, CEU, and the National Museum.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/laquep-linc-tour.jpg?w=150"]
  },
  {
    title: "15th MARC 21 Workshop Reloaded",
    date: "March 27, 2009",
    description: "Professional workshop on library cataloging standards held at Lyceum Manila.",
    images: ["https://envergalibrary.wordpress.com/wp-content/uploads/2009/01/marc21.jpg?w=300"]
  }
];

const ITEMS_PER_PAGE = 9;

export default function ActivitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ACTIVITIES.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentActivities = ACTIVITIES.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHeader
        title="Events & Activities"
        subtitle="Library programs and professional developmental highlights"
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Activities" },
        ]}
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Archive of Excellence</h2>
            <p className="mt-4 text-lg text-gray-600">
              A comprehensive history of our orientations, workshops, and team-building events 
              shaping the future of the MSEUF University Library.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentActivities.map((activity, idx) => (
              <div
                key={startIndex + idx}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-maroon-100 hover:shadow-xl group"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  {activity.images?.[0] ? (
                    <Image
                      src={activity.images[0]}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 rounded-lg bg-maroon-800/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                    {activity.date.split(", ").pop()?.split(" ").pop()}
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-maroon-800 transition-colors">
                    {activity.title}
                  </h3>
                  
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {activity.date}
                  </div>
                  
                  <p className="mt-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {activity.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-maroon-700">Library Archive</span>
                    <div className="flex -space-x-2">
                      {activity.images?.slice(0, 3).map((img, i) => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden relative">
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                      ))}
                      {activity.images && activity.images.length > 3 && (
                        <div className="h-6 w-6 rounded-full border-2 border-white bg-maroon-50 flex items-center justify-center text-[10px] font-bold text-maroon-700">
                          +{activity.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center justify-center gap-6">
              <div className="text-sm font-medium text-gray-500">
                Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
                <span className="text-gray-900">{Math.min(startIndex + ITEMS_PER_PAGE, ACTIVITIES.length)}</span> of{" "}
                <span className="text-gray-900">{ACTIVITIES.length}</span> entries
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-maroon-300 hover:text-maroon-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, and current +/- 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-all ${
                            currentPage === page
                              ? "bg-maroon-800 text-white shadow-lg shadow-maroon-200"
                              : "border border-gray-200 bg-white text-gray-600 hover:border-maroon-300 hover:text-maroon-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-1 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-maroon-300 hover:text-maroon-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
