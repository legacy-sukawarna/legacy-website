// import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/query-provider";
import { LanguageProvider } from "@/providers/language-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL || "https://sukawarna-legacy.web.id";

const previewImage = {
  url: "/assets/legacy-preview.jpg",
  width: 1200,
  height: 630,
  alt: "Sukawarna Legacy community gathering",
};

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Sukawarna Legacy — Attach With God, Attach With Others",
  description: "A youth church community in Bandung, Indonesia.",
  openGraph: {
    title: "Sukawarna Legacy — Attach With God, Attach With Others",
    description: "A youth church community in Bandung, Indonesia.",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sukawarna Legacy — Attach With God, Attach With Others",
    description: "A youth church community in Bandung, Indonesia.",
    images: [previewImage.url],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              disableTransitionOnChange
            >
              <div className="min-h-[100dvh]">{children}</div>
              <Toaster />
              <Analytics />
            </ThemeProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
