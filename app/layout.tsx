import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { IntlProvider } from "@/components/intl-provider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Opportunity Scanner",
    default: "Opportunity Scanner",
  },
  description: "Daily AI and software market gap analysis.",
  openGraph: {
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
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
      data-theme="light"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <IntlProvider>{children}</IntlProvider>
      </body>
    </html>
  );
}
