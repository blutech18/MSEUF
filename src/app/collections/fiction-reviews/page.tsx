"use client";

import { useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  { 
    title: "The Last Time I'll Write About You", 
    author: "Dawn Lanuza", 
    rating: 5, 
    review: "Poetry that hits you right in the feels. The magic of Lanuza's writing flows effortlessly with every piece. Definitely left wanting more.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/82-1.png?w=786"
  },
  { 
    title: "Dapitan Schoolboy", 
    author: "Patricia Laurel", 
    review: "At the age of 12, Joselito had completed all of the schooling offered in his little hometown of Dapitan and was wondering what life had in store for him without further education. Then one night, he noticed a foreigner disembarking on the shore...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/83.png?w=786"
  },
  { 
    title: "Sea of Strangers", 
    author: "Lang Leav", 
    review: "NOTHING WILL EVER BE AS BEAUTIFUL BUT NEITHER WILL ANYTHING HURT AS MUCH. I WILL CELEBRATE THIS LIFE OF MINE WITH OR WITHOUT YOU. THE MOON DOES NOT NEED THE SUN TO TELL HER SHE IS ALREADY WHOLE.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/84.png?w=786"
  },
  { 
    title: "Broken Things", 
    author: "Lauren Oliver", 
    review: "Everyone thinks Mia and Brynn killed their best friend. That driven by their obsession with a novel called The Way into Lovelorn the three girls had imagined themselves into the magical world where their fantasies became twisted, even deadly.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/85.png?w=786"
  },
  { 
    title: "The Fire Child", 
    author: "S.K. Tremayne", 
    review: "WHEN RACHEL MARRIED ATTRACTIVE DAVID AND MOVED TO A BEAUTIFUL MANSION IN CORNWALL, SHE GAINED WEALTH, LOVE, AND AN AFFECTIONATE STEPSON, JAMIE. BUT JAMIE'S CONDUCT SHIFTS, AND HER IDYLLIC LIFE BEGINS TO DISINTEGRATE...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/86.png?w=786"
  },
  { 
    title: "Love Life and the List", 
    author: "Kasie West", 
    review: "Seventeen-year-old Abby Turner’s summer isn’t going as planned. She has a not-so-secret but undeniably unrequited crush on her best friend Cooper. She has been unable to control her mother’s increasing worry. And now she’s been turned down for an art show because her work 'has no heart'.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/87.png?w=786"
  },
  { 
    title: "Without Merit", 
    author: "Colleen Hoover", 
    review: "THE VOSS FAMILY IS NOT YOUR TYPICAL FAMILY. THEY RECENTLY GOT MARRIED AND MOVED INTO A DOGS... A CONVERTED CHURCH. THE FATHER IS MARRIED TO THE MOTHER’S FORMER NURSE. THE TINY HALF-BROTHER IS FORBIDDEN FROM GOING OR EATING ANYTHING ENJOYABLE...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/88.png?w=786"
  },
  { 
    title: "Hippie", 
    author: "Paulo Coelho", 
    review: "Best-selling author Paulo Coelho transports us back in time to rediscover the hopes of a generation that sought out world peace and dared to confront the existing social order, drawing on the rich experience of his own life. In Hippie, he narrates the tale of Paulo, a young, slender Brazilian man with long, flowing hair...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/89.png?w=786"
  },
  { 
    title: "Ramon and Juliet", 
    author: "Alana Quintana Albertson", 
    review: "Ramon and Juliet is a contemporary adaptation of the Shakespearean classic set in a vibrant urban setting. The story follows Ramon and Juliet, two lovers from opposing families navigating love, conflict, and sacrifice...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/90.png?w=786"
  },
  { 
    title: "As Good as Dead", 
    author: "Holly Jackson", 
    review: "The author truly hit the ball out of the park with this As Good as Dead... The author expressed sadness and the heartbreak of the characters at the end of the story...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/91.png?w=786"
  },
  { 
    title: "Courage is Calling", 
    author: "Ryan Holiday", 
    review: "Fortune Favors the Brave is a book by Ryan Holiday on Stoicism and practical philosophy. It explores the importance of courage in facing life's challenges and how bold actions often lead to favorable outcomes...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/92.png?w=786"
  },
  { 
    title: "They're Doing It", 
    author: "Jami Attenberg", 
    review: "It's a very great book to read. It's exactly what I'm looking for. I am very satisfied with the story and characters. They successfully connected to my emotions... very helpful to have realizations.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/93.png?w=786"
  },
  { 
    title: "Veil of Secrets", 
    author: "Shannon Ethridge and Kathryn Mackel", 
    review: "This book by Shannon Ethridge and Kathryn Mackel was very worth reading... It was very interesting, I had mixed emotions while reading this book.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/94.png?w=786"
  },
  { 
    title: "The Neighbor Favor", 
    author: "Kristina Forest", 
    review: "It's a typical Romcom book that everyone reads. The book has a very cute and heartwarming plot, I really love how the characters drive the story with their love for each other.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/95.png?w=786"
  },
  { 
    title: "Three Weeks with My Brother", 
    author: "Nicholas Sparks and Micah Sparks", 
    review: "Nicholas Sparks was undoubtedly talented when it came to telling stories. This book of his was not just a typical book. I almost forgot that this was a fiction book because he drove me into real life.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/22.png?w=786"
  },
  { 
    title: "To Paradise", 
    author: "Hanya Yanagihara", 
    review: "Honestly, this is not just a book. It's an eye-opener for life realizations and soul fulfillment. It has its own momentum, which enchants the plot.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/23.png?w=786"
  },
  { 
    title: "The Scum Villain's Self-Saving System (Vol 2)", 
    author: "Mo Xiang Tong Xiu", 
    review: "The second volume of 'The Scum Villain's Self-Saving System' is a masterpiece that you'll surely love. It removes the stigma of toxic masculinity, which is a big plus for the writer of this story.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/24.png?w=786"
  },
  { 
    title: "The Scum Villain's Self-Saving System (Vol 1)", 
    author: "Mo Xiang Tong Xiu", 
    review: "I recently tried out Mo Xiang Tong Xiu, and I am obsessed. Everything about this book was really interesting and you'll surely want to find out what happens next.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/25.png?w=786"
  },
  { 
    title: "Fugitive Six", 
    author: "Pittacus Lore", 
    review: "Fugitive Six continues the Pittacus Lore Lorien Legacies series with intensified revelations and thrilling events. The suspense is captivating, and I found the characters... with the series is worth the wait, but the wait for the next volume is considerable.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/26.png?w=786"
  },
  { 
    title: "Canal de la Reina", 
    author: "Liwayway Arceo", 
    review: "The book looks into the Philippines' settler community, emphasizing the accumulation of wealth and utilizing fiction as a caricature of evil. A very great book to read especially for the youth.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/27.png?w=786"
  },
  { 
    title: "The Antisocial Network", 
    author: "Ben Mezrich", 
    review: "This book captures the battle between retail and Wall Street so well, diverse investors and their reasons for joining, their agonizing choice of whether to hold or fold.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/28.png?w=786"
  },
  { 
    title: "Her Lost Words", 
    author: "Stephanie Thornton", 
    review: "Mary Wollstonecraft turned to writing during her father's violent rages. Instead, she transforms herself into the radical author of the landmark volume A Vindication of the Rights of Woman...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/29.png?w=786"
  },
  { 
    title: "2034", 
    author: "Elliot Ackerman", 
    review: "Chinese cyberattack neutralizes the US naval squadron in the South China Sea, and Iran takes a hotshot F-35 pilot hostage. This leads to a series of escalations, and soon several US cities are reduced to radioactive craters...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/30.png?w=786"
  },
  { 
    title: "The Atlas Six", 
    author: "Olivie Blake", 
    review: "Olivie Blake is the pseudonym of Alexene Farol Follmuth, a lover and writer of stories, many of which involve the fantastic, the paranormal, or the supernatural, but not always. More often, her works revolve around what it means to be human (or not), and the endlessly interesting complexities of life and love.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/31.png?w=786"
  },
  { 
    title: "Carrie Soto is Back", 
    author: "Taylor Jenkins Reid", 
    review: "Carrie is the greatest tennis player the world has ever seen by the time she decides to retire. She has twenty Slam titles to her name and has broken every record. She is also entitled to each and every one, if you ask her.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/32.png?w=786"
  },
  { 
    title: "Playing with Myself", 
    author: "Randy Rainbow", 
    review: "In Playing with Myself, Randy Rainbow—the man who took the Internet by storm with his chic pink glasses, endless Broadway musical knowledge, and the most perceptive take on American politics... tells the story of how he managed to become a star.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/33.png?w=786"
  },
  { 
    title: "My Wife is Missing", 
    author: "D.J. Palmer", 
    review: "Michael Hart's family vacation turns into a nightmare when he realizes his wife and two children are missing from their New York City hotel room. Terrified, he thinks they may have been abducted. Michael's desperate hunt for them takes an unexpected turn when he discovers that his wife, Natalie, appears to have gone willingly, taking their children with her.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/34.png?w=786"
  },
  { 
    title: "Lives of the Stoics", 
    author: "Ryan Holiday", 
    review: "More than a mere history book, LIVES OF THE STOICS: The Art of Living from Zeno to Marcus Aurelius is a guide for the modern reader on how to live a life of virtue and meaning. Drawing from the core values and ideals that have inspired generations of readers...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/35.png?w=786"
  },
  { 
    title: "The Christie Affair", 
    author: "Nina de Gramont", 
    review: "THIS IS NAN O'DEA'S STORY, A FICTION CHARACTER VERY LOOSELY BASED ON ARCHIE CHRISTIE'S MISTRESS AND SECOND WIFE. FOR THE MOST PART, NAN IS SPEAKING TO US AS SHE TELLS THE STORY AND WE LEARN ABOUT HER LIFE FROM AN EARLY AGE...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/36.png?w=786"
  },
  { 
    title: "Empire of Storms", 
    author: "Sarah J. Maas", 
    review: "The long path to the throne has only just begun for Aelin Galathynius as war looms on the horizon. Loyalties have been broken and bought, friends have been lost and gained, and those who possess magic find themselves at odds with those who don't.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/37.png?w=786"
  },
  { 
    title: "River's End", 
    author: "Nora Roberts", 
    review: "Sheltered from the truth, an older Olivia only dimly recalls the night of terror—but her recurring nightmares make her realize the real story. Haunted by the rich experience of her own life... Olivia must search for the truth, but before she can find it, she must survive the killer who is still stalking her.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/38.png?w=786"
  },
  { 
    title: "Queen of the Universe", 
    author: "Pia Wurtzbach", 
    review: "When it comes to fame and fortune, how high a price is too high, and when do you know that you've paid too much? This debut novel by an actress and pageant titleholder gives a window on the hidden rungs of that ladder, and on the pain that comes with slipping and falling.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/39.png?w=786"
  },
  { 
    title: "Heart Bones", 
    author: "Colleen Hoover", 
    review: "Life and a dismal last name are the only two things Beyah Grim’s parents ever gave her. After carving her path all on her own, Beyah is well on her way to bigger and better things, thanks to no one but herself.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/40.png?w=786"
  },
  { 
    title: "Reminder of Him", 
    author: "Colleen Hoover", 
    review: "After serving five years in prison for a tragic mistake, Kenna Rowan returns to the town where it all went wrong, hoping to reunite with her four-year-old daughter. But the bridges Kenna burned are proving impossible to rebuild.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/41.png?w=786"
  },
  { 
    title: "Maybe Now", 
    author: "Colleen Hoover", 
    review: "Ridge and Sydney are thrilled to finally be together guilt-free. But as the two of them navigate this freedom, Warren and Bridgette’s relationship is as tumultuous as ever.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/42.png?w=786"
  },
  { 
    title: "Wildcard", 
    author: "Marie Lu", 
    review: "When Billy, a troubled young man, comes to private eye Corcoran Strike's office to ask for his help investigating a crime he thinks he witnessed as a child, Strike is left deeply unsettled. While Billy is obviously mentally distressed, and cannot remember many concrete details, there is something sincere about him and his story.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/43.png?w=786"
  },
  { 
    title: "Stan Lee's The Devil's Quintet", 
    author: "Jay Bonansinga", 
    review: "A twisted, high-octane cross between SEAL TEAM and DOCTOR FAUSTUS. A ragtag group of soldiers who forges a deal with the devil and literally saves or destroys the world. Jay Bonansinga's vivid and gripping, hardworking writing style reminds me of the final works of Stan Lee for an edge-of-your-seat...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/44.png?w=786"
  },
  { 
    title: "Beach Read", 
    author: "Emily Henry", 
    review: "A romance writer who no longer believes in love and a literary writer stuck in a rut engage in a summer-long challenge: to write a book in each other's genre. They'll also each take the other on a field trip to research their book without falling in love.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/45.png?w=786"
  },
  { 
    title: "Kingdom of Ash", 
    author: "Sarah J. Maas", 
    review: "Aelin Galathynius endures torture to save her people from the Queen of the Fae. Her resolve weakens as she faces captivity. Friends face different fates, with backgrounds tangled and destinies intertwined for the salvation of Erilea. Sarah J. Maas's Throne of Glass series culminates in Aelin's fight for a better world.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/46.png?w=786"
  },
  { 
    title: "These Women", 
    author: "Ivy Pochoda", 
    review: "In West Adams, 'these women' face danger and anguish intertwined by one man's deadly obsession in Ivy Pochoda's novel. Dorian seeks closure for her daughter's unsolved murder, Julianna resists slowing down, Essie uncovers a crime pattern, Marella's art risks her safety, and Anneke's quiet life is disrupted by neighborhood murders.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/47.png?w=786"
  },
  { 
    title: "The Return", 
    author: "Nicholas Sparks", 
    review: "Trevor Benson, an injured orthopedic surgeon, returns to New Bern, NC after Afghanistan. He tends to bee hives and falls for Natalie Masterson. A mysterious girl, Callie, holds secrets linked to Trevor's grandfather. Unraveling these mysteries teaches Trevor about love, forgiveness, and the importance of returning to one's roots.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/48.png?w=786"
  },
  { 
    title: "It's Raining Men", 
    author: "Julie Hammerle", 
    review: "Lesson learned: Avoid drunk texting. After a night of drinking, a woman's text leads to unexpected responses from men, including her plumber. She finds herself torn between two potential suitors: her dependable high school crush and an exciting news reporter. Encouraged by a bartender, she navigates the complexities of love and self-discovery.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/49.png?w=786"
  },
  { 
    title: "Americanah", 
    author: "Chimamanda Ngozi Adichie", 
    review: "Ifemelu and Obinze, a young couple from Nigera, flee their country for different paths in the West. As they navigate the challenges of immigration, race, and identity, they find themselves questioning their sense of belonging and their love for each other.",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/50.png?w=786"
  },
  { 
    title: "It Happened One Summer", 
    author: "Tessa Bailey", 
    review: "Piper Bellinger, a wild child heiress, is sent to run her late father’s bar in Washington with her sister after a scandal. She meets sea captain Brendan, sparking attraction despite their differences. As Piper adjusts to small-town life, she questions her prior life...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/51.png?w=786"
  },
  { 
    title: "Love Her or Lose Her", 
    author: "Tessa Bailey", 
    review: "HIGH SCHOOL SWEETHEARTS ROSIE AND DOMINIC VEGA'S RELATIONSHIP HAS LOST ITS SPARK. ROSIE PUSHES FOR CHANGE BY ATTENDING MARRIAGE BOOT CAMP WITH DOM, DESPITE HIS INITIAL RELUCTANCE. THROUGH UNCONVENTIONAL EXERCISES, THEY REDISCOVER THEIR DEEP LOVE...",
    imageUrl: "https://envergalibrary.wordpress.com/wp-content/uploads/2024/04/52.png?w=786"
  },
];

