import Image from "next/image";
import Link from "next/link";

export function AtelierStory() {
  return (
    <section className="home-story-section bg-brand-bone px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="home-story-grid editorial-container grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch lg:[&>*]:min-h-0">
        <div className="home-story-video relative min-h-0 lg:self-stretch">
          <iframe
            title="ELÖRE ATELIER film"
            src="https://player.vimeo.com/video/1218122493?h=bb73f54b5a&title=0&byline=0&portrait=0&badge=0&dnt=1"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 block h-full w-full"
          />
        </div>
        <div className="home-story-copy relative flex min-h-0 flex-col justify-between overflow-hidden bg-brand-ivory p-6 md:p-8 lg:p-10">
          <Image
            src="/images/bg/elorebg1.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 60vw, 30vw"
            className="pointer-events-none absolute inset-y-0 right-0 z-0 object-contain object-right opacity-30 mix-blend-multiply"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h3 className="serif-display text-4xl leading-tight text-brand-olive md:text-5xl">Founded by Salome Kopasz, Elöre is rooted in craft, story and slow fashion.</h3>
            <p className="mt-6 text-base leading-8 text-brand-olive/75 md:text-lg">Born in Cameroon and raised in Paris, Salomé&apos;s creative perspective was shaped by a life immersed in culture, fashion, and artistry. As a former model, she experienced the fashion world from within, developing an appreciation for the relationship between clothing, identity, and self-expression…</p>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn-olive">Read About ELÖRE ATELIER</Link>
            <Link href="/studio" className="btn-outline-olive">Enter the Atelier</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
