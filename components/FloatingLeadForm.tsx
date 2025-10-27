"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLeadStore } from "@/store/useLeadStore";
import { submitLead, submitLeadWithUTM } from "@/app/actions/submit-lead";
import { useState, useEffect } from "react";
import { revisionTypes } from "@/data/revisionTypes";
import { useRouter } from "next/navigation";

// Zod 스키마 정의
const floatingFormSchema = z.object({
  name: z.string().min(2, "이름 2자 이상"),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, "휴대폰 번호 형식 오류"),
  consent: z.boolean().refine((val) => val === true, {
    message: "개인정보 수집 및 이용에 동의해주세요",
  }),
});

type FormData = z.infer<typeof floatingFormSchema>;

export default function FloatingLeadForm() {
  const { selectedTypeId, setFormSubmitted, utmParams } = useLeadStore();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(floatingFormSchema),
    defaultValues: {
      consent: true, // 기본값으로 체크됨
    },
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

    // LeadForm 섹션 찾기 (항상 감지)
    const targetElement = document.querySelector('section[class*="from-white to-blue-50"]');
    
    if (targetElement) {
      observer.observe(targetElement);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");

      // 선택된 유형의 제목 찾기 (없으면 '선택안함')
      let revisionTypeId = selectedTypeId || 0; // 0은 선택안함을 의미
      let revisionTypeTitle = "선택안함";
      
      if (selectedTypeId) {
        const selectedType = revisionTypes.find(type => type.id === selectedTypeId);
        if (selectedType) {
          revisionTypeTitle = selectedType.title;
        }
      }

      // Server Action 호출 (UTM 파라미터가 있으면 submitLeadWithUTM 사용)
      const hasUTM = Object.values(utmParams).some((value) => value !== undefined && value !== "");
      
      const result = hasUTM
        ? await submitLeadWithUTM(
            {
              name: data.name,
              phone: data.phone,
              revisionTypeId: revisionTypeId,
              revisionTypeTitle: revisionTypeTitle,
            },
            utmParams
          )
        : await submitLead({
            name: data.name,
            phone: data.phone,
            revisionTypeId: revisionTypeId,
            revisionTypeTitle: revisionTypeTitle,
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
              {/* Pulse + Shadow 효과 */}
              <motion.button
                onClick={() => setIsExpanded(true)}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                    "0 20px 50px -10px rgba(0, 0, 0, 0.4), 0 15px 20px -8px rgba(0, 0, 0, 0.25)",
                    "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all flex items-center gap-3"
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
              <div className="max-w-7xl mx-auto px-4 py-1 sm:py-2">
                {/* 닫기 버튼 */}
                <div className="flex justify-end mb-0">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* 타이틀 */}
                  <div className="text-center mb-2">
                    <p className="text-2xl sm:text-3xl font-bold text-white">코 재수술은 리셋성형외과!</p>
                  </div>

                  {/* 첫 번째 행: 입력 필드와 버튼 */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    {/* 이름 입력 */}
                    <div className="w-full sm:w-auto sm:max-w-[180px]">
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
                    <div className="w-full sm:w-auto sm:max-w-[200px]">
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
                  </div>

                  {/* 두 번째 행: 개인정보 동의 */}
                  <div className="flex items-start justify-center gap-2">
                    <input
                      {...register("consent")}
                      type="checkbox"
                      id="floating-consent"
                      className="mt-0.5 w-4 h-4 text-white border-white/30 rounded focus:ring-white bg-white/20"
                    />
                    <label htmlFor="floating-consent" className="text-xs text-white/90 leading-tight">
                      <span className="font-semibold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPrivacyModal(true);
                        }}
                        className="block mt-0.5 text-[10px] text-white underline hover:text-white/80"
                      >
                        개인정보 처리방침 [보기]
                      </button>
                    </label>
                  </div>

                  {/* 에러 메시지 */}
                  {(errorMessage || errors.consent) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-yellow-200 text-center"
                    >
                      ⚠️ {errorMessage || errors.consent?.message}
                    </motion.p>
                  )}
                </form>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 개인정보 처리방침 모달 */}
      {showPrivacyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowPrivacyModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">개인정보 처리방침</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 내용 (스크롤 가능) */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-6 text-sm text-gray-700">
                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">1. 개인정보의 수집 및 이용 목적</h4>
                  <p className="leading-relaxed">
                    리셋성형외과는 상담 신청 및 예약 관리, 고객 응대 및 상담 서비스 제공을 목적으로 개인정보를 수집합니다.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">2. 수집하는 개인정보의 항목</h4>
                  <p className="leading-relaxed mb-2">
                    <span className="font-semibold">필수항목:</span> 이름, 휴대폰번호, 상담 유형
                  </p>
                  <p className="leading-relaxed text-gray-600 text-xs">
                    ※ 서비스 이용 과정에서 IP주소, 접속 로그, 쿠키, 접속 기기정보 등이 자동으로 수집될 수 있습니다.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">3. 개인정보의 보유 및 이용기간</h4>
                  <p className="leading-relaxed">
                    상담 완료 후 3개월까지 보관하며, 보유기간 경과 시 지체없이 파기합니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">4. 개인정보의 파기절차 및 방법</h4>
                  <p className="leading-relaxed mb-2">
                    <span className="font-semibold">파기절차:</span> 보유기간이 경과한 개인정보는 종료일로부터 지체없이 파기합니다.
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold">파기방법:</span> 전자적 파일은 복구 불가능한 방법으로 영구 삭제하며, 종이 문서는 분쇄기로 분쇄하거나 소각합니다.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">5. 개인정보 제공 및 공유</h4>
                  <p className="leading-relaxed">
                    회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령에 의하거나 이용자의 동의가 있는 경우는 예외로 합니다.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">6. 이용자의 권리</h4>
                  <p className="leading-relaxed">
                    이용자는 언제든지 본인의 개인정보를 조회하거나 수정, 삭제, 처리정지를 요구할 수 있습니다. 
                    개인정보 보호 관련 문의사항은 고객센터(02-6246-1113)로 연락주시기 바랍니다.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">7. 개인정보 보호책임자</h4>
                  <p className="leading-relaxed">
                    리셋성형외과는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 위하여 개인정보 보호책임자를 지정하고 있습니다.
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs">▶ 개인정보 보호책임자</p>
                    <p className="text-xs">- 연락처: 02-6246-1113</p>
                    <p className="text-xs">- 이메일: info@resetps.com</p>
                  </div>
                </section>

                <section>
                  <h4 className="font-bold text-base text-gray-900 mb-2">8. 개인정보 처리방침 변경</h4>
                  <p className="leading-relaxed">
                    본 개인정보 처리방침은 법령 및 정책 변경에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해 공지합니다.
                  </p>
                </section>

                <section className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    시행일자: 2024년 1월 1일
                  </p>
                </section>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

