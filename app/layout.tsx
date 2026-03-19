import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'Book2Audio',
  description: 'Convert PDF and TXT uploads into browser-playable, downloadable audio.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            className: 'border border-white/10 bg-slate-900 text-slate-100',
          }}
        />
      </body>
    </html>
  );
}
