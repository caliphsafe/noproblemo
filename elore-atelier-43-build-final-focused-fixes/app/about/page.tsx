import Image from "next/image";
import Link from "next/link";
import { AboutGalleryCarousel } from "@/components/about/about-gallery-carousel";

const bio = [
  `ELÖRE ATELIER was founded by designer Salomé Kopasz, whose work is rooted in the belief that traditional craftsmanship has the power to preserve stories, connect generations, and move tradition forward.`,
  `Born in Cameroon and raised in Paris, Salomé's creative perspective was shaped by a life immersed in culture, fashion, and artistry. As a former model, she experienced the fashion world from within, developing an appreciation for the relationship between clothing, identity, and self-expression. Those early experiences continue to influence her approach to design—one that values both beauty and meaning.`,
  `For Salomé, hat-making was never simply about creating an accessory, it became a language of craft. After studying Fashion Design in Boston, a hat-making class in New York unexpectedly changed the course of her creative journey. Drawn to the rhythm of shaping felt by hand, she continued her training at Schola Academy in Florence, Italy, where she immersed herself in the traditions of European design and developed a deep respect for the generations of artisans who came before her. That experience became the foundation of ELÖRE ATELIER.`,
  `Named after the idea of "moving forward," Elöre reflects that tradition not only deserves to be preserved but something to carry into the present with intention. Every hat is thoughtfully shaped by hand using Elöre's signature wooden hat blocks, honoring time-honored techniques while embracing a contemporary perspective.`,
  `Today, her work extends beyond creating hats. Through collections, workshops, and collaborations, Salomé is committed to keeping the art of hat-making alive—inviting others to slow down, appreciate the beauty of handmade objects, and reconnect with the stories woven into every piece. Each creation is a quiet reminder that craftsmanship is a living tradition, one that continues to evolve with every hand that shapes it.`
];

const philosophy = [
  `Elöre is built on the belief that tradition should never be left behind—it should be carried forward into the next generation.`,
  `The two dots above the Ö are a quiet symbol of that journey. The first represents the craft: the enduring artistry of hat-making, shaped by hand and passed down through generations of makers. The second represents movement: the stories we continue to tell, the evolution of design, and our responsibility to bring heritage into the present.`,
  `As artisans, we believe we are storytellers. Every hat carries the knowledge of those who came before us while becoming part of the story of the person who wears it. In a world increasingly shaped by speed, automation, and mass production, choosing to make by hand is an act of preservation. It is a commitment to keeping the art of hat-making alive.`,
  `This belief shapes how we create. We believe the finest things cannot be rushed. Rooted in Boston and inspired by a global tradition of hat-making, our atelier embraces a slower rhythm of making; one that values skilled hands, intentional design, natural materials, and the discipline over convenience.`,
  `Each hat is made to order and thoughtfully crafted using materials sourced from trusted artisans around the world. We seek to create with greater intention, reducing unnecessary waste and choosing recycled, plastic-free packaging wherever possible. For us, sustainability is not simply a practice; it is part of the responsibility that comes with making.`,
  `An Elöre piece is a reminder to keep moving forward—to honor where we come from, carry its knowledge with us, and continue shaping what comes next. Every piece is a celebration of slow making, cultural exchange, and the belief that the traditions worth preserving are the ones we continue to live.`
];

const principles = [
  ["Natural Material", "/images/about/natural.jpg", "We believe exceptional craftsmanship begins with authentic materials. Every Elöre hat is made using thoughtfully sourced natural and raw elements, selected for their quality, longevity, and connection to its origin. By honoring the integrity of each material, we create pieces designed to be worn, treasured, and passed down to the next generation of artisans."],
  ["Crafted in Boston", "/images/about/crafter.jpg", "Every Elöre hat is shaped by hand in our Boston atelier using excellent hat-making techniques. Made-to-order rather than mass produced, each piece is shaped, finished, and refined by hand—embracing a slower process that allows craft's individuality to define every part of the hat."],
  ["Packaged with Purpose", "/images/about/packaged.jpg", "Thoughtful making extends beyond the hat itself. From our slow fashion model to recycled, plastic-free packaging, every decision reflects our commitment to reducing waste and creating responsibly. We believe lasting craftsmanship and conscious practices keep the craft sacred."]
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#efe3d4] text-brand-ink">
        <div className="editorial-container grid gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-16 lg:px-12 lg:py-20">
          <div className="relative z-10">
            <h1 className="serif-display text-[clamp(4rem,7vw,7.5rem)] leading-[.82] tracking-[-.065em] text-brand-olive">About Salome Kopasz</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-ink/70 md:text-lg md:leading-9">A Boston-based handcrafted hat brand redefining modern millinery.</p>
          </div>
          <div className="relative z-10">
            <AboutGalleryCarousel className="aspect-[4/3] w-full" sizes="(max-width: 1024px) 100vw, 58vw" />
          </div>
        </div>
      </section>

      <section className="bg-brand-maroon text-white">
        <div className="editorial-container px-5 py-14 md:px-8 md:py-20 lg:px-12 lg:py-24">
          <div className="max-w-5xl space-y-6 text-base leading-8 text-white/85 md:text-lg md:leading-9">
            {bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="bg-brand-bone text-brand-ink">
        <div className="editorial-container grid gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:gap-16 lg:px-12 lg:py-24">
          <div className="relative h-full min-h-[420px] w-full overflow-hidden border border-black/10">
            <Image src="/images/about/manifesto.jpg" alt="ELÖRE Atelier philosophy" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
          </div>
          <div>
            <h2 className="serif-display text-5xl leading-[.88] text-brand-olive md:text-7xl lg:text-8xl">Elöre’s Philosophy</h2>
            <div className="mt-9 space-y-6 text-sm leading-7 text-brand-olive/75 md:text-base md:leading-8">
              {philosophy.map((paragraph, index) => <p key={index} className={index === 0 ? "font-medium text-brand-olive" : ""}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-sand text-brand-ink">
        <div className="editorial-container grid gap-8 px-5 py-12 md:px-8 lg:grid-cols-3 lg:gap-6 lg:px-12 lg:py-16">
          {principles.map(([title, image, description]) => (
            <article key={title} className="flex flex-col bg-brand-bone/45 p-4 md:p-5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={image} alt={title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="pt-5">
                <h3 className="serif-display text-4xl leading-tight text-brand-olive">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-olive/75">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-sand text-brand-ink">
        <div className="editorial-container grid gap-7 border-t border-black/10 px-5 py-14 md:px-8 lg:grid-cols-[1.2fr_.8fr] lg:px-12 lg:py-20">
          <h2 className="serif-display max-w-3xl text-5xl leading-[.9] text-brand-olive md:text-7xl">Discover the collection or step inside the atelier.</h2>
          <div className="flex flex-wrap items-end gap-3">
            <Link href="/shop" className="elore-btn bg-brand-olive text-white">Shop the Collection</Link>
            <Link href="/custom" className="elore-btn border border-white bg-white text-brand-olive">Begin a Custom Hat</Link>
            <Link href="/studio" className="elore-btn border border-white bg-white text-brand-olive">Enter the Atelier</Link>
          </div>
        </div>
      </section>
    </>
  );
}
