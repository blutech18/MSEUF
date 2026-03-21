import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Search, ChevronRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = { title: "Tutorials | Enverga Library" };

export default function TutorialsPage() {
  return (
    <>
      <PageHeader
        title="Tutorials"
        subtitle="Learn how to make the most of library resources and services"
        breadcrumbs={[{ label: "Tutorials" }]}
      />
      
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-16">
              
              {/* Section 1 */}
              <section>
                <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">How to access Enverga Library</h2>
                <p className="mb-6 text-base text-gray-600">Struggling to do your research? Do you need learning materials? Just go to <a href="http://envergalibrary.com" className="text-maroon-700 font-semibold hover:text-maroon-800 transition-colors">envergalibrary.com</a> and we will be there to serve you.</p>
                <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                  <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fenvergalibrary%2Fvideos%2F448451596528967%2F&show_text=false" className="h-full w-full border-none" scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Section 2 */}
              <section>
                <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">BLIS & MLIS Promotions</h2>
                <p className="mb-6 text-base text-gray-600">Enroll now!! Be a Librarian.</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                    <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fenvergalibrary%2Fvideos%2F410118497065251%2F&show_text=false" className="h-full w-full border-none" scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                  </div>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                    <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fenvergalibrary%2Fvideos%2F780988509349407%2F&show_text=false" className="h-full w-full border-none" scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                  </div>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Section 3 */}
              <section>
                <h2 className="mb-4 font-heading text-2xl font-bold text-gray-900">Account Registration for New Students</h2>
                <div className="mb-6 space-y-4 text-base text-gray-600">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon-50 font-bold text-maroon-700">1</div>
                    <p className="pt-1">Fill out the registration form at <a href="http://bit.ly/Libraryaccount-2021-newstudent" className="font-semibold text-maroon-700 hover:text-maroon-800 transition-colors break-all" target="_blank" rel="noreferrer">http://bit.ly/Libraryaccount-2021-newstudent</a>.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon-50 font-bold text-maroon-700">2</div>
                    <p className="pt-1">Wait for the librarian&apos;s acknowledgment.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon-50 font-bold text-maroon-700">3</div>
                    <p className="pt-1">Create your account at <a href="https://envergalibrary.com/follett" className="font-semibold text-maroon-700 hover:text-maroon-800 transition-colors break-all">envergalibrary.com/follett</a>.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon-50 font-bold text-maroon-700">4</div>
                    <p className="pt-1">Use your <strong className="font-semibold text-gray-900">Last Name</strong> and <strong className="font-semibold text-gray-900">Student ID (Barcode)</strong> for credentials.</p>
                  </div>
                </div>
                {/* external image source from envergalibrary.wordpress.com */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm max-w-lg">
                  <img src="https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/140543602_10158657129842347_7383310457682884938_n.jpg?w=568" alt="Account Registration Instructions" className="w-full" loading="lazy" />
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Section 4 */}
              <section>
                <h2 className="mb-6 font-heading text-2xl font-bold text-gray-900">Online Book Renewal & Appointments</h2>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="flex flex-col">
                    <h3 className="mb-2 font-semibold text-lg text-gray-900">Book Renewal</h3>
                    <p className="mb-6 text-sm text-gray-600">Renew books easily at <a href="http://envergalibrary.com" className="font-semibold text-maroon-700 hover:text-maroon-800 transition-colors">envergalibrary.com</a></p>
                    <div className="mt-auto overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                      <img src="https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/184425767_10158941761387347_3145077551013315025_n-1-1.jpg?w=662" alt="Book Renewal" className="w-full" loading="lazy" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="mb-2 font-semibold text-lg text-gray-900">Book Appointments</h3>
                    <p className="mb-6 text-sm text-gray-600">Schedule your visit: <a href="http://bit.ly/EULib_bookappoinment" className="font-semibold text-maroon-700 hover:text-maroon-800 transition-colors break-all" target="_blank" rel="noreferrer">http://bit.ly/EULib_bookappoinment</a></p>
                    <div className="mt-auto overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                      <img src="https://envergalibrary.wordpress.com/wp-content/uploads/2021/06/178412386_10158915129167347_2135148581579757122_n-1.png?w=647" alt="Book Appointment" className="w-full" loading="lazy" />
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Section 5 */}
              <section>
                <h2 className="mb-8 font-heading text-2xl font-bold text-gray-900">Database Tutorials</h2>
                <div className="space-y-12">
                  
                  {/* Email Tutorial */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">Email Tutorial</h3>
                    <div className="aspect-4/3 w-full max-w-3xl overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                      <iframe src="https://www.slideshare.net/slideshow/embed_code/16301132" className="h-full w-full border-none" frameBorder="0" marginWidth={0} marginHeight={0} scrolling="no" allowFullScreen></iframe>
                    </div>
                  </div>

                  {/* Expanded Academic ASAP */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">Expanded Academic ASAP</h3>
                    <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                      <iframe src="https://player.vimeo.com/video/34455208" className="h-full w-full border-none" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
                    </div>
                  </div>

                  {/* Britannica and Kids InfoBits row */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">Britannica Academic</h3>
                      <div className="aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                        <iframe src="https://www.slideshare.net/slideshow/embed_code/16301292" className="h-full w-full border-none" frameBorder="0" marginWidth={0} marginHeight={0} scrolling="no" allowFullScreen></iframe>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">Kids InfoBits</h3>
                      <div className="aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                        <iframe src="https://www.slideshare.net/slideshow/embed_code/16301382" className="h-full w-full border-none" frameBorder="0" marginWidth={0} marginHeight={0} scrolling="no" allowFullScreen></iframe>
                      </div>
                    </div>
                  </div>

                  {/* Digital Newspaper */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">Digital Newspaper</h3>
                    <div className="aspect-4/3 w-full max-w-3xl overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                      <iframe src="https://www.slideshare.net/slideshow/embed_code/16301381" className="h-full w-full border-none" frameBorder="0" marginWidth={0} marginHeight={0} scrolling="no" allowFullScreen></iframe>
                    </div>
                  </div>

                </div>
              </section>
          </div>
        </div>
    </>
  );
}
