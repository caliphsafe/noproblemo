import Image from "next/image";

const galleryImages = [
  "/images/about/about_gallery/2.jpg",
  "/images/about/about_gallery/3.jpg",
  "/images/about/about_gallery/4.jpg",
];

type AboutGalleryCarouselProps = { className?: string; sizes?: string };

export function AboutGalleryCarousel({ className = "", sizes = "(max-width: 1024px) 100vw, 48vw" }: AboutGalleryCarouselProps) {
  return (
    <div className={`relative overflow-hidden border thin-border bg-[#f7f1ea] shadow-soft ${className}`} style={{ borderRadius: 0, clipPath: "none" }}>
      <style>{`
        @keyframes aboutGalleryContinuous {
          0%, 4% { opacity: 0; transform: scale(1.03); }
          6%, 27% { opacity: 1; transform: scale(1.01); }
          30%, 33% { opacity: 0; transform: scale(1); }
          100% { opacity: 0; transform: scale(1); }
        }
        .about-gallery-carousel__continuous {
          opacity: 0;
          animation: aboutGalleryContinuous 15s infinite;
          transform: scale(1.03);
        }
        @media (prefers-reduced-motion: reduce) {
          .about-gallery-carousel__continuous {
            animation: none;
            opacity: 0;
            transform: none;
          }
          .about-gallery-carousel__continuous:first-of-type {
            opacity: 1;
          }
        }
      `}</style>
      {galleryImages.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={`Salomé Kopasz and ELÖRE ATELIER image ${index + 1}`}
          fill
          priority={index === 0}
          sizes={sizes}
          className="about-gallery-carousel__continuous object-cover"
          style={{ animationDelay: `${index * 5}s` }}
        />
      ))}
    </div>
  );
}
