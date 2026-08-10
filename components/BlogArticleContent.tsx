"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { useLanguage } from "@/providers/language-provider";

type BlogImage = {
  src: string;
  alt: string;
};

type BlogArticleContentProps = {
  html: string;
  featuredImage?: string | null;
  featuredAlt: string;
};

const getImageSource = (image: HTMLImageElement) => image.currentSrc || image.src;

const toAbsoluteSource = (source: string) => {
  try {
    return new URL(source, window.location.href).href;
  } catch {
    return source;
  }
};

const uniqueImages = (images: BlogImage[]) => {
  const seen = new Set<string>();

  return images.filter((image) => {
    if (!image.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
};

export const BlogArticleContent = ({
  html,
  featuredImage,
  featuredAlt,
}: BlogArticleContentProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<BlogImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { language } = useLanguage();

  const labels = language === "id"
    ? {
        close: "Tutup penampil gambar",
        next: "Gambar berikutnya",
        open: "Buka gambar",
        previous: "Gambar sebelumnya",
        viewer: "Penampil gambar",
      }
    : {
        close: "Close image viewer",
        next: "Next image",
        open: "Open image",
        previous: "Previous image",
        viewer: "Image viewer",
      };

  const openFeaturedImage = () => {
    if (!featuredImage) return;

    const source = toAbsoluteSource(featuredImage);
    const index = gallery.findIndex((galleryImage) => galleryImage.src === source);

    if (index >= 0) setActiveIndex(index);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const contentImages = Array.from(
      root.querySelectorAll<HTMLImageElement>(".legacy-article-body img"),
    );
    const images = uniqueImages([
      ...(featuredImage
        ? [{ src: toAbsoluteSource(featuredImage), alt: featuredAlt }]
        : []),
      ...contentImages.map((image) => ({
        src: toAbsoluteSource(getImageSource(image)),
        alt: image.alt || featuredAlt,
      })),
    ]);

    setGallery(images);

    contentImages.forEach((image) => {
      image.classList.add("legacy-article-content-image");
      image.setAttribute("aria-label", labels.open);
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
    });

    const openImage = (image: HTMLImageElement) => {
      const source = toAbsoluteSource(getImageSource(image));
      const index = images.findIndex((galleryImage) => galleryImage.src === source);

      if (index >= 0) setActiveIndex(index);
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const image = event.target.closest<HTMLImageElement>("img");
      if (!image || !root.contains(image)) return;

      event.preventDefault();
      openImage(image);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (!(event.target instanceof Element)) return;

      const image = event.target.closest<HTMLImageElement>("img");
      if (!image || !root.contains(image)) return;

      event.preventDefault();
      openImage(image);
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("keydown", handleKeyDown);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("keydown", handleKeyDown);
    };
  }, [featuredAlt, featuredImage, html, labels.open]);

  useEffect(() => {
    if (activeIndex !== null && activeIndex >= gallery.length) {
      setActiveIndex(null);
    }
  }, [activeIndex, gallery.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleViewerKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (gallery.length < 2) return;
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null ? index : (index - 1 + gallery.length) % gallery.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === null ? index : (index + 1) % gallery.length,
        );
      }
    };

    window.addEventListener("keydown", handleViewerKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleViewerKeyDown);
    };
  }, [activeIndex, gallery.length]);

  const activeImage = activeIndex === null ? null : gallery[activeIndex];

  return (
    <div
      ref={rootRef}
      className={`legacy-article-content${featuredImage ? " legacy-article-content-with-media" : ""}`}
    >
      {featuredImage && (
        <div className="legacy-article-media-section">
          <div className="legacy-shell">
            <div className="legacy-article-media-wrap">
              <button
                type="button"
                className="legacy-article-image-button"
                aria-label={labels.open}
                onClick={openFeaturedImage}
              >
                <img src={featuredImage} alt={featuredAlt} className="legacy-article-media" />
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="legacy-article-body-section">
        <div className="legacy-shell">
          <div
            className="blog-content legacy-article-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      {activeImage && activeIndex !== null && (
        <div
          className="legacy-article-viewer"
          role="dialog"
          aria-label={labels.viewer}
          aria-modal="true"
        >
          <button
            type="button"
            className="legacy-article-viewer-backdrop"
            aria-label={labels.close}
            onClick={() => setActiveIndex(null)}
          />

          <div className="legacy-article-viewer-dialog">
            <div className="legacy-article-viewer-toolbar">
              <p className="legacy-kicker">
                {activeIndex + 1} / {gallery.length}
              </p>
              <button
                type="button"
                className="legacy-article-viewer-button"
                aria-label={labels.close}
                onClick={() => setActiveIndex(null)}
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <figure className="legacy-article-viewer-figure">
              {gallery.length > 1 && (
                <button
                  type="button"
                  className="legacy-article-viewer-button legacy-article-viewer-nav legacy-article-viewer-nav-previous"
                  aria-label={labels.previous}
                  onClick={() =>
                    setActiveIndex((index) =>
                      index === null ? index : (index - 1 + gallery.length) % gallery.length,
                    )
                  }
                >
                  <ChevronLeft aria-hidden="true" size={26} />
                </button>
              )}

              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="legacy-article-viewer-image"
              />

              {gallery.length > 1 && (
                <button
                  type="button"
                  className="legacy-article-viewer-button legacy-article-viewer-nav legacy-article-viewer-nav-next"
                  aria-label={labels.next}
                  onClick={() =>
                    setActiveIndex((index) =>
                      index === null ? index : (index + 1) % gallery.length,
                    )
                  }
                >
                  <ChevronRight aria-hidden="true" size={26} />
                </button>
              )}
            </figure>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogArticleContent;
