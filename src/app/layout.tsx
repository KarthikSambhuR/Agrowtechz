import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farmio",
  description: "Transform raw environmental data into actionable farming intelligence with real-time monitoring, predictive analytics, and market forecasting.",
  keywords: "agriculture, farming, AI, crop monitoring, soil health, irrigation",
  authors: [{ name: "Farmio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
