"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLeadStore } from "@/store/useLeadStore";
import { revisionTypes } from "@/data/revisionTypes";

export default function SelectedTypeInfo() {
  const { selectedTypeId } = useLeadStore();
  const selectedType = revisionTypes.find((type) => type.id === selectedTypeId);

  return (
    <AnimatePresence mode="wait">
      {selectedType && (
        <motion.section
          key={selectedType.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-blue-50 to-white overflow-hidden"
        >
          <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* 선택된 유형 제목 */}
              <div className="mb-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {selectedType.title}
                </h3>
                <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
              </div>

              {/* 발생 원인 */}
              <div className="mb-8 bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      발생 원인
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedType.cause}
                    </p>
                  </div>
                </div>
              </div>

              {/* 수술 방법 */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      재수술 방법
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedType.method}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}


