"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { revisionTypes } from "@/data/revisionTypes";
import { useLeadStore } from "@/store/useLeadStore";
import { useState, useEffect } from "react";

// 유형별 사용자 메시지
const userMessages: Record<number, string> = {
  1: "코끝이 들려보여서 고민이에요 원장님 ㅠ",
  2: "코끝이 떨어져서 단차가 생기고 라인이 이상해졌어요.",
  3: "보형물이 휘었는데 왜 이런걸까요??ㅠ",
  4: "보형물이 비치는데 재수술하면 괜찮아질까요?",
  5: "보형물이 막 움직여요 원장님 도와주세요!",
  6: "코끝이 찝혀 보여서 수술한 티가 너무 나요 ㅠ",
  7: "콧구멍이 비대칭인데 이것도 고쳐주시나요?",
  8: "복코 교정했는데 아직도 뚱뚱해보여요 ㅠ",
  9: "매부리가 아직 남아 있는데 없앨 수 있을까요?",
};

// 유형별 수술 전 셀카 메시지
const beforeSelfieMessages: Record<number, string> = {
  1: "나도 코끝이 들려보여서 재수술했어ㅠ 이게 재수술 하기 전 모습이야.",
  2: "나도 코끝이 떨어져서 재수술했어ㅠ 이게 재수술 전 셀카야.",
  3: "나도 보형물이 휘어서 재수술했어ㅠ 이게 재수술 하기 전 사진이야.",
  4: "나도 보형물이 비쳐서 재수술했어ㅠ 이게 재수술 전이야.",
  5: "나도 보형물이 움직이는 그 느낌 알아ㅠ 나도 재수술 전엔 그랬어.",
  6: "나도 코끝이 찝혀보여서 재수술했어ㅠ 이게 재수술 전 사진이야.",
  8: "나도 복코가 남아있어서 재수술했어ㅠ 재수술 전 사진인데 아직 복코맞지?",
  9: "나도 매부리가 남아있어서 재수술했어ㅠ 이게 재수술 전 사진이야",
};

// 유형별 수술 후 셀카 메시지
const afterSelfieMessages: Record<number, string> = {
  1: "이건 재수술한 지 2개월차 사진! 완전 달라졌지?",
  2: "이건 재수술한 지 3개월차 사진! 완전 달라졌지?",
  3: "이건 재수술한 지 1개월차 사진! 완전 달라졌지?",
  4: "이건 재수술한 지 2주차 사진! 완전 달라졌지?",
  5: "이건 재수술한 지 1개월차 사진! 완전 달라졌지?",
  6: "이건 재수술한 지 2주차 사진! 완전 달라졌지?",
  8: "이건 재수술한 지 2주차 사진! 완전 달라졌지?",
  9: "이건 재수술한 지 2주차 사진! 완전 달라졌지?",
};

// 질문 목록
const questionButtons = [
  { id: 1, text: "코 재수술하면 얼마나 더 높일 수 있나요?" },
  { id: 2, text: "코끝만 재수술 할 수 있나요?" },
  { id: 3, text: "꼭 자가늑연골을 써야 하나요?" },
  { id: 4, text: "재수술은 회복기간이 더 오래걸리나요?" },
  { id: 5, text: "코 재수술은 언제부터 가능한가요?" },
  { id: 6, text: "재수술인데 또 같은 문제가 생기진 않을까요?" },
];

// 질문별 유튜브 영상 ID 매핑
const questionVideoIds: Record<number, string> = {
  1: "2atnHXuTfYI", // 코 재수술하면 얼마나 더 높일 수 있나요?
  2: "hu3t42-nRwk", // 코끝만 재수술 할 수 있나요?
  3: "6qVm5NcxVaA", // 꼭 자가늑연골을 써야 하나요?
  4: "Ij5HTQ1CJHM", // 재수술은 회복기간이 더 오래걸리나요?
  5: "H9Cjm1KQBjM", // 코 재수술은 언제부터 가능한가요?
  6: "k2bEePrlI1M", // 재수술인데 또 같은 문제가 생기진 않을까요?
};

