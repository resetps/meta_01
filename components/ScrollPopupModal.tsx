"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useLeadStore } from "@/store/useLeadStore";
import { submitLead, submitLeadWithUTM } from "@/app/actions/submit-lead";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { revisionTypes } from "@/data/revisionTypes";

// Zod 스키마 정의 (LeadForm과 동일)
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

export default function ScrollPopupModal() {
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { selectedTypeId, setFormSubmitted, utmParams } = useLeadStore();
  const router = useRouter();

  const imageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/landing-images/popup1.jpg`
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      consent: true,
    },
  });

  // 스크롤 감지 (30%)
  useEffect(() => {
    // 세션스토리지에서 이미 표시했는지 확인 (브라우저 닫으면 초기화)
    const alreadyShown = sessionStorage.getItem("popup-shown");
    if (alreadyShown === "true") {
      setHasShown(true);
      return;
    }

    const handleScroll = () => {
      if (hasShown) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;

      if (scrollPercentage >= 30) {
        setShowModal(true);
        setHasShown(true);
        sessionStorage.setItem("popup-shown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

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

      // 선택된 유형의 제목 찾기 (LeadForm과 동일한 로직)
      let revisionTypeId = selectedTypeId || 0;
      let revisionTypeTitle = "선택안함";
      
      if (selectedTypeId) {
        const selectedType = revisionTypes.find(type => type.id === selectedTypeId);
        if (selectedType) {
          revisionTypeTitle = selectedType.title;
        }
      }

      // Server Action 호출
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

      // 성공 처리
      setFormSubmitted(true);
      reset();
      setShowModal(false);
      router.push('/thankyou');
    } catch (error) {
      console.error("제출 실패:", error);
      setErrorMessage("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              {/* 상단 이미지 + 텍스트 오버레이 */}
              <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[450px]">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="재수술 상담"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 600px, 700px"
                  />
                )}
                
                {/* 텍스트 오버레이 - 하단 왼쪽 정렬 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-6 sm:px-8 py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-blue-300 font-medium mb-2">
                    재수술이니까 더 꼼꼼하게!
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold leading-tight">
                    재수술 원인을 분석하고<br />
                    내게 맞는 수술 계획을 세워드립니다
                  </h3>
                </div>
              </div>

              {/* 폼 영역 */}
              <div className="p-6 sm:p-8">
                <div className="mb-6 text-center">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    무료 상담 신청하기
                  </h4>
                  <p className="text-sm text-gray-600">
                    이정환 원장 1:1 상담 예약하기
                  </p>
                </div>

                {/* 에러 메시지 */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                {/* 폼 */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* 이름 */}
                  <div>
                    <label
                      htmlFor="popup-name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      id="popup-name"
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
                  <div>
                    <label
                      htmlFor="popup-phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      id="popup-phone"
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
                  <div>
                    <div className="flex items-start">
                      <input
                        {...register("consent")}
                        type="checkbox"
                        id="popup-consent"
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="popup-consent" className="ml-3 text-sm text-gray-700">
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
                  <p className="text-xs text-center text-gray-500">
                    신청 후 24시간 이내에 연락드리겠습니다
                  </p>
                </form>
              </div>
            </div>

            {/* 개인정보 처리방침 모달 */}
            <AnimatePresence>
              {showPrivacyModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

