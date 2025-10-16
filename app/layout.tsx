import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "코 재수술 전문 상담 | 정확한 진단과 맞춤 솔루션",
  description: "코 재수술로 고민이신가요? 당신의 유형에 맞는 정확한 진단과 수술 방법을 확인하고, 전문의 상담을 받아보세요.",
  keywords: ["코 재수술", "코성형 재수술", "코 재수술 상담", "코끝 수술", "보형물 교체"],
  openGraph: {
    title: "코 재수술 전문 상담",
    description: "정확한 진단과 맞춤 재수술 솔루션",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

