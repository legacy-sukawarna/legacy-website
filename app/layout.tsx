// import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/query-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Legacy Saturday Service",
  description: "Youth Church Community",
  openGraph: {
    title: "Legacy Saturday Service",
    description: "Youth Church Community",
    images: ["/assets/legacy-logo-white.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legacy Saturday Service",
    description: "Youth Church Community",
    images: ["/assets/legacy-logo-white.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <main className="flex flex-col h-screen">{children}</main>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
