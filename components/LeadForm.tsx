"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLeadStore } from "@/store/useLeadStore";
import { submitLead, submitLeadWithUTM } from "@/app/actions/submit-lead";
import { useState } from "react";
import { revisionTypes } from "@/data/revisionTypes";
import { useRouter } from "next/navigation";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

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
  const { selectedTypeId, setFormSubmitted, isFormSubmitted, utmParams, setSubmittedName } = useLeadStore();
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
      setSubmittedName(data.name); // 이름 저장
      reset();
      router.push('/thankyou');
    } catch (error) {
      console.error("제출 실패:", error);
      setErrorMessage("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 항상 렌더링 (유형 선택 선택 사항)
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
                placeholder="'-'없이 숫자만 입력해주세요"
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
                    <PrivacyPolicyContent />
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

