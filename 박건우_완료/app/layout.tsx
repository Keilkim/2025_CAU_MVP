// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/app/components/Nav";

export const metadata: Metadata = {
  title: "리틀프렌즈 - 곤충 & 파충류 용품 전문점",
  description: "사슴벌레, 장수풍뎅이, 도마뱀, 뱀 등 곤충과 파충류 사육용품 전문 쇼핑몰",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-black antialiased overflow-x-hidden">
        <Nav />
        {children}
      </body>
    </html>
  );
}
