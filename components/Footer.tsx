import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MapPin, Clock, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Service Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {siteConfig.service.name}
            </h3>
            <div className="space-y-2 text-slate-400 text-sm">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                {siteConfig.service.day} at {siteConfig.service.time}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                <span>
                  {siteConfig.service.location}
                  <br />
                  {siteConfig.service.locationDetail}
                  <br />
                  {siteConfig.service.address}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <Link
                href="/login"
                className="block text-slate-400 hover:text-orange-400 transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                href="/sermons"
                className="block text-slate-400 hover:text-orange-400 transition-colors text-sm"
              >
                Sermons
              </Link>
              <Link
                href="/blog"
                className="block text-slate-400 hover:text-orange-400 transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                href="/yearly-verse"
                className="block text-slate-400 hover:text-orange-400 transition-colors text-sm"
              >
                Yearly Verse
              </Link>
              <a
                href={siteConfig.service.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-slate-400 hover:text-orange-400 transition-colors text-sm"
              >
                Get Directions
              </a>
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 group"
              >
                <Youtube className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Legacy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
