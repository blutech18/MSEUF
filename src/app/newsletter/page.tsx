import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Newsletter" };

const NEWSLETTERS = [
  { title: "Volume 19, No. 1", date: "June-December 2023", desc: "Latest updates and research highlights from the last half of 2023.", link: "https://drive.google.com/file/d/1Wk3skleHf23dSI5YV4-rfnZYwsBIk5Uv/view?usp=drive_link" },
  { title: "Volume 18, No. 1", date: "June-December 2022", desc: "Annual review of library services and student engagement.", link: "https://drive.google.com/file/d/1CLKlfrJXrpbMrjbVCWzP8Z0XHFeRiblz/view?usp=share_link" },
  { title: "Volume 17, No. 2", date: "January-May 2022", desc: "Mid-year academic resources and new database acquisitions.", link: "https://bit.ly/EU-Library-Newsletter-Vol17-no2" },
  { title: "Volume 16, No. 1", date: "June-December 2020", desc: "Navigating digital resource access during the pandemic.", link: "https://drive.google.com/file/d/16Vmz1hTgceWCBL2oa_Vwt1QV0hK20dk4/view?usp=sharing" },
  { title: "Volume 15, No. 2", date: "January-May 2020", desc: "Early 2020 library events and student research support.", link: "https://drive.google.com/file/d/1Noeu_r0ygu2_a7hC9AC25nV_SZfLg3bH/view?usp=sharing" },
  { title: "Volume 15, No. 1", date: "August-December 2019", desc: "Second semester highlights and new archival collections.", link: "https://drive.google.com/file/d/1lEn8FXeeam_iQcWu-bRyrjKqtPvSyYE4/view?usp=drive_link" },
  { title: "Volume 14, No. 2", date: "January-May 2019", desc: "Focus on community outreach and regional library partnerships.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2019/06/newsletter-vol.14-no.2.pdf" },
  { title: "Volume 14, No. 1", date: "August-December 2018", desc: "Implementation of new automated circulation systems.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2019/06/newsletter-vol.13.no1_-1.pdf" },
  { title: "Volume 13, No. 3", date: "March-July 2019", desc: "Special edition on summer reading and academic workshops.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2019/06/newsletter-vol.13-no.3.pdf" },
  { title: "Volume 13, No. 2", date: "November-February 2018", desc: "Winter semester updates and facilities improvement report.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2019/06/newsletter-vol.13-no-2.pdf" },
  { title: "Volume 13, No. 1", date: "June-October 2017", desc: "Kick-off for the 2017-2018 academic literacy programs.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2019/06/newsletter-vol.13.no1_.pdf" },
  { title: "Volume 12, No. 2", date: "October 2016 - January 2017", desc: "Highlights of student library week and resource usage.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-12-no-2.pdf" },
  { title: "Volume 12, No. 1", date: "May-September 2016", desc: "New student orientations and librarian spotlight.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vo-12-no-1.pdf" },
  { title: "Volume 11, No. 4", date: "January-April 2016", desc: "Research paper assistance and digital literacy focus.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-volume-vo-11-no-4.pdf" },
  { title: "Volume 11, No. 3", date: "October-December 2015", desc: "Year-end collection growth and holiday services.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-11-no-3.pdf" },
  { title: "Volume 11, No. 2", date: "July-September 2015", desc: "Expansion of Filipiniana section and reference services.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vo-11-no-2.pdf" },
  { title: "Volume 11, No. 1", date: "April-June 2015", desc: "Early 2015 updates on library policies and access.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-11-no-1.pdf" },
  { title: "Volume 10, No. 3", date: "January-March 2015", desc: "Quarterly review of academic liaison programs.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-10-no-3.pdf" },
  { title: "Volume 10, No. 2", date: "September-December 2014", desc: "Library enhancements and faculty resource updates.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-10-no-2.pdf" },
  { title: "Volume 10, No. 1", date: "June-August 2014", desc: "Introductory newsletter for the 2014 academic year.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-10-no-1.pdf" },
  { title: "Volume 09, No. 4", date: "January-May 2014", desc: "Retrospective overview of early 2014 library news.", link: "https://envergalibrary.wordpress.com/wp-content/uploads/2017/05/newsletter-vol-9-no-4.pdf" },
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
            <a 
              key={nl.title} 
              href={nl.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="card group cursor-pointer block h-full hover:border-maroon-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                {nl.date}
              </div>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <Newspaper className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900 group-hover:text-maroon-700 transition-colors">
                {nl.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {nl.desc}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium text-maroon-700 group-hover:text-maroon-900 leading-none">
                Read Online <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
