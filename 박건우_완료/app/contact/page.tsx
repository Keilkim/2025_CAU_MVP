// app/contact/page.tsx
import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Logo />

      <main className="pt-20 pb-16 px-6 sm:px-12 md:px-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-zinc-600 transition mb-4 inline-block"
            >
              ← 홈으로
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-800">
              문의하기
            </h1>
            <p className="mt-4 text-zinc-600">
              상품 구매나 기타 문의사항이 있으시면 연락 주세요.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="p-6 bg-zinc-50 rounded-xl">
              <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📞</span>
                전화 문의
              </h2>
              <p className="text-2xl font-bold text-zinc-900">
                010-0000-0000
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                운영시간: 평일 10:00 - 18:00 (주말/공휴일 휴무)
              </p>
            </div>

            {/* Email */}
            <div className="p-6 bg-zinc-50 rounded-xl">
              <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📧</span>
                이메일 문의
              </h2>
              <a
                href="mailto:contact@littlefriends.kr"
                className="text-xl font-medium text-zinc-900 hover:text-zinc-600 transition"
              >
                contact@littlefriends.kr
              </a>
              <p className="mt-2 text-sm text-zinc-500">
                문의 내용을 보내주시면 빠른 시일 내에 답변 드리겠습니다.
              </p>
            </div>

            {/* Instagram / SNS */}
            <div className="p-6 bg-zinc-50 rounded-xl">
              <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📱</span>
                SNS
              </h2>
              <a
                href="https://instagram.com/littlefriends"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-zinc-900 hover:text-zinc-600 transition"
              >
                @littlefriends
              </a>
              <p className="mt-2 text-sm text-zinc-500">
                새로운 상품 소식과 사육 정보를 확인하세요.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 border border-zinc-200 rounded-xl">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4">
              안내사항
            </h2>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>상품 구매 시 재고 확인을 위해 먼저 연락 부탁드립니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>직거래 및 택배 발송 모두 가능합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>생물 관련 상품은 계절에 따라 배송이 제한될 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>사육 관련 질문도 편하게 문의해 주세요.</span>
              </li>
            </ul>
          </div>

          {/* Back to Shop */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition"
            >
              상품 보러가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
