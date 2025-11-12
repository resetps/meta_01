import Link from "next/link";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 리셋성형외과",
  description: "리셋성형외과의원 개인정보 처리방침 - 광고 랜딩페이지용",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">개인정보 처리방침</h1>
          <p className="mt-2 text-blue-100">리셋성형외과의원</p>
        </div>
      </div>

      {/* 내용 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <PrivacyPolicyContent />
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            개인정보 보호와 관련하여 궁금하신 사항이 있으시면 언제든지 연락주시기 바랍니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:02-6246-1113"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              전화 문의: 02-6246-1113
            </a>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 리셋성형외과의원. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            개인정보 보호책임자: 이정환 | 연락처: 02-6246-1113
          </p>
        </div>
      </footer>
    </div>
  );
}


