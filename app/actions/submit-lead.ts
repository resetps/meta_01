"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { headers } from "next/headers";

export interface SubmitLeadData {
  name: string;
  phone: string;
  revisionTypeId: number;
  revisionTypeTitle: string; // 재수술 유형 제목 추가
}

export interface SubmitLeadResult {
  success: boolean;
  message: string;
  leadId?: string;
  error?: string;
}

/**
 * 리드 폼 제출을 처리하는 Server Action
 * 
 * @param data - 폼 데이터 (이름, 연락처, 선택한 유형)
 * @returns 제출 결과
 */
export async function submitLead(data: SubmitLeadData): Promise<SubmitLeadResult> {
  try {
    // 데이터 검증
    if (!data.name || data.name.length < 2) {
      return {
        success: false,
        message: "이름은 2자 이상 입력해주세요.",
      };
    }

    if (!data.phone || !/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(data.phone)) {
      return {
        success: false,
        message: "올바른 휴대폰 번호를 입력해주세요.",
      };
    }

    if (!data.revisionTypeId || data.revisionTypeId < 1 || data.revisionTypeId > 9) {
      return {
        success: false,
        message: "유형을 먼저 선택해주세요.",
      };
    }

    if (!data.revisionTypeTitle || data.revisionTypeTitle.length < 2) {
      return {
        success: false,
        message: "유형 제목이 올바르지 않습니다.",
      };
    }

    // 헤더에서 추가 정보 수집
    const headersList = headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const referrer = headersList.get("referer") || undefined;
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : undefined;

    // Supabase에 데이터 저장
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: data.name,
        phone: data.phone,
        revision_type_id: data.revisionTypeTitle, // 제목을 저장
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer: referrer,
        status: "new",
        consent_privacy: true, // 폼에서 동의 체크했음
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      
      // 중복 전화번호 에러 처리 (선택 사항)
      if (error.code === "23505") {
        return {
          success: false,
          message: "이미 상담 신청이 접수된 번호입니다.",
          error: error.message,
        };
      }

      return {
        success: false,
        message: "제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        error: error.message,
      };
    }

    // TODO: 성공 시 추가 작업
    // - 카카오톡 알림 발송
    // - 이메일 알림 발송
    // - CRM 연동
    // - GA4 이벤트 전송

    return {
      success: true,
      message: "상담 신청이 완료되었습니다!",
      leadId: lead.id,
    };
  } catch (error) {
    console.error("Unexpected error in submitLead:", error);
    return {
      success: false,
      message: "예상치 못한 오류가 발생했습니다. 관리자에게 문의해주세요.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * UTM 파라미터를 포함한 리드 제출 (마케팅 트래킹용)
 */
export async function submitLeadWithUTM(
  data: SubmitLeadData,
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }
): Promise<SubmitLeadResult> {
  try {
    const headersList = headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const referrer = headersList.get("referer") || undefined;
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : undefined;

    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: data.name,
        phone: data.phone,
        revision_type_id: data.revisionTypeTitle, // 제목을 저장
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer: referrer,
        utm_source: utmParams?.source,
        utm_medium: utmParams?.medium,
        utm_campaign: utmParams?.campaign,
        utm_term: utmParams?.term,
        utm_content: utmParams?.content,
        status: "new",
        consent_privacy: true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        success: false,
        message: "제출 중 오류가 발생했습니다.",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "상담 신청이 완료되었습니다!",
      leadId: lead.id,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "예상치 못한 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}


