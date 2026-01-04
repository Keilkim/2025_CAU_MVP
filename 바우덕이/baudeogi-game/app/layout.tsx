import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바우덕이 리듬게임",
  description: "조선시대 전설의 예인 바우덕이와 함께하는 리듬 게임",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-b from-amber-900 to-amber-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
