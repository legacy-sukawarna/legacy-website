import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";

import { siteConfig } from "@/config/site";
import { LocalizedText } from "@/components/LocalizedText";

export default function Footer() {
  return (
    <footer className="legacy-footer">
      <div className="legacy-shell">
        <div className="legacy-footer-grid">
          <div>
            <Link href="/" className="legacy-footer-logo">
              <span className="legacy-brand" aria-hidden="true">
                <span className="legacy-brand-place">Sukawarna</span>
                <span className="legacy-brand-main">Legacy</span>
              </span>
            </Link>
            <p className="legacy-footer-description">
              <LocalizedText
                en="A youth church community in Bandung, Indonesia."
                id="Komunitas gereja muda di Bandung, Indonesia."
              />
            </p>
          </div>

          <div>
            <p className="legacy-kicker">
              <LocalizedText en="Explore" id="Jelajahi" />
            </p>
            <nav className="legacy-footer-links" aria-label="Explore">
              <Link href="/#visit"><LocalizedText en="Visit" id="Kunjungi" /></Link>
              <Link href="/sermons"><LocalizedText en="Sermons" id="Khotbah" /></Link>
              <Link href="/blog"><LocalizedText en="Blog" id="Blog" /></Link>
            </nav>
          </div>

          <div>
            <p className="legacy-kicker">
              <LocalizedText en="Find us" id="Temui kami" />
            </p>
            <p className="legacy-footer-detail">
              {siteConfig.service.location}
              <br />
              {siteConfig.service.address}
            </p>
            <a
              className="legacy-text-link legacy-text-link-accent"
              href={siteConfig.service.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <LocalizedText en="View on map" id="Lihat di peta" />
            </a>
          </div>

          <div>
            <p className="legacy-kicker">
              <LocalizedText en="Connect" id="Terhubung" />
            </p>
            <div className="legacy-footer-socials">
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Sukawarna Legacy on Instagram">
                <Instagram aria-hidden="true" size={19} />
              </a>
              <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" aria-label="Sukawarna Legacy on YouTube">
                <Youtube aria-hidden="true" size={19} />
              </a>
              <a href={siteConfig.memberSystemUrl} target="_blank" rel="noreferrer">
                <LocalizedText en="Member system" id="Sistem jemaat" />
              </a>
            </div>
          </div>
        </div>

        <div className="legacy-footer-bottom">
          <span>© {new Date().getFullYear()} Sukawarna Legacy</span>
          <span>
            <LocalizedText
              en="Attach With God, Attach With Others"
              id="Melekat pada Tuhan, Melekat satu sama lain"
            />
          </span>
        </div>
      </div>
    </footer>
  );
}
