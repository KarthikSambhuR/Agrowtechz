import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agrowtechz – Agricultural Intelligence Platform",
  description: "Transform raw environmental data into actionable farming intelligence with real-time monitoring, predictive analytics, and market forecasting.",
  keywords: "agriculture, farming, AI, crop monitoring, soil health, irrigation",
  authors: [{ name: "Agrowtechz" }],
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
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