export default function RevisionTypeGrid() {
  const { selectedTypeId, setSelectedTypeId } = useLeadStore();
  const [showAll, setShowAll] = useState(true);
  const [showSelfiesBefore, setShowSelfiesBefore] = useState(false);
  const [showSelfiesAfter, setShowSelfiesAfter] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  
  // 타이핑 인디케이터 및 메시지 표시 상태
  const [showBeforeSelfieTyping, setShowBeforeSelfieTyping] = useState(false);
  const [showBeforeSelfieMessage, setShowBeforeSelfieMessage] = useState(false);
  const [showAfterSelfieTyping, setShowAfterSelfieTyping] = useState(false);
  const [showAfterSelfieMessage, setShowAfterSelfieMessage] = useState(false);

  // 선택된 유형 (useEffect들보다 먼저 정의)
  const selectedType = revisionTypes.find(type => type.id === selectedTypeId);

  // 선택된 유형만 보여줄지, 전체를 보여줄지 결정
  const displayedTypes = showAll 
    ? revisionTypes 
    : revisionTypes.filter(type => type.id === selectedTypeId);

  // 유형 선택 시 showAll을 false로 변경
  const handleTypeSelect = (id: number) => {
    setSelectedTypeId(id);
    setShowAll(false);
  };

  // 다시 전체 보기
  const handleShowAll = () => {
    setShowAll(true);
    setShowSelfiesBefore(false);
    setShowSelfiesAfter(false);
    setShowBeforeAfter(false);
    setShowQuestions(false);
    setSelectedQuestion(null);
    setShowBeforeSelfieTyping(false);
    setShowBeforeSelfieMessage(false);
    setShowAfterSelfieTyping(false);
    setShowAfterSelfieMessage(false);
  };
  
  // 전후사진 보기 (먼저 셀카부터 시작, 셀카 없으면 바로 전후사진)
  const handleShowBeforeAfter = () => {
    // 셀카 이미지가 없으면 바로 전후사진 및 질문 표시
    if (!selectedType?.selfieBefore || !selectedType?.selfieAfter) {
      setShowBeforeAfter(true);
      setTimeout(() => {
        setShowQuestions(true);
      }, 500);
    } else {
      // 셀카 이미지가 있으면 기존 플로우대로
      setShowSelfiesBefore(true);
    }
  };

  // 질문 버튼 클릭
  const handleQuestionClick = (questionId: number) => {
    setSelectedQuestion(questionId);
  };

  // 수술 전 셀카: 타이핑 인디케이터 표시
  useEffect(() => {
    if (showSelfiesBefore && selectedType?.selfieBefore) {
      setShowBeforeSelfieTyping(true);
      const timer = setTimeout(() => {
        setShowBeforeSelfieTyping(false);
        setShowBeforeSelfieMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSelfiesBefore, selectedType]);

  // 수술 전 셀카 메시지 표시 후 수술 후 셀카로 전환
  useEffect(() => {
    if (showBeforeSelfieMessage && selectedType?.selfieAfter) {
      const timer = setTimeout(() => {
        setShowSelfiesAfter(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showBeforeSelfieMessage, selectedType]);

  // 수술 후 셀카: 타이핑 인디케이터 표시
  useEffect(() => {
    if (showSelfiesAfter && selectedType?.selfieAfter) {
      setShowAfterSelfieTyping(true);
      const timer = setTimeout(() => {
        setShowAfterSelfieTyping(false);
        setShowAfterSelfieMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSelfiesAfter, selectedType]);

  // 수술 후 셀카 메시지 표시 후 전후사진 표시
  useEffect(() => {
    if (showAfterSelfieMessage) {
      const timer = setTimeout(() => {
        setShowBeforeAfter(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAfterSelfieMessage]);

  // 전후사진 표시 후 0.5초 뒤에 질문 표시
  useEffect(() => {
    if (showBeforeAfter) {
      const timer = setTimeout(() => {
        setShowQuestions(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showBeforeAfter]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            다음 중 어떤 재수술 유형에<br className="sm:hidden" /> 해당되시나요?
          </h2>
          <motion.p
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl text-blue-600 font-medium"
          >
            해당하는 유형을 선택해주세요!
          </motion.p>
        </motion.div>

        {/* 채팅창 UI (선택된 유형이 있고 showAll이 false일 때) */}
        {!showAll && selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            {/* 다시 보기 버튼 */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={handleShowAll}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                다른 유형 더보기
              </button>
            </div>

            {/* 메신저 스타일 채팅창 */}
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-6 shadow-lg">
              {/* 사용자 메시지 (오른쪽) */}
              <div className="flex items-start gap-3 justify-end mb-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-[70%]"
                >
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                    <p className="text-sm">{userMessages[selectedType.id]}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">방금 전</p>
                </motion.div>
                
                {/* 사용자 프로필 (작은 이미지) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-shrink-0"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 bg-gray-100 relative">
                    {selectedType.thumb ? (
                      <Image
                        src={selectedType.thumb}
                        alt="프로필"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100">
                        <span className="text-blue-600 font-bold text-xs">
                          {selectedType.id}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* 원장님 답변 1 - 원인 (왼쪽) */}
              <div className="flex items-start gap-3 mb-4">
                {/* 원장님 프로필 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex-shrink-0"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/landing-images/profile.jpg`}
                        alt="원장님"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span>원</span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="max-w-[70%]"
                >
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      {selectedType.title}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-600">원인:</span>{" "}
                      {selectedType.cause}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">방금 전</p>
                </motion.div>
              </div>

              {/* 원장님 답변 2 - 해결방법 (왼쪽) */}
              <div className="flex items-start gap-3">
                {/* 원장님 프로필 (투명, 공간만 차지) */}
                <div className="flex-shrink-0 w-12 h-12 opacity-0">
                  <div className="w-12 h-12 rounded-full"></div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }} // 원인 메시지 후 0.5초 간격
                  className="max-w-[70%]"
                >
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-green-600">해결방법:</span>{" "}
                      {selectedType.method}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">방금 전</p>
                </motion.div>
              </div>

              {/* 전후사진 보기 버튼 (beforeAfter 있는 경우만) */}
              {selectedType.beforeAfter && !showSelfiesBefore && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.4 }}
                  className="mt-6 flex justify-center"
                >
                  <button
                    onClick={handleShowBeforeAfter}
                    className="pl-[26px] pr-6 py-[14px] bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-3"
                  >
                    {/* 프로필 이미지 - 버튼 전체 높이에 맞춰 왼쪽 끝에 배치 */}
                    <div className="w-12 h-12 -my-[14px] -ml-[24px] rounded-full overflow-hidden border-2 border-white relative flex-shrink-0 shadow-md">
                      {selectedType.profileImage ? (
                        <Image
                          src={selectedType.profileImage}
                          alt="프로필"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-white flex items-center justify-center text-purple-600 text-2xl">
                          💁
                        </div>
                      )}
                    </div>
                    전후사진을 보시겠어요?
                  </button>
                </motion.div>
              )}

              {/* 수술 전 셀카: 타이핑 인디케이터 */}
              {showBeforeSelfieTyping && selectedType.selfieBefore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <div className="flex items-start gap-3">
                    {/* 셀카 당사자 프로필 */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
                        {selectedType.profileImage ? (
                          <Image
                            src={selectedType.profileImage}
                            alt="셀카 당사자"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>💁</span>
                        )}
                      </div>
                    </div>

                    {/* 타이핑 인디케이터 */}
                    <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-md border border-gray-200">
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 수술 전 셀카 메시지 및 이미지 */}
              {showBeforeSelfieMessage && selectedType.selfieBefore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  {/* 셀카 당사자 메시지 */}
                  <div className="flex items-start gap-3 mb-4">
                    {/* 셀카 당사자 프로필 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
                        {selectedType.profileImage ? (
                          <Image
                            src={selectedType.profileImage}
                            alt="셀카 당사자"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>💁</span>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-[70%]"
                    >
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200">
                        <p className="text-sm">{beforeSelfieMessages[selectedType.id] || "내 셀카를 보여줄게~ 이게 수술전 모습이야"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">방금 전</p>
                    </motion.div>
                  </div>

                  {/* 수술 전 셀카 이미지 */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 opacity-0"></div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="max-w-[70%]"
                    >
                      <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-200">
                        <div className="relative w-full">
                          <img
                            src={selectedType.selfieBefore}
                            alt="수술 전 셀카"
                            className="w-full h-auto rounded-lg"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">방금 전</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* 수술 후 셀카: 타이핑 인디케이터 */}
              {showAfterSelfieTyping && selectedType.selfieAfter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <div className="flex items-start gap-3">
                    {/* 셀카 당사자 프로필 */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
                        {selectedType.profileImage ? (
                          <Image
                            src={selectedType.profileImage}
                            alt="셀카 당사자"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>💁</span>
                        )}
                      </div>
                    </div>

                    {/* 타이핑 인디케이터 */}
                    <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-md border border-gray-200">
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 수술 후 셀카 메시지 및 이미지 */}
              {showAfterSelfieMessage && selectedType.selfieAfter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  {/* 셀카 당사자 메시지 */}
                  <div className="flex items-start gap-3 mb-4">
                    {/* 셀카 당사자 프로필 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
                        {selectedType.profileImage ? (
                          <Image
                            src={selectedType.profileImage}
                            alt="셀카 당사자"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>💁</span>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-[70%]"
                    >
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200">
                        <p className="text-sm">{afterSelfieMessages[selectedType.id] || "그리고 이게 수술 후 2주차 사진이야"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">방금 전</p>
                    </motion.div>
                  </div>

                  {/* 수술 후 셀카 이미지 1장 */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 opacity-0"></div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="max-w-[70%]"
                    >
                      <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-200">
                        <div className="relative w-full">
                          <img
                            src={selectedType.selfieAfter}
                            alt="수술 후 셀카"
                            className="w-full h-auto rounded-lg"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">방금 전</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* 전후사진 표시 (클릭 후) */}
              {selectedType.beforeAfter && showBeforeAfter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  {/* 원장님 프로필 없이 이미지만 */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 opacity-0"></div>
                    
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          실제 수술 전후 사진
                        </p>
                        <div className="relative w-full">
                          <img
                            src={selectedType.beforeAfter}
                            alt="전후 비교"
                            className="w-full h-auto rounded-lg"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          ※ 개인차가 있을 수 있으며, 실제 결과는 개인의 상태에 따라 다를 수 있습니다.
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">방금 전</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 질문 메시지 (오른쪽) - 전후사진 0.5초 후 */}
              {showBeforeAfter && showQuestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <div className="flex items-start gap-3 justify-end">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-[70%]"
                    >
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                        <p className="text-sm">원장님 궁금한 게 있어요~!</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">방금 전</p>
                    </motion.div>
                    
                    {/* 사용자 프로필 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 bg-gray-100 relative">
                        {selectedType.thumb ? (
                          <Image
                            src={selectedType.thumb}
                            alt="프로필"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100">
                            <span className="text-blue-600 font-bold text-xs">
                              {selectedType.id}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* 유튜브 영상 답변 (원장님 측) */}
              <AnimatePresence mode="wait">
                {showBeforeAfter && selectedQuestion && (
                  <motion.div
                    key={selectedQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6"
                  >
                    <div className="flex items-start gap-3">
                      {/* 원장님 프로필 */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white relative">
                          {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/landing-images/profile.jpg`}
                              alt="원장님"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <span>원</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 mb-3">
                            {questionButtons.find(q => q.id === selectedQuestion)?.text}에 대한 답변
                          </p>
                          
                          {/* 유튜브 쇼츠 임베드 */}
                          <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                            <iframe
                              key={selectedQuestion}
                              className="absolute top-0 left-0 w-full h-full rounded-lg"
                              src={`https://www.youtube.com/embed/${selectedQuestion ? questionVideoIds[selectedQuestion] : questionVideoIds[1]}`}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-3">
                            💡 자세한 내용은 영상을 참고해주세요
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">방금 전</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 질문 버튼들 (선택되지 않은 것만 표시) */}
              <AnimatePresence mode="wait">
                {showBeforeAfter && showQuestions && (
                  <motion.div
                    key={`questions-${selectedQuestion || 'all'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: selectedQuestion ? 0.3 : 0.4, duration: 0.5 }}
                    className="mt-6 space-y-3"
                  >
                    {questionButtons
                      .filter(question => question.id !== selectedQuestion)
                      .map((question, index) => (
                        <motion.button
                          key={question.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (selectedQuestion ? 0.4 : 0.5) + index * 0.1 }}
                          onClick={() => handleQuestionClick(question.id)}
                          className="w-full bg-white border-2 border-blue-200 text-gray-800 rounded-xl px-4 py-3 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md text-sm text-left font-medium"
                        >
                          {question.text}
                        </motion.button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 하단 안내 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: selectedQuestion ? 0.5 : (showBeforeAfter ? 0.5 : 2.0) }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-500">
                  💬 아래에서 무료 상담을 신청하실 수 있습니다
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 그리드 (전체 보기일 때만) */}
        {showAll && (
          <AnimatePresence mode="popLayout">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
            >
              {displayedTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl border sm:border-2 transition-all duration-300 ${
                    selectedTypeId === type.id
                      ? "border-blue-600 shadow-xl shadow-blue-100"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                  }`}
                >
                  <div className="aspect-[4/3] relative bg-gray-100">
                    {type.thumb ? (
                      <Image
                        src={type.thumb}
                        alt={type.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-4 bg-white">
                    <h3 className={`text-xs sm:text-base font-semibold text-left transition-colors ${
                      selectedTypeId === type.id ? "text-blue-600" : "text-gray-900"
                    }`}>
                      {type.title}
                    </h3>
                  </div>

                  {selectedTypeId === type.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 border-2 sm:border-4 border-blue-600 rounded-xl sm:rounded-2xl pointer-events-none"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
