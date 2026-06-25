import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import BisCleanup from "@/components/BisCleanup";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlacDrop — Genuine CD-Quality Music Downloads",
  description:
    "Free lossless FLAC downloads — 16-bit/44.1kHz CD-quality audio. Search, discover, and download high-fidelity music without compression artifacts.",
  keywords: [
    "FLAC",
    "lossless audio",
    "CD quality",
    "free music downloads",
    "high fidelity",
    "16-bit",
    "44.1kHz",
  ],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "FlacDrop — Genuine CD-Quality Music Downloads",
    description:
      "Free lossless FLAC downloads — 16-bit/44.1kHz CD-quality audio. Search, discover, and download high-fidelity music.",
    siteName: "FlacDrop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlacDrop — Genuine CD-Quality Music Downloads",
    description:
      "Free lossless FLAC downloads — 16-bit/44.1kHz CD-quality audio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning />
      <body suppressHydrationWarning>
        <header className="site-header">
          <div className="site-header__inner">
            <a href="/" className="site-header__logo">
              <img src="/images/logo.png" alt="FlacDrop Logo" width={32} height={32} style={{ borderRadius: '50%' }} className="site-header__logo-img" />
              FlacDrop
            </a>
            <nav className="site-nav" aria-label="Main navigation">
              <a href="/verify" className="site-nav__link">
                Verify
              </a>
              <a href="/about" className="site-nav__link">
                About
              </a>
              <a
                href="https://github.com"
                className="site-nav__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <BisCleanup />
        <main>{children}</main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <p className="site-footer__copy">
              &copy; {new Date().getFullYear()} <span>FlacDrop</span>. Built
              for listeners who hear the difference.
            </p>
            <div className="site-footer__links">
              <a
                href="https://ko-fi.com"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ☕ Support on Ko-fi
              </a>
              <a
                href="https://github.com"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
