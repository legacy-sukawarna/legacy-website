// import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/query-provider";
import { LanguageProvider } from "@/providers/language-provider";
import {
  buildPageMetadata,
  SITE_DESCRIPTION,
  SITE_TAGLINE_TITLE,
  siteUrl,
} from "@/lib/seo";

// Fallback for pages without their own metadata; no path, so those pages do
// not claim the home page's canonical URL.
export const metadata = {
  ...buildPageMetadata({
    title: SITE_TAGLINE_TITLE,
    description: SITE_DESCRIPTION,
  }),
  metadataBase: new URL(siteUrl),
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
