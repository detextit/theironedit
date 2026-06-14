"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  blurDataURL: string;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () =>
      setOpenIndex((current) =>
        current === null ? current : (current - 1 + images.length) % images.length,
      ),
    [images.length],
  );
  const showNext = useCallback(
    () =>
      setOpenIndex((current) =>
        current === null ? current : (current + 1) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, close, showPrev, showNext]);

  const active = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open photo: ${image.caption}`}
            className="group relative block overflow-hidden rounded-[2rem] bg-[#eeeef0] text-left shadow-lg shadow-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b5b2bc] focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index < 3}
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121113]/85 via-transparent to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-[#ffffff]/15 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                View
              </span>
            </div>
            <span className="absolute inset-x-0 bottom-0 block p-5 text-sm font-medium text-[#eeeef0]">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121113]/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffffff]/10 text-2xl text-white transition hover:bg-[#ffffff]/20"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#ffffff]/10 text-2xl text-white transition hover:bg-[#ffffff]/20 sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#ffffff]/10 text-2xl text-white transition hover:bg-[#ffffff]/20 sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <figure
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-full w-full max-w-5xl flex-col items-center"
          >
            <div className="relative w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src={active.src}
                alt={active.alt}
                width={1400}
                height={933}
                placeholder="blur"
                blurDataURL={active.blurDataURL}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="h-auto max-h-[80vh] w-full object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-[#b5b2bc]">
              {active.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
