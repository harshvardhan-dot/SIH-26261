import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AICTE Verify — AI-Powered Approval Platform",
  description: "AI-powered decision-support platform for AICTE's Extension of Approval processing. Validates documents, detects anomalies, verifies through issuing authorities, and checks regulatory compliance.",
  keywords: "AICTE, approval, EoA, document verification, AI, compliance, technical education",
};

import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
