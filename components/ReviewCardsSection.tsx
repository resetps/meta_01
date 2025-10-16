"use client";

import { motion } from "framer-motion";
import { getLandingImageUrl } from "@/lib/supabase/storage";
import Image from "next/image";

/**
 * ReviewCardsSection 컴포넌트
 * 
 * 실제 환자 후기 이미지 4개를 카드 형태로 겹쳐서 표시하는 섹션
 * - 각 카드는 살짝 회전되어 팬(부채) 모양으로 배치됨
 * - 카피 텍스트가 카드들 위에 표시됨
 * - 스크롤 애니메이션으로 순차적으로 나타남
 */
export default function ReviewCardsSection() {
  // 후기 이미지 파일명 배열
  const reviewImages = [
    "review_1.jpg",
    "review_2.jpg",
    "review_3.jpg",
    "review_4.jpg",
  ];

  // 각 카드의 회전 각도와 z-index 설정 (겹쳐지는 효과)
  // X축과 Y축 오프셋을 모두 사용하여 계단식 배치로 각 카드 내용이 보이도록 함
  // 오프셋을 더 크게 해서 카드 내용이 더 많이 보이도록 조정
  const cardStyles = [
    { rotate: -5, zIndex: 1, x: -90, y: -50 },
    { rotate: -2, zIndex: 2, x: -30, y: -18 },
    { rotate: 2, zIndex: 3, x: 30, y: 18 },
    { rotate: 5, zIndex: 4, x: 90, y: 50 },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 카피 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            수많은 환자분들이 증명한
            <br className="sm:hidden" />
            <span className="text-blue-600"> 리셋만의 코 재수술</span>
          </h2>
        </motion.div>

        {/* 겹쳐진 카드들 */}
        <div className="relative flex items-center justify-center h-[450px] sm:h-[500px] lg:h-[550px]">
          {reviewImages.map((fileName, index) => {
            const style = cardStyles[index];
            
            return (
              <motion.div
                key={fileName}
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: style.rotate,
                  x: style.x,
                  y: style.y
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="absolute"
                style={{ zIndex: style.zIndex }}
              >
                {/* 카드 */}
                <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3 hover:scale-105 transition-transform duration-300">
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-sm sm:text-base text-gray-600">
            강남언니에서 직접 캡처한 <span className="font-semibold text-gray-900">실제 환자분들의 생생한 후기</span>입니다
          </p>
        </motion.div>
      </div>
    </section>
  );
}

