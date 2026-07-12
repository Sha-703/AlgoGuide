import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoGuide — Apprends les algorithmes",
  description: "Plateforme éducative d'algorithmique pour les élèves d'Afrique centrale",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
