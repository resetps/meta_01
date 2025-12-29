'use client';

import { useState } from 'react';
import { getLandingImageUrl } from '@/lib/supabase/storage';
import Image from 'next/image';

/**
 * 네비게이션 메뉴 항목 타입
 */
interface NavItem {
  label: string;
  href: string;
}

/**
 * 네비게이션 메뉴 데이터
 */
const NAV_ITEMS: NavItem[] = [
  {
    label: '의료진 소개',
    href: 'https://www.resetps.com/about/doctor.php?utm_source=LP01&utm_medium=referral&utm_campaign=LP01&utm_term=%EC%BD%94%EC%9E%AC%EC%88%98%EC%88%A0&utm_content=%EC%9D%98%EB%A3%8C%EC%A7%84%EC%86%8C%EA%B0%9C',
  },
  {
    label: '병원둘러보기',
    href: 'https://www.resetps.com/about/gallery.php?utm_source=LP01&utm_medium=referral&utm_campaign=LP01&utm_term=%EC%BD%94%EC%9E%AC%EC%88%98%EC%88%A0&utm_content=%EB%B3%91%EC%9B%90%EB%91%98%EB%9F%AC%EB%B3%B4%EA%B8%B0',
  },
  {
    label: '리셋 코성형',
    href: 'https://www.resetps.com/clinicInfoResetps/nose/resetNose.php?utm_source=LP01&utm_medium=referral&utm_campaign=LP01&utm_term=%EC%BD%94%EC%9E%AC%EC%88%98%EC%88%A0&utm_content=%EB%A6%AC%EC%85%8B%EC%BD%94%EC%84%B1%ED%98%95',
  },
  {
    label: '이벤트',
    href: 'https://www.resetps.com/event/event.php?utm_source=LP01&utm_medium=referral&utm_campaign=LP01&utm_term=%EC%BD%94%EC%9E%AC%EC%88%98%EC%88%A0&utm_content=%EC%9D%B4%EB%B2%A4%ED%8A%B8',
  },
  {
    label: '전후사진',
    href: 'https://www.resetps.com/board/bnfList.php?code1=4300&utm_source=LP01&utm_medium=referral&utm_campaign=LP01&utm_term=%EC%BD%94%EC%9E%AC%EC%88%98%EC%88%A0&utm_content=%EC%A0%84%ED%9B%84%EC%82%AC%EC%A7%84',
  },
  {
    label: '카톡상담',
    href: 'https://pf.kakao.com/_CIxmrn/chat',
  },
  {
    label: '리얼모델 지원',
    href: 'https://www.resetps.com/contact/realModel.php?utm_source=LP01&utm_medium=referral&utm_campaign=LP01&utm_term=%EC%BD%94%EC%9E%AC%EC%88%98%EC%88%A0&utm_content=%EB%A6%AC%EC%96%BC%EB%AA%A8%EB%8D%B8%EC%A7%80%EC%9B%90',
  },
];

/**
 * Navigation 컴포넌트
 * 
 * PC: 로고와 메뉴가 가로로 나열
 * 모바일: 로고(왼쪽) + 햄버거 메뉴(오른쪽), 클릭시 전체화면 메뉴 오픈
 */
export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const logoUrl = getLandingImageUrl('logo.png');

  /**
   * 외부 링크 클릭 핸들러
   * 새 탭에서 링크를 열고 모바일 메뉴를 닫습니다
   */
  const handleNavClick = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <a 
                href="https://www.resetps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Image
                  src={logoUrl}
                  alt="리셋성형외과"
                  width={120}
                  height={40}
                  className="h-8 lg:h-10 w-auto"
                  priority
                />
              </a>
            </div>

            {/* PC 메뉴 (lg 이상에서만 표시) */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base transition-colors duration-200 whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 모바일 햄버거 버튼 (lg 미만에서만 표시) */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                aria-label="메뉴"
              >
                {isMobileMenuOpen ? (
                  // X 아이콘 (메뉴 열렸을 때)
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // 햄버거 아이콘 (3줄)
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 전체화면 메뉴 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16">
          <div className="px-4 py-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 네비게이션 높이만큼 스페이서 (컨텐츠가 네비게이션 아래로 가지 않도록) */}
      <div className="h-16 lg:h-20" />
    </>
  );
}

