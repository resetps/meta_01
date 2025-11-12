import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import RevisionTypeGrid from "@/components/RevisionTypeGrid";
import UTMTracker from "@/components/UTMTracker";

// 첫 화면에 보이지 않는 컴포넌트들은 Dynamic Import로 지연 로딩
const DoctorProfileSection = dynamic(
  () => import("@/components/DoctorProfileSection"),
  {
    loading: () => (
      <div className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
        </div>
      </div>
    ),
  }
);

const ReviewCardsSection = dynamic(
  () => import("@/components/ReviewCardsSection"),
  {
    loading: () => (
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
        </div>
      </div>
    ),
  }
);

const LeadForm = dynamic(() => import("@/components/LeadForm"), {
  loading: () => (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto h-96 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
  ),
});

const FloatingLeadForm = dynamic(
  () => import("@/components/FloatingLeadForm"),
  {
    ssr: false,
  }
);

const ScrollPopupModal = dynamic(
  () => import("@/components/ScrollPopupModal"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* UTM 파라미터 추적 */}
      <Suspense fallback={null}>
        <UTMTracker />
      </Suspense>

      {/* Hero 섹션 */}
      <HeroSection />

      {/* 유형 선택 그리드 (채팅창 UI + 전후사진 포함) */}
      <RevisionTypeGrid />

      {/* 원장님 프로필 섹션 */}
      <DoctorProfileSection />

      {/* 후기 카드 섹션 */}
      <ReviewCardsSection />

      {/* 리드 폼 (유형 선택 후 나타남) */}
      <LeadForm />

      {/* 플로팅 상담 신청 폼 */}
      <FloatingLeadForm />

      {/* 스크롤 팝업 모달 */}
      <ScrollPopupModal />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center sm:text-left space-y-4">
            {/* 주소 */}
            <p className="text-gray-300 text-sm">
              서울 서초구 강남대로 509 하늘안과빌딩 B동 10층
            </p>
            
            {/* 사업자 정보 */}
            <div className="text-gray-400 text-xs sm:text-sm space-y-1">
              <p>
                상호명 : 리셋성형외과의원 | 대표자명 : 이정한 | 사업자등록번호 : 329-23-02174
              </p>
              <p>
                TEL : <a href="tel:02-6246-1113" className="hover:text-white transition-colors">02-6246-1113</a> | 
                FAX : 02-6246-1114 | 
                E-mail : <a href="mailto:resetps25@naver.com" className="hover:text-white transition-colors">resetps25@naver.com</a>
              </p>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-700 pt-4 mt-6">
              <p className="text-gray-500 text-xs text-center">
                COPYRIGHT ⓒ 리셋성형외과의원. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

