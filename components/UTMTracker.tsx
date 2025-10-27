"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLeadStore } from "@/store/useLeadStore";

/**
 * URL에서 UTM 파라미터를 추출하여 스토어에 저장하는 컴포넌트
 * 페이지 로드 시 자동으로 실행됨
 */
export default function UTMTracker() {
  const searchParams = useSearchParams();
  const { setUTMParams } = useLeadStore();

  useEffect(() => {
    // URL에서 UTM 파라미터 추출
    const utmParams = {
      source: searchParams.get("utm_source") || undefined,
      medium: searchParams.get("utm_medium") || undefined,
      campaign: searchParams.get("utm_campaign") || undefined,
      term: searchParams.get("utm_term") || undefined,
      content: searchParams.get("utm_content") || undefined,
    };

    // 최소 하나의 UTM 파라미터라도 있으면 스토어에 저장
    if (Object.values(utmParams).some((value) => value !== undefined)) {
      setUTMParams(utmParams);
      
      // 디버깅용 로그 (프로덕션에서는 제거 가능)
      console.log("UTM Parameters detected:", utmParams);
    }
  }, [searchParams, setUTMParams]);

  // UI를 렌더링하지 않음 (추적용 컴포넌트)
  return null;
}

