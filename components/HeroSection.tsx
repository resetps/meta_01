"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const profileImageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/landing-images/top1.gif`
    : "";

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 items-center">
          {/* 왼쪽: 텍스트 영역 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left lg:pl-16 xl:pl-32 z-10"
          >
            {/* RESET 로고/브랜드명 - PC에서만 표시 */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:block mb-4"
            >
              <p className="text-sm sm:text-base text-gray-600 font-medium tracking-wider">
                RESET
              </p>
            </motion.div>

            {/* 메인 타이틀 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 lg:mb-6"
            >
              <span className="text-blue-600">코 재수술,</span>
              <br />
              <span className="text-blue-600">제대로 </span>
              <span className="text-purple-800">RESET!</span>
            </motion.h1>

            {/* 서브 타이틀 - PC에서만 표시 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed"
            >
              <span className="font-semibold">16년 경력</span>의 코 전문 원장이<br />
              <span className="font-semibold">처음부터, 끝까지!</span>
              <br />
              안전하게, 그리고 완성도 높게
            </motion.p>
          </motion.div>

          {/* 오른쪽: 인물 이미지 영역 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-start lg:-ml-12 xl:-ml-20"
          >
            <div className="relative w-11/12 max-w-md mx-auto h-[20rem] sm:h-[24rem] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px] overflow-hidden">
              {/* 이미지만 심플하게 표시 */}
              {profileImageUrl && (
                <Image
                  src={profileImageUrl}
                  alt="코 재수술 전문 원장"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 450px, 500px"
                />
              )}
              
              {/* 서브 타이틀 - 모바일에서만 이미지 위에 오버레이 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-0 left-0 right-0 lg:hidden bg-gradient-to-t from-black/70 via-black/50 to-transparent px-6 py-8"
              >
                <p className="text-sm sm:text-base text-white leading-relaxed text-left">
                  <span className="font-semibold">16년 경력</span>의 코 전문 원장이<br />
                  <span className="font-semibold">처음부터, 끝까지!</span>
                  <br />
                  안전하게, 그리고 완성도 높게
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


