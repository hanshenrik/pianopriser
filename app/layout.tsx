import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Link from 'next/link';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Pianopriser',
  description: 'Finn en pianostemmer i nærheten.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <header className="w-full">
                <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
                  <Link href="/">Hjem</Link>
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                  <ThemeSwitcher />
                </nav>
              </header>
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>

              <footer className="w-full flex items-center justify-end border-t mx-auto text-center text-xs gap-8 py-16"></footer>
            </div>
          </main>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
