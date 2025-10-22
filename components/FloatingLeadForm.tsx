"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLeadStore } from "@/store/useLeadStore";
import { submitLead } from "@/app/actions/submit-lead";
import { useState, useEffect } from "react";
import { revisionTypes } from "@/data/revisionTypes";
import { useRouter } from "next/navigation";

// Zod 스키마 정의 (consent 제외 - 플로팅 폼은 간소화)
const floatingFormSchema = z.object({
  name: z.string().min(2, "이름 2자 이상"),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, "휴대폰 번호 형식 오류"),
});

type FormData = z.infer<typeof floatingFormSchema>;

export default function FloatingLeadForm() {
  const { selectedTypeId, setFormSubmitted } = useLeadStore();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(floatingFormSchema),
  });

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 기존 LeadForm 위치 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 기존 양식이 화면에 보이면 플로팅 폼 숨김
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // LeadForm 섹션 찾기 (selectedTypeId가 있을 때만)
    const targetElement = document.querySelector('section[class*="from-white to-blue-50"]');
    
    if (targetElement && selectedTypeId) {
      observer.observe(targetElement);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [selectedTypeId]);

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");

      if (!selectedTypeId) {
        setErrorMessage("유형을 먼저 선택해주세요");
        return;
      }

      const selectedType = revisionTypes.find(type => type.id === selectedTypeId);
      if (!selectedType) {
        setErrorMessage("유형 정보를 찾을 수 없습니다");
        return;
      }

      const result = await submitLead({
        name: data.name,
        phone: data.phone,
        revisionTypeId: selectedTypeId,
        revisionTypeTitle: selectedType.title,
      });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      // 성공 처리 - /thankyou 페이지로 리다이렉트
      setFormSubmitted(true);
      reset();
      router.push('/thankyou');
    } catch (error) {
      console.error("제출 실패:", error);
      setErrorMessage("제출 실패. 다시 시도해주세요");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 shadow-2xl"
        >
          {!isExpanded ? (
            // 접힌 상태: 버튼만 표시
            <div className="flex justify-center pb-4 sm:pb-6">
              <motion.button
                onClick={() => setIsExpanded(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
              >
                코 재수술 상담 신청하기
                <svg 
                  className="w-6 h-6 sm:w-7 sm:h-7" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.34-3.83-.93l-.27-.15-2.82.48.48-2.82-.15-.27C4.84 14.68 4.5 13.38 4.5 12c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z"/>
                  <circle cx="9" cy="12" r="1"/>
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="15" cy="12" r="1"/>
                </svg>
              </motion.button>
            </div>
          ) : (
            // 펼쳐진 상태: 폼 표시
            <div className="bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                {/* 닫기 버튼 */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* 안내 텍스트 */}
                  <div className="hidden sm:block text-white flex-shrink-0">
                    <p className="text-sm font-bold">🎁 무료 상담 신청</p>
                  </div>

                  {/* 이름 입력 */}
                  <div className="flex-1 sm:max-w-[180px]">
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="이름"
                      className={`w-full px-3 py-2.5 sm:py-3 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                        errors.name ? "border-red-400 bg-red-50" : "border-white/30 bg-white"
                      }`}
                    />
                  </div>

                  {/* 연락처 입력 */}
                  <div className="flex-1 sm:max-w-[200px]">
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="010-1234-5678"
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setValue("phone", formatted);
                      }}
                      className={`w-full px-3 py-2.5 sm:py-3 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                        errors.phone ? "border-red-400 bg-red-50" : "border-white/30 bg-white"
                      }`}
                    />
                  </div>

                  {/* 제출 버튼 */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-shrink-0 px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all shadow-lg ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-white text-blue-600 hover:bg-gray-100 hover:shadow-xl active:scale-95"
                    }`}
                  >
                    {isSubmitting ? "전송중..." : "상담 신청"}
                  </button>
                </form>

                {/* 에러 메시지 */}
                {errorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-yellow-200 mt-2 text-center"
                  >
                    ⚠️ {errorMessage}
                  </motion.p>
                )}

                {/* 개인정보 동의 안내 */}
                <p className="text-[10px] sm:text-xs text-white/70 text-center mt-2">
                  신청 시 <span className="underline">개인정보 수집 및 이용</span>에 동의한 것으로 간주됩니다
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

