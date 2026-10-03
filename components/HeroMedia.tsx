"use client";

import Image from "next/image";
import { useState } from "react";

import type { HeroVideo } from "@/config/site";
import { LocalizedText } from "@/components/LocalizedText";
import { useLanguage } from "@/providers/language-provider";

export const HeroMedia = ({ video }: { video: HeroVideo | null }) => {
  const [failed, setFailed] = useState(false);
  const { language } = useLanguage();
  const showVideo = !!video?.src && !failed;

  return (
    <div className={`legacy-hero-image-wrap${showVideo ? " legacy-hero-video-wrap" : ""}`}>
      {showVideo ? (
        <video
          className="legacy-hero-video"
          src={video.src}
          controls
          playsInline
          preload="none"
          poster="/assets/legacy-25.jpg"
          aria-label={language === "id" ? "Video dari Ko Ivan" : "Video from Ko Ivan"}
          onError={() => setFailed(true)}
        >
          {video.captions.map((caption, index) => (
            <track
              key={caption.language}
              kind="captions"
              src={caption.src}
              srcLang={caption.language}
              label={caption.label}
              default={index === 0}
            />
          ))}
          <LocalizedText en="Your browser cannot play this video." id="Browser Anda tidak dapat memutar video ini." />
        </video>
      ) : (
        <Image
          src="/assets/legacy-25.jpg"
          alt={language === "id" ? "Jemaat berpelukan saat ibadah di Sukawarna Legacy" : "People embracing during worship at Sukawarna Legacy"}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 58vw"
          className="legacy-hero-image"
        />
      )}
      {!showVideo && (
        <div className="legacy-hero-image-note">
          <span><LocalizedText en="Saturday" id="Sabtu" /></span>
          <span>5PM WIB</span>
        </div>
      )}
    </div>
  );
};