const REVIEWS_PER_PAGE = 9;

export default function FictionReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = REVIEWS.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHeader 
        title="Fiction Reviews" 
        subtitle="Staff picks and community reviews from our fiction collection" 
        breadcrumbs={[{ label: "Collections" }, { label: "Fiction Reviews" }]} 
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to <span className="font-medium text-gray-900">{Math.min(startIndex + REVIEWS_PER_PAGE, REVIEWS.length)}</span> of <span className="font-medium text-gray-900">{REVIEWS.length}</span> reviews
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentReviews.map((r, idx) => (
              <div key={r.title + idx} className="card group hover:border-maroon-100 transition-all flex flex-col overflow-hidden p-0">
                {/* Book Cover Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={r.imageUrl}
                    alt={r.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 fill-gold-400 text-gold-400`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900 leading-tight group-hover:text-maroon-700 transition-colors">
                      {r.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-500 italic">by {r.author}</p>
                  
                  <div className="mt-4 flex-1">
                    <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {r.review}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-maroon-50 transition-colors group-hover:bg-maroon-100">
                      <BookOpen className="h-4 w-4 text-maroon-700" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-maroon-700">Staff Review</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`h-11 min-w-[2.75rem] rounded-xl border px-4 text-sm font-bold shadow-sm transition-all ${
                        currentPage === pageNumber
                          ? "border-maroon-600 bg-maroon-600 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
