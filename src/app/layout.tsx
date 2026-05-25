import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
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
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeBis = (node) => {
                  if (node && node.nodeType === 1) {
                    if (node.hasAttribute('bis_skin_checked')) {
                      node.removeAttribute('bis_skin_checked');
                    }
                    node.querySelectorAll('[bis_skin_checked]').forEach(el => el.removeAttribute('bis_skin_checked'));
                  }
                };
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                    if (mutation.addedNodes) {
                      mutation.addedNodes.forEach(removeBis);
                    }
                  });
                });
                if (typeof document !== 'undefined' && document.documentElement) {
                  removeBis(document.documentElement);
                  observer.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <header className="site-header">
          <div className="site-header__inner">
            <a href="/" className="site-header__logo">
              <span className="site-header__logo-dot" aria-hidden="true" />
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
