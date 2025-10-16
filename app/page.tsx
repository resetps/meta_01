import HeroSection from "@/components/HeroSection";
import RevisionTypeGrid from "@/components/RevisionTypeGrid";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero 섹션 */}
      <HeroSection />

      {/* 유형 선택 그리드 (채팅창 UI + 전후사진 포함) */}
      <RevisionTypeGrid />

      {/* 리드 폼 (유형 선택 후 나타남) */}
      <LeadForm />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 코 재수술 전문 클리닉. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            본 웹사이트의 정보는 의료 상담을 대체할 수 없습니다.
          </p>
        </div>
      </footer>
    </main>
  );
}

