"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLeadStore } from "@/store/useLeadStore";
import { submitLead } from "@/app/actions/submit-lead";
import { useState } from "react";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");

      if (!selectedTypeId) {
        setErrorMessage("유형을 먼저 선택해주세요.");
        return;
      }

      // Server Action 호출
      const result = await submitLead({
        name: data.name,
        phone: data.phone,
        revisionTypeId: selectedTypeId,
      });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      // 성공 처리
      setFormSubmitted(true);
      reset();
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
    <AnimatePresence mode="wait">
      {!isFormSubmitted ? (
        <motion.section
          key="form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
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
                  전문의가 직접 상담해드립니다
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
                      <span className="block mt-1 text-xs text-gray-500">
                        수집 목적: 상담 예약 및 연락 | 보관 기간: 상담 완료 후 3개월
                      </span>
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
            </motion.div>
          </div>
        </motion.section>
      ) : (
        // 제출 완료 화면
        <motion.section
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-white to-blue-50"
        >
          <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
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

            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              상담 신청이 완료되었습니다!
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              빠른 시일 내에 연락드리겠습니다
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://pf.kakao.com/_your_channel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오톡 상담
              </a>
              <a
                href="tel:02-1234-5678"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화 상담
              </a>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

