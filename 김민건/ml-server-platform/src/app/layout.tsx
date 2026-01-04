import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "ML Server Platform - AI 모델을 더 쉽게, 더 빠르게",
  description: "딥러닝/머신러닝 모델을 클릭 한 번으로 실행하세요. 전 세계 개발자들이 만든 최첨단 AI 모델을 손쉽게 활용할 수 있습니다.",
  keywords: ["AI", "Machine Learning", "Deep Learning", "GPU", "서버", "모델"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
