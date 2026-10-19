import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akshat Ghee | Customer Review",
  description:
    "Share your honest feedback on Akshat Ghee (Desi Cow & Buffalo Ghee). Takes under 30 seconds to post on Google.",
  keywords: [
    "Akshat Ghee",
    "Desi Cow Ghee",
    "Buffalo Ghee",
    "Danedar Ghee",
    "Google Review",
  ],
  authors: [{ name: "Akshat Ghee" }],
  icons: {
    icon: "/icon.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#242120] selection:bg-[#f6ded9] selection:text-[#af4930]">
        {children}
      </body>
    </html>
  );
}
