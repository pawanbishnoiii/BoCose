import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BoCose Agent',
  description: 'Telegram-first AI chat agent builder.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
