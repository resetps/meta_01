"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { useLeadStore } from "@/store/useLeadStore";
import { revisionTypes } from "@/data/revisionTypes";

export default function BeforeAfterSlider() {
  const { selectedTypeId } = useLeadStore();
  const selectedType = revisionTypes.find((type) => type.id === selectedTypeId);

  // beforeAfter 이미지가 없으면 렌더링하지 않음
  if (!selectedType?.beforeAfter) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {selectedType && (
        <motion.section
          key={`before-after-${selectedType.id}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white overflow-hidden"
        >
          <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* 제목 */}
              <div className="mb-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  실제 수술 전후 비교
                </h3>
                <p className="text-gray-600">
                  슬라이더를 좌우로 움직여 변화를 확인해보세요
                </p>
              </div>

              {/* 비교 슬라이더 */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                {selectedType.beforeAfter ? (
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src={selectedType.beforeAfter}
                        alt="수술 전"
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={selectedType.beforeAfter}
                        alt="수술 후"
                      />
                    }
                    position={50}
                    className="aspect-[4/3]"
                  />
                ) : (
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">전후 비교 이미지</p>
                      <p className="text-sm text-gray-400 mt-1">
                        (이미지 업로드 후 표시됩니다)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 안내 문구 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-semibold text-blue-600">※ 주의:</span> 
                  {" "}개인차가 있을 수 있으며, 실제 결과는 개인의 상태에 따라 다를 수 있습니다.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}


