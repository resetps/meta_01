"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { getLandingImageUrl } from "@/lib/supabase/storage";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

/**
 * ReviewCardsSection 컴포넌트
 * 
 * 실제 환자 후기 이미지 14개를 카드 형태로 겹쳐서 표시하는 섹션
 * - 각 카드는 살짝 회전되어 팬(부채) 모양으로 배치됨
 * - 카피 텍스트가 카드들 위에 표시됨
 * - 스크롤에 따라 하나씩 아래에서 위로 올라오는 애니메이션
 */
export default function ReviewCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // 현재 등장한 카드 개수
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null); // hover된 카드
  const [autoShowCardIndex, setAutoShowCardIndex] = useState<number | null>(null); // 자동 표시 카드
  const [isUserInteracting, setIsUserInteracting] = useState(false); // 사용자 인터랙션 중
  const [progressValue, setProgressValue] = useState(0); // progress 값 (state로 관리)
  
  // 애니메이션 진행도 (0 ~ 14, 카드 개수 기준)
  const progress = useMotionValue(0);

  // 후기 이미지 파일명 배열 (14개)
  const reviewImages = [
    "review_5.jpg",
    "review_6.jpg",
    "review_7.jpg",
    "review_8.jpg",
    "review_9.jpg",
    "review_10.jpg",
    "review_11.jpg",
    "review_12.jpg",
    "review_13.jpg",
    "review_14.jpg",
    "review_15.jpg",
    "review_16.jpg",
    "review_17.jpg",
    "review_18.jpg",
  ];

  // 각 카드의 회전 각도와 z-index 설정 (세로로 더 펼침)
  // Y축 오프셋을 크게 늘려서 카드들이 세로로 분산되게 배치
  const cardStyles = [
    { rotate: -8, zIndex: 1, x: -35, y: -70 },
    { rotate: -6, zIndex: 2, x: -28, y: -60 },
    { rotate: -5, zIndex: 3, x: -21, y: -50 },
    { rotate: -3, zIndex: 4, x: -14, y: -40 },
    { rotate: -2, zIndex: 5, x: -7, y: -30 },
    { rotate: -1, zIndex: 6, x: 0, y: -20 },
    { rotate: 0, zIndex: 7, x: 0, y: -10 },
    { rotate: 1, zIndex: 8, x: 0, y: 0 },
    { rotate: 2, zIndex: 9, x: 7, y: 10 },
    { rotate: 3, zIndex: 10, x: 14, y: 20 },
    { rotate: 5, zIndex: 11, x: 21, y: 30 },
    { rotate: 6, zIndex: 12, x: 28, y: 40 },
    { rotate: 8, zIndex: 13, x: 35, y: 50 },
    { rotate: 10, zIndex: 14, x: 42, y: 60 },
  ];

  // progress 값을 state로 동기화
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      setProgressValue(latest);
    });
    return unsubscribe;
  }, [progress]);

  // 카드 transform 계산 함수
  const getCardTransform = (index: number, progressValue: number) => {
    const style = cardStyles[index];
    const startProgress = index;
    const endProgress = index + 1;
    
    // progress 값을 해당 카드의 범위로 정규화
    const normalized = Math.max(0, Math.min(1, (progressValue - startProgress) / (endProgress - startProgress)));
    
    return {
      y: 500 + (style.y - 500) * normalized,
      scale: 0.8 + (1 - 0.8) * normalized,
      rotate: 0 + style.rotate * normalized,
      x: 0 + style.x * normalized,
    };
  };

  // 휠 이벤트 처리 - 카드 하나씩 등장
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    
    const handleWheel = (e: WheelEvent) => {
      if (!isInView) return;
      
      const totalCards = reviewImages.length;
      
      // 아직 등장할 카드가 남았을 때만 스크롤 막기
      if (currentCardIndex < totalCards) {
        e.preventDefault();
        
        // 휠 방향 감지 (쓰로틀링 적용)
        if (wheelTimeout) return;
        
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 100); // 100ms 쓰로틀링
        
        if (e.deltaY > 0 && currentCardIndex < totalCards) {
          // 아래로 스크롤 - 다음 카드 등장
          const nextIndex = currentCardIndex + 1;
          setCurrentCardIndex(nextIndex);
          
          // 스프링 애니메이션으로 progress 업데이트 (완료 대기 없음)
          animate(progress, nextIndex, {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.8
          });
        } else if (e.deltaY < 0 && currentCardIndex > 0) {
          // 위로 스크롤 - 이전 카드 숨김
          const prevIndex = currentCardIndex - 1;
          setCurrentCardIndex(prevIndex);
          
          animate(progress, prevIndex, {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.8
          });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }
    };
  }, [isInView, currentCardIndex, progress, reviewImages.length]);

  // IntersectionObserver로 뷰포트 진입 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { 
        threshold: 0.5,  // 섹션의 50%가 보일 때 시작 (카드 하단이 잘리지 않도록)
        rootMargin: '0px 0px -100px 0px'  // 하단에서 100px 여유 공간
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  // 자동 카드 표시 효과 (모든 카드 등장 후)
  useEffect(() => {
    const allCardsVisible = currentCardIndex >= reviewImages.length;
    
    if (!allCardsVisible || isUserInteracting) {
      return;
    }

    let interval: NodeJS.Timeout | null = null;

    // 랜덤 카드 선택 함수 (마지막 카드 제외)
    const showRandomCard = () => {
      // 0 ~ 12 범위에서 선택 (13번 인덱스 제외)
      const randomIndex = Math.floor(Math.random() * (reviewImages.length - 1));
      setAutoShowCardIndex(randomIndex);
    };

    // 초기 지연 후 시작
    const initialDelay = setTimeout(() => {
      showRandomCard();
      
      // 1.3초마다 다음 카드로 전환 (내려가면서 동시에 올라옴)
      interval = setInterval(showRandomCard, 1300);
    }, 1000);

    return () => {
      clearTimeout(initialDelay);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentCardIndex, isUserInteracting, reviewImages.length]);

  return (
    <section ref={containerRef} className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 카피 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            수많은 환자분들이 증명한
            <br className="sm:hidden" />
            <span className="text-blue-600"> 리셋만의 코 재수술</span>
          </h2>
        </motion.div>

        {/* 겹쳐진 카드들 - overflow hidden으로 마스크 적용 */}
        <div className="relative flex items-center justify-center h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden z-10">
          {reviewImages.map((fileName, index) => {
            const style = cardStyles[index];
            const transforms = getCardTransform(index, progressValue);
            
            // 모든 카드가 등장 완료되었는지 확인
            const allCardsVisible = currentCardIndex >= reviewImages.length;
            // hover되었거나 자동 표시 중인 카드
            const isHovered = (hoveredCardIndex === index || autoShowCardIndex === index) && allCardsVisible;
            
            return (
              <motion.div
                key={fileName}
                className={`absolute ${allCardsVisible ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ 
                  zIndex: style.zIndex,  // z-index 순서 유지 (변경 없음)
                  y: transforms.y,
                  scale: transforms.scale,
                  rotate: transforms.rotate,
                  x: transforms.x
                }}
                onMouseEnter={() => {
                  if (allCardsVisible) {
                    setIsUserInteracting(true);
                    setHoveredCardIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  if (allCardsVisible) {
                    setHoveredCardIndex(null);
                    // 잠시 후 자동 효과 재개
                    setTimeout(() => setIsUserInteracting(false), 500);
                  }
                }}
                onClick={() => {
                  // 모바일 터치 대응 - 모든 카드 등장 후에만 작동
                  if (allCardsVisible) {
                    setIsUserInteracting(true);
                    const newIndex = hoveredCardIndex === index ? null : index;
                    setHoveredCardIndex(newIndex);
                    
                    // 클릭으로 닫을 때 자동 효과 재개
                    if (newIndex === null) {
                      setTimeout(() => setIsUserInteracting(false), 500);
                    }
                  }
                }}
                animate={
                  // 모든 카드 등장 전에는 animate 사용 안 함 (style prop의 cardY 사용)
                  !allCardsVisible ? {} :
                  // hover된 카드만 animate
                  isHovered ? {
                    y: style.y - 180,
                    scale: 1.08
                  } : {
                    y: style.y,
                    scale: 1
                  }
                }
                transition={
                  // hover 중이거나 자동 표시 중일 때: 스프링 (올라갈 때)
                  (hoveredCardIndex === index || autoShowCardIndex === index) ? {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  } : {
                    // 내려갈 때: 0.3초
                    type: "tween",
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }
              >
                {/* 카드 */}
                <div className={`bg-white rounded-2xl shadow-2xl p-2 sm:p-3 transition-shadow duration-300 ${
                  isHovered ? 'shadow-blue-500/50' : ''
                }`}>
                  <div className="relative w-[240px] h-[170px] sm:w-[320px] sm:h-[220px] lg:w-[380px] lg:h-[260px] overflow-hidden rounded-xl">
                    <Image
                      src={getLandingImageUrl(fileName)}
                      alt={`환자 후기 ${index + 1}`}
                      fill
                      className="object-contain bg-white"
                      sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 380px"
                    />
                  </div>
                  
                  {/* 카드 하단 장식 라벨 */}
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-700">
                        실제 후기
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 하단 설명 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mt-2 sm:mt-4 relative z-20"
        >
          <p className="text-sm sm:text-base text-gray-600">
            강남언니 평균 평점 10.0점!<br />
            <span className="font-semibold text-gray-900">실제 환자분들의 생생한 후기입니다</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

