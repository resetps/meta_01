"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  // 버튼 데이터 배열
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

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        {/* 체크 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        {/* 제목 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center"
        >
          상담 신청이 완료되었습니다!
        </motion.h1>

        {/* 설명 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 text-center"
        >
          빠른 시일 내에 연락드리겠습니다
        </motion.p>

        {/* 버튼들 - 세로 정렬 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 mb-8"
        >
          {buttons.map((button, index) => (
            <motion.a
              key={index}
              href={button.href}
              target={button.external ? "_blank" : undefined}
              rel={button.external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-2xl transition-all shadow-md hover:shadow-lg ${
                button.emphasized
                  ? `${button.bgColor} ${button.textColor}`
                  : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-2 border-gray-200"
              }`}
            >
              <span className="text-2xl">{button.emoji}</span>
              <span className="text-base">{button.text}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* 홈으로 돌아가기 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800 font-medium underline"
          >
            ← 홈으로 돌아가기
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}

