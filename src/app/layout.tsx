import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://setofdecore.store"),
  title: {
    default: "Set of Decore | Home Textiles & More",
    template: "%s | Set of Decore",
  },
  description:
    "Thoughtfully selected home textiles — bedsheets, sofa covers, curtains and cushion covers — with nationwide delivery across Pakistan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} bg-bg text-ink font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
