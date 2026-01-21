import Link from "next/link";
import Header from "@/components/Header";
import HeroCTA from "@/components/HeroCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Clock,
  Calendar,
  Youtube,
  Instagram,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export default function Index() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pb-24">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-600 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {siteConfig.service.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-orange-200/90 mb-4 font-light">
            {siteConfig.service.tagline}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-slate-300 mb-10">
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-orange-400" />
              {siteConfig.service.day}
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="w-5 h-5 text-orange-400" />
              {siteConfig.service.time}
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-orange-400" />
              {siteConfig.service.location}
            </span>
          </div>

          <HeroCTA mapsUrl={siteConfig.service.mapsUrl} />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* Service Information Section */}
      <section id="about" className="py-24 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Experience meaningful worship and genuine connections every Saturday
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* When Card */}
            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                  <Clock className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">When</h3>
                <p className="text-2xl font-bold text-orange-400 mb-1">{siteConfig.service.day}</p>
                <p className="text-slate-400">{siteConfig.service.time}</p>
              </CardContent>
            </Card>

            {/* Where Card */}
            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                  <MapPin className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Where</h3>
                <p className="text-lg font-semibold text-white mb-1">{siteConfig.service.location}</p>
                <p className="text-slate-400 text-sm mb-1">{siteConfig.service.locationDetail}</p>
                <p className="text-slate-500 text-sm">{siteConfig.service.address}</p>
              </CardContent>
            </Card>

            {/* Directions Card */}
            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 group md:col-span-2 lg:col-span-1">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                  <ExternalLink className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Find Us</h3>
                <p className="text-slate-400 mb-6 flex-grow">Get directions to our location via Google Maps</p>
                <a
                  href={siteConfig.service.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    Open in Maps
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Watch Our Latest Videos
            </h2>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Catch up on our sermons and worship sessions
            </p>
            <a
              href={siteConfig.youtube.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <Youtube className="w-5 h-5 mr-2" />
                Visit Our Channel
              </Button>
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.youtube.featuredVideos.map((video, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 group">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-medium group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section id="events" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Connect With Us
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            Follow us on social media to stay updated with our latest events and announcements
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {/* Instagram */}
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-0.5 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25">
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                  <Instagram className="w-10 h-10 text-white" />
                </div>
              </div>
              <p className="mt-3 text-slate-400 group-hover:text-white transition-colors font-medium">Instagram</p>
            </a>

            {/* YouTube */}
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="w-24 h-24 rounded-2xl bg-red-600 p-0.5 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25">
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                  <Youtube className="w-10 h-10 text-white" />
                </div>
              </div>
              <p className="mt-3 text-slate-400 group-hover:text-white transition-colors font-medium">YouTube</p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
