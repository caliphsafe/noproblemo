import Image from "next/image";
import Link from "next/link";

const stages = [
  "The Conversation",
  "The Form",
  "The Material",
  "The Details",
  "The Making",
  "Your ELÖRE"
];

const measureSteps = [
  ["01", "Gather your measuring tool", "Use a soft measuring tape. If you don't have one, a piece of string and a ruler will work just as well."],
  ["02", "Position the tape correctly", "Wrap the tape around your head approximately 1 cm (½ inch) above your ears, passing across the center of your forehead where your hat will naturally rest."],
  ["03", "Measure comfortably", "Hold the tape snug against your head without pulling it too tightly. The fit should feel secure but comfortable."],
  ["04", "Record your measurement", "Read your head circumference in centimeters. If your measurement falls between two sizes, we recommend selecting the next larger size for the best fit."]
];

export default function CustomPage() {
  return (
    <main className="custom-page">
      <section className="custom-opening">
        <div className="editorial-container custom-opening__inner">
          <div className="custom-opening__copy">
            <h1 className="serif-display">A one-of-one piece crafted around your story.</h1>
            <p>Designed exclusively for you, our custom hats are handcrafted through a collaborative process that honors both authenticity and craftsmanship.</p>
            <Link href="#custom-process" className="btn-olive">Begin Your Custom Hat</Link>
          </div>
          <div className="custom-opening__image" style={{ clipPath: "none", borderRadius: 0 }}>
            <Image src="/images/custom/hero.jpg" alt="ELÖRE custom hat design" fill priority sizes="(max-width:1024px) 100vw,46vw" className="object-cover" style={{ objectPosition: "50% 25%" }} />
          </div>
        </div>
      </section>

      <section id="custom-process" className="custom-process relative overflow-hidden">
        <Image src="/images/bg/elorebg7.png" alt="" fill sizes="(max-width: 1024px) 80vw, 42vw" className="pointer-events-none absolute inset-y-0 left-0 z-0 object-contain object-left opacity-30 mix-blend-soft-light" aria-hidden="true" />
        <div className="editorial-container custom-process__inner relative z-10">
          <div className="custom-process__heading"><h2 className="serif-display">Six stages. One piece shaped around you.</h2></div>
          <div className="custom-process__list">{stages.map((stage, index) => (<div className="custom-process__item" key={stage}><span className="serif-display">0{index + 1}</span><h3 className="serif-display">{stage}</h3></div>))}</div>
          <div className="custom-process__film"><video src="/video/custom.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="ELÖRE custom hat making process" /></div>
        </div>
      </section>

      <section className="custom-fit relative overflow-hidden">
        <Image src="/images/bg/elorebg7.png" alt="" fill sizes="(max-width: 1024px) 80vw, 40vw" className="pointer-events-none absolute inset-y-0 right-0 z-0 object-contain object-right opacity-30 mix-blend-multiply" aria-hidden="true" />
        <div className="editorial-container custom-fit__inner relative z-10">
          <div className="custom-fit__intro"><h2 className="serif-display">Find Your Perfect Fit</h2><p>Every bespoke hat begins with an accurate measurement. Taking a few moments to measure your head ensures your custom piece is crafted with the fit and comfort it deserves.</p></div>
          <div className="custom-fit__steps bg-brand-sand/72 backdrop-blur-[2px]">{measureSteps.map(([number, title, description]) => (<div className="custom-fit__step" key={number}><span className="serif-display">{number}</span><div><h3 className="serif-display">{title}</h3><p>{description}</p></div></div>))}<div className="custom-fit__help"><h3 className="serif-display">Need Assistance?</h3><p>If you have any questions about sizing or would like guidance before placing your custom order, we're here to help. Contact us at: <a href="mailto:Salome@EloreAtelier.com">Salome@EloreAtelier.com</a></p></div></div>
        </div>
      </section>

      <section className="custom-close"><div className="editorial-container custom-close__inner"><h2 className="serif-display">Begin your custom consultation.</h2><Link href="/contact" className="btn-light">Submit Inquiry</Link></div></section>
    </main>
  );
}
