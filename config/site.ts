// Site configuration
// Update these values as needed

export type HeroVideo = {
  // Direct video file URL or a path under public/, not a YouTube watch URL.
  src: string;
  captions: { src: string; language: string; label: string }[];
};

export const siteConfig = {
  // Supply Ko Ivan's intended video and WebVTT captions when available.
  // Until then, the homepage keeps the existing community photo.
  heroVideo: null as HeroVideo | null,

  // Verified destinations from Legacy's public Linktree and 2026 profile.
  resources: {
    connectRegistrationUrl: "https://system.sukawarna-legacy.web.id/forms/fill/connect-registration-0gcyhp",
    aboutConnectUrl: "https://canva.link/legacyconnect2026",
    bibleCommunityUrl: "https://devotional.sukawarna-legacy.web.id/",
    profilePdfUrl: "https://ugc.production.linktr.ee/d0a38116-f81e-40f3-abb5-122ebfff5fd5_LEGACY-PROFILE-2026.pdf",
  },

  // Service Information
  service: {
    name: "Legacy Saturday Service",
    tagline: "Attach With God, Attach With Others",
    time: "5PM WIB",
    day: "Saturday",
    location: "GBI Aruna",
    locationDetail: "Main Hall 3rd Floor",
    address: "Jl. Aruna no. 19, Bandung",
    mapsUrl: "https://maps.app.goo.gl/fG8qwTPbrcvgci5t5",
  },

  // Social Media Links
  social: {
    instagram: "https://www.instagram.com/sukawarna.legacy/",
    youtube: "https://www.youtube.com/@legacygbisukawarna",
  },

  memberSystemUrl: "https://system.sukawarna-legacy.web.id",

  // YouTube Configuration
  youtube: {
    channelUrl: "https://www.youtube.com/@legacygbisukawarna",
    // Featured video IDs for the landing page
    featuredVideos: [
      {
        id: "MoFnUcway2U",
        title: "Legacy Saturday Service",
      },
      {
        id: "pY_PTISXq2c",
        title: "Live Worship",
      },
      {
        id: "EjW-e9K0Ank",
        title: "Sunday Service",
      },
    ],
  },

  // Sermon videos for the sermons page
  sermons: [
    {
      id: "MoFnUcway2U",
      title: "Legacy Saturday Service",
      date: "2024-12-21",
      preacher: "Legacy Team",
    },
    {
      id: "pY_PTISXq2c",
      title: "Live Worship",
      date: "2024-12-14",
      preacher: "Legacy Team",
    },
    {
      id: "EjW-e9K0Ank",
      title: "Sunday Service",
      date: "2024-12-08",
      preacher: "Legacy Team",
    },
    {
      id: "5Z83Ojqms8U",
      title: "Special Service",
      date: "2024-12-01",
      preacher: "Legacy Team",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
