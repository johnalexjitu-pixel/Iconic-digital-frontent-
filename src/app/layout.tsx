import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const lexend = Lexend({ 
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Iconic Digital - Award-winning creative & performance marketing agency",
  description: "Iconic Digital is an award-winning creative and performance marketing agency. We blend creative excellence with performance marketing to deliver outstanding results for your brand.",
  keywords: "marketing agency, creative agency, performance marketing, digital marketing, brand strategy, advertising, Iconic Digital",
  authors: [{ name: "Iconic Digital" }],
  creator: "Iconic Digital",
  publisher: "Iconic Digital",
  robots: "index, follow",
  openGraph: {
    title: "Iconic Digital - Award-winning creative & performance marketing agency",
    description: "Iconic Digital is an award-winning creative and performance marketing agency. We blend creative excellence with performance marketing to deliver outstanding results for your brand.",
    type: "website",
    locale: "en_US",
    siteName: "Iconic Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iconic Digital - Award-winning creative & performance marketing agency",
    description: "Iconic Digital is an award-winning creative and performance marketing agency. We blend creative excellence with performance marketing to deliver outstanding results for your brand.",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} font-lexend`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
