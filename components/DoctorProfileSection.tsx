"use client";

import { motion } from "framer-motion";
import { getLandingImageUrl } from "@/lib/supabase/storage";
import Image from "next/image";
import LazyImage from "@/components/LazyImage";

/**
 * DoctorProfileSection 컴포넌트
 * 
 * 원장님 프로필과 함께 신뢰감을 주는 섹션
 * - 메인 카피: 무료상담 유도 메시지
 * - 원장님 이미지 카드
 * - 서브 카피: 전문성과 신중함 강조
 */
export default function DoctorProfileSection() {
  return (
    <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 메인 카피 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            <span className="text-blue-600">무료 상담 신청</span>하고
            <br />
            내게 맞는 최적의 수술방법 확인해보세요
          </h2>
        </motion.div>

        {/* 원장님 프로필 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative grid md:grid-cols-2 gap-8 p-6 sm:p-10 lg:p-12">
              {/* 왼쪽: 원장님 이미지 */}
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative w-full max-w-[300px] sm:max-w-[350px]"
                >
                  {/* 이미지 카드 */}
                  <div className="relative bg-white rounded-2xl shadow-xl p-3 sm:p-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                      <LazyImage
                        src={getLandingImageUrl("doctor.jpg")}
                        alt="리셋성형외과 원장님"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 300px, 350px"
                        unoptimized
                      />
                    </div>
                    
                    {/* 의사 배지 */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <svg 
                          className="w-5 h-5 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                          />
                        </svg>
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-sm font-bold">이정환 원장</span>
                          <span className="text-xs font-medium opacity-90">성형외과 전문의</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 오른쪽: 서브 카피 */}
              <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {/* 서브 카피 1 */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        처음보다 더 신중하게,
                        <br />
                        다시 처음처럼!
                      </h3>
                    </div>
                  </div>

                  {/* 서브 카피 2 */}
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 sm:p-5 shadow-md">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-blue-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        16년차 성형외과 전문의가
                      </p>
                      <p className="text-base sm:text-lg text-gray-700">
                        원인부터 다시 설계합니다
                      </p>
                    </div>
                  </div>

                  {/* 추가 신뢰 요소 */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">5,000+</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">코성형<br/>케이스</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">1,500+</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">자가늑<br/>수술</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">1:1</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">맞춤<br/>상담</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 하단 CTA 문구 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 sm:mt-12"
        >
          <p className="text-sm sm:text-base text-gray-600">
            재수술은 <span className="font-semibold text-gray-900">정확한 진단</span>과 <span className="font-semibold text-gray-900">풍부한 경험</span>이 필요합니다
          </p>
        </motion.div>
      </div>
    </section>
  );
}

