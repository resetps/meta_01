"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getLandingImageUrl } from "@/lib/supabase/storage";
import LazyImage from "@/components/LazyImage";
import { useLeadStore } from "@/store/useLeadStore";

/**
 * ThankYou 페이지 - 상담 신청 완료 후 보여주는 페이지
 * 
 * 구성:
 * - Section 1: Hero (상담 완료 + 혜택 3개 + CTA)
 * - Section 2: 방문해야 하는 이유
 * - Section 3: 심리적 장벽 제거
 * - Section 5: 후기 카드 3개
 * - Section 6: CTA 섹션
 */
export default function ThankYouPage() {
  const router = useRouter();
  const { submittedName } = useLeadStore();
  
  // 이름이 있으면 사용, 없으면 '고객'으로 대체
  const displayName = submittedName || "고객";

  // 혜택 데이터
  const benefits = [
    {
      icon: "🔬",
      title: "3D-CT 정밀검사",
      subtitle: "무료",
      description: "내부 구조까지 정확하게",
    },
    {
      icon: "💬",
      title: "상담비",
      subtitle: "무료",
      description: "부담 없이 상담받으세요",
    },
    {
      icon: "💉",
      title: "리쥬란힐러",
      subtitle: "무료",
      description: "수술 예약 시 제공",
    },
  ];

  // 방문 이유 데이터
  const visitReasons = [
    {
      icon: "📷",
      text: "코 재수술은 CT로만 정확한 진단 가능",
    },
    {
      icon: "🚫",
      text: "사진·문의만으론 구조 파악 불가",
    },
    {
      icon: "🔍",
      text: "코끝 연골/비중격 기울기/재료 확인 필수",
    },
  ];

  // 부담 제거 데이터
  const comfortPoints = [
    {
      icon: "✅",
      text: "수술 결정 강요 없음",
    },
    {
      icon: "💡",
      text: "상담만 받고 돌아가도 충분한 도움",
    },
    {
      icon: "📋",
      text: "재수술 방향· 가능한 재료 · 비용까지 안내",
    },
  ];

  // 후기 이미지 (thankyou 전용 12개)
  const reviewImages = [
    "thankyou_1.jpg",
    "thankyou_2.jpg",
    "thankyou_3.jpg",
    "thankyou_4.jpg",
    "thankyou_5.jpg",
    "thankyou_6.jpg",
    "thankyou_7.jpg",
    "thankyou_8.jpg",
    "thankyou_9.jpg",
    "thankyou_10.jpg",
    "thankyou_11.jpg",
    "thankyou_12.jpg",
  ];

  // 슬라이드쇼 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 이미지 프리로딩 - 컴포넌트 마운트 시 모든 이미지 미리 로드
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = reviewImages.map((fileName) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = getLandingImageUrl(fileName);
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        // 일부 이미지 로드 실패해도 계속 진행
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  // 자동 슬라이드 효과 (이미지 로드 완료 후 시작)
  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviewImages.length);
    }, 3000); // 3초마다 전환

    return () => clearInterval(interval);
  }, [imagesLoaded, reviewImages.length]);

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const benefitVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const slideInLeftVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* ============================================
          Section 1 - Hero Section (상담 완료 + 혜택)
          ============================================ */}
      <section className="px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-2xl mx-auto">
          {/* 체크 아이콘 + 완료 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-10"
          >
            {/* 체크 아이콘 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <svg
                className="w-9 h-9 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            {/* 헤드라인 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg sm:text-xl font-semibold text-gray-600 mb-4"
            >
              ✔ 상담 신청 완료
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-600"
            >
              <span className="font-semibold text-gray-800">{displayName}</span>님을 위한 <span className="text-blue-600 font-semibold">특별 혜택</span>을 안내드립니다
            </motion.p>
          </motion.div>

          {/* 혜택 3개 카드 - 세로 배열, 가로 형태 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 sm:gap-4 mb-10"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={benefitVariants}
                className="bg-white rounded-2xl px-5 py-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex items-center gap-4"
              >
                {/* 아이콘 */}
                <div className="text-2xl sm:text-3xl flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
                
                {/* 텍스트 영역 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {benefit.description}
                  </p>
                </div>
                
                {/* 무료 배지 */}
                <div className="flex-shrink-0">
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white font-bold text-sm sm:text-base rounded-full">
                    {benefit.subtitle}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Primary CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center"
          >
            <motion.a
              href="http://pf.kakao.com/_CIxmrn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300"
              whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  "0 10px 30px -10px rgba(59, 130, 246, 0.3)",
                  "0 15px 35px -10px rgba(59, 130, 246, 0.4)",
                  "0 10px 30px -10px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <span>💎</span>
              <span>최대 40만원 상당 혜택</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          Section 2 - 이번 상담 기회를 놓치면 안 되는 이유!
          ============================================ */}
      <section className="px-4 py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {/* 섹션 제목 */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-8 text-center leading-tight"
              style={{ fontFamily: "'Nanum Pen Script', cursive" }}
            >
              이번 상담 기회를<br />
              <span className="text-rose-600">절대</span> 놓치면 안되는 이유!
            </motion.h2>

            {/* 이유 카드들 */}
            <div className="space-y-6">
              {/* 이유 1 */}
              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      3D-CT로 '내 코 상태의 기준'을 먼저 잡을 수 있습니다.
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                      CT로 연골·비중격·재료 상태를 정확히 확인하면 다른 병원 상담에서도 흔들리지 않는 기준점을 만들 수 있습니다.
                    </p>
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                      혜택: 3D-CT 무료 제공
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 이유 2 */}
              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      무료 상담이지만, 수술은 천천히 결정하셔도 됩니다
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                      재수술 가능 여부·안전한 재료·비용·회복까지 정확한 솔루션을 확인하는 시간이기 때문에 상담만 받아도 큰 도움이 됩니다.
                    </p>
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                      혜택: 상담비 무료
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 이유 3 */}
              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      리쥬란힐러로 수술 후 회복 부담을 줄일 수 있습니다.
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                      재생 효과로 붓기·질감 회복이 빨라지는 장점이 있어 재수술 과정이 훨씬 안정적입니다.
                    </p>
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                      혜택: 수술 예약 시 리쥬란힐러 무료
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 마지막 강조 문구 */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-8"
            >
              <p className="text-gray-700 font-medium text-sm sm:text-base mb-1">
                → 이 상담 혜택들은 이번 상담 신청 고객에게만 제공됩니다.
              </p>
              <p className="text-rose-600 font-bold text-base sm:text-lg">
                이번 기회를 놓치면 다시 제공되지 않습니다.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          Section 5 - 후기 카드 섹션
          ============================================ */}
      <section className="px-4 py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {/* 섹션 제목 */}
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center"
            >
              실제 경험 후기
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-500 text-sm mb-8 text-center"
            >
              강남언니 평균 평점 10.0점
            </motion.p>

            {/* 후기 카드 슬라이드쇼 */}
            <div className="relative overflow-hidden">
              {/* 슬라이드 컨테이너 */}
              <div className="relative h-[280px] sm:h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 w-full max-w-md">
                      <div className="relative aspect-[4/3]">
                        <LazyImage
                          src={getLandingImageUrl(reviewImages[currentSlide])}
                          alt={`환자 후기 ${currentSlide + 1}`}
                          fill
                          className="object-contain bg-white"
                          sizes="(max-width: 640px) 320px, 400px"
                          unoptimized
                        />
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <svg 
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              실제 후기
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {currentSlide + 1} / {reviewImages.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 네비게이션 버튼 */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + reviewImages.length) % reviewImages.length)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="이전 후기"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* 인디케이터 dots */}
                <div className="flex items-center gap-1.5">
                  {reviewImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? "bg-blue-600 w-6" 
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`후기 ${index + 1}로 이동`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % reviewImages.length)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="다음 후기"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          Section 6 - CTA 섹션 (강한 행동 유도)
          ============================================ */}
      <section className="px-4 py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {/* 섹션 제목 */}
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-8"
            >
              혜택 받고 방문하기
            </motion.h2>

            {/* CTA 버튼들 */}
            <div className="space-y-4">
              {/* Primary CTA - 3D-CT 예약 */}
              <motion.div variants={itemVariants}>
                <motion.a
                  href="http://pf.kakao.com/_CIxmrn/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all duration-300"
                  whileHover={{ 
                    y: -3, 
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 10px 30px -10px rgba(59, 130, 246, 0.3)",
                      "0 15px 35px -10px rgba(59, 130, 246, 0.45)",
                      "0 10px 30px -10px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <span className="text-xl">💎</span>
                  <span>최대 40만원 상당 혜택 받기</span>
                </motion.a>
              </motion.div>

              {/* Secondary CTA - 카카오톡 상담 */}
              <motion.div variants={itemVariants}>
                <motion.a
                  href="http://pf.kakao.com/_CIxmrn/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg rounded-2xl shadow-md transition-all duration-300 border-2 border-yellow-400 hover:border-yellow-500"
                  whileHover={{ 
                    y: -2,
                    boxShadow: "0 10px 30px -10px rgba(250, 204, 21, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">💬</span>
                  <span>카카오톡 빠른 상담</span>
                </motion.a>
              </motion.div>
            </div>

            {/* 작은 안내 문구 */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-600 mt-6"
            >
              카카오 상담을 이용하시면 <span className="font-semibold text-blue-600">즉시 응답</span>해드립니다
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 홈으로 돌아가기 링크 */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-md mx-auto text-center">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm underline underline-offset-4 transition-colors"
          >
            ← 홈으로 돌아가기
          </motion.button>
        </div>
      </section>
    </main>
  );
}

/* ============================================
   기존 코드 (숨김 처리)
   ============================================

  const buttons = [
    {
      emoji: "💬",
      text: "카카오톡 문의",
      href: "http://pf.kakao.com/_CIxmrn/chat",
      external: true,
      emphasized: true,
      bgColor: "bg-yellow-400 hover:bg-yellow-500",
      textColor: "text-gray-900",
    },
    {
      emoji: "📞",
      text: "전화 상담",
      href: "tel:02-6246-1113",
      external: false,
      emphasized: true,
      bgColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
    },
    {
      emoji: "📸",
      text: "전후사진 더보기",
      href: "https://www.instagram.com/resetps_ba/reels/",
      external: true,
      emphasized: false,
    },
    {
      emoji: "📹",
      text: "리셋 공식 유튜브",
      href: "https://www.youtube.com/@resetps/",
      external: true,
      emphasized: false,
    },
    {
      emoji: "🌐",
      text: "홈페이지 바로가기",
      href: "https://bit.ly/47ClQCA",
      external: true,
      emphasized: false,
    },
    {
      emoji: "🗺️",
      text: "병원 위치 보기",
      href: "https://naver.me/xdjDQYle",
      external: true,
      emphasized: false,
    },
  ];

*/
