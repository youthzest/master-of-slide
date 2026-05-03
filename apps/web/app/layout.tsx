import type { Metadata } from 'next';
import { Geist, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

const instrument = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Master Of Slide — slides as React code, crafted by agents',
  description:
    'A React-first slide framework based on open-slide, optimized for Korean decks with Markdown, image, PDF, and PPTX workflows.',
  metadataBase: new URL('https://open-slide.dev'),
  openGraph: {
    title: 'Master Of Slide',
    description: 'A React-first slide framework based on open-slide, crafted by agents.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Of Slide',
    description: 'A React-first slide framework based on open-slide, crafted by agents.',
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
      suppressHydrationWarning
      className={`${geist.variable} ${jetbrains.variable} ${instrument.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
