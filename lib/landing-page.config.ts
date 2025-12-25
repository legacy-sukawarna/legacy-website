// Landing page configuration
// Update these values as needed

export const siteConfig = {
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
