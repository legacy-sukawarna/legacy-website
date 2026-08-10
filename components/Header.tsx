"use client";

import Link from "next/link";
import { Instagram, Menu, X, Youtube } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import LanguageToggle from "@/components/LanguageToggle";
import { LocalizedText } from "@/components/LocalizedText";

const navLinks = [
  { href: "/#visit", en: "Visit", id: "Kunjungi" },
  { href: "/sermons", en: "Sermons", id: "Khotbah" },
  { href: "/blog", en: "Blog", id: "Blog" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="legacy-header">
      <div className="legacy-shell legacy-header-inner">
        <Link href="/" className="legacy-header-logo" aria-label="Sukawarna Legacy home">
          <span className="legacy-brand" aria-hidden="true">
            <span className="legacy-brand-place">Sukawarna</span>
            <span className="legacy-brand-main">Legacy</span>
          </span>
        </Link>

        <nav className="legacy-header-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <LocalizedText en={link.en} id={link.id} />
            </Link>
          ))}
        </nav>

        <div className="legacy-header-actions">
          <LanguageToggle />
          <a
            className="legacy-social-link"
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Sukawarna Legacy on Instagram"
          >
            <Instagram aria-hidden="true" size={18} />
          </a>
          <a
            className="legacy-social-link"
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="Sukawarna Legacy on YouTube"
          >
            <Youtube aria-hidden="true" size={18} />
          </a>
          <Link className="legacy-header-cta" href="/#visit">
            <LocalizedText en="Plan your visit" id="Rencanakan kunjungan" />
          </Link>
        </div>

        <button
          type="button"
          className="legacy-menu-button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="legacy-mobile-menu">
          <nav className="legacy-shell" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                <LocalizedText en={link.en} id={link.id} />
              </Link>
            ))}
            <LanguageToggle />
            <Link className="legacy-header-cta legacy-mobile-cta" href="/#visit" onClick={() => setMobileMenuOpen(false)}>
              <LocalizedText en="Plan your visit" id="Rencanakan kunjungan" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
