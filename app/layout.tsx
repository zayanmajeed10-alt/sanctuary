import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanctuary | Premium Tracking",
  description: "Your intelligent prenatal companion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use 'as any' to force TypeScript to accept the Clerk pre-built dark theme object
  const clerkAppearance = {
    baseTheme: dark,
  } as any;

  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}