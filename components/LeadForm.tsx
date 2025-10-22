"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLeadStore } from "@/store/useLeadStore";
import { submitLead } from "@/app/actions/submit-lead";
import { useState } from "react";
import { revisionTypes } from "@/data/revisionTypes";
import { useRouter } from "next/navigation";

// Zod 스키마 정의
const leadFormSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해주세요"),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, "올바른 휴대폰 번호를 입력해주세요"),
  consent: z.boolean().refine((val) => val === true, {
    message: "개인정보 수집 및 이용에 동의해주세요",
  }),
});

type FormData = z.infer<typeof leadFormSchema>;

export default function LeadForm() {
  const { selectedTypeId, setFormSubmitted, isFormSubmitted } = useLeadStore();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(leadFormSchema),
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

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");

      if (!selectedTypeId) {
        setErrorMessage("유형을 먼저 선택해주세요.");
        return;
      }

      // 선택된 유형의 제목 찾기
      const selectedType = revisionTypes.find(type => type.id === selectedTypeId);
      if (!selectedType) {
        setErrorMessage("유형 정보를 찾을 수 없습니다.");
        return;
      }

      // Server Action 호출
      const result = await submitLead({
        name: data.name,
        phone: data.phone,
        revisionTypeId: selectedTypeId,
        revisionTypeTitle: selectedType.title, // 제목 전달
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
      setErrorMessage("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 유형이 선택되지 않았으면 렌더링하지 않음
  if (!selectedTypeId) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-b from-white to-blue-50 overflow-hidden"
    >
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* 제목 */}
          <div className="mb-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              무료 상담 신청하기
            </h3>
            <p className="text-gray-600">
              코재수술 전담 실장이 상담해드립니다.
            </p>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* 폼 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
          >
            {/* 이름 */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                placeholder="홍길동"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 연락처 */}
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                placeholder="010-1234-5678"
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setValue("phone", formatted);
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* 개인정보 동의 */}
            <div className="mb-6">
              <div className="flex items-start">
                <input
                  {...register("consent")}
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
                  <span className="font-semibold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyModal(true);
                    }}
                    className="block mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    개인정보 처리방침 [보기]
                  </button>
                </label>
              </div>
              {errors.consent && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  제출 중...
                </span>
              ) : (
                "무료 상담 신청하기"
              )}
            </button>

            {/* 안내 문구 */}
            <p className="mt-4 text-xs text-center text-gray-500">
              신청 후 24시간 이내에 연락드리겠습니다
            </p>
          </form>

          {/* 개인정보 처리방침 모달 */}
          <AnimatePresence>
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
        </motion.div>
      </div>
    </motion.section>
  );
}

