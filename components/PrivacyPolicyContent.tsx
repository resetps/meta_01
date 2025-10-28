export default function PrivacyPolicyContent() {
  return (
    <div className="space-y-6 text-sm text-gray-700">
      <section>
        <h4 className="font-bold text-base text-gray-900 mb-3">
          리셋성형외과의원 개인정보 처리방침
        </h4>
        <p className="leading-relaxed">
          리셋성형외과의원(이하 &ldquo;병원&rdquo;)은 「개인정보 보호법」에 따라 고객의 개인정보를 보호하고, 
          서비스 이용 과정에서 발생하는 개인정보를 안전하게 관리하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>
        <p className="leading-relaxed mt-2">
          본 방침은 메타 광고 랜딩페이지를 통해 수집되는 상담 문의 및 예약 관련 개인정보 처리에 적용됩니다.
        </p>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">1. 개인정보의 수집 및 이용 목적</h4>
        <p className="leading-relaxed mb-2">
          병원은 고객의 개인정보를 다음의 목적에 한하여 수집·이용합니다.
        </p>
        <div className="ml-4 space-y-2">
          <div>
            <p className="font-semibold text-gray-800">상담 및 예약 관리</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>상담 요청 확인, 상담 일정 안내, 예약 확인 및 고객 응대</li>
              <li>시술 관련 정보 제공 및 사후 안내</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-800">마케팅 및 서비스 품질 향상</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>고객 문의 이력 및 반응을 분석하여 맞춤 상담 제공</li>
              <li>광고 효율 분석, 리타겟팅 마케팅(문자·카카오톡 등) 활용</li>
              <li>프로모션, 이벤트, 시술 정보 안내(별도 동의 시에 한함)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-800">법령에 따른 의무 이행</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>소비자 보호 관련 법령에 따른 기록 보존, 분쟁 해결 및 민원 처리</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">2. 수집하는 개인정보 항목</h4>
        <p className="leading-relaxed mb-2">병원은 다음의 개인정보 항목을 수집합니다.</p>
        <ul className="list-disc ml-5 space-y-1">
          <li><span className="font-semibold">필수항목:</span> 이름, 연락처(휴대전화번호)</li>
          <li><span className="font-semibold">선택항목:</span> 관심 시술, 문의 내용(입력 시에 한함)</li>
          <li><span className="font-semibold">자동 수집항목:</span> 광고 식별값, 유입경로(광고매체, 캠페인명 등, Google Tag / Meta Pixel 기반)</li>
        </ul>
        <p className="leading-relaxed mt-2 text-gray-600 text-xs">
          <span className="font-semibold">수집방법:</span> 메타 광고 랜딩페이지의 상담신청 양식 또는 전화문의, 카카오톡 상담 연결 시
        </p>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">3. 개인정보의 보유 및 이용기간</h4>
        <p className="leading-relaxed mb-3">
          수집된 개인정보는 상담 목적이 달성되거나 고객의 삭제 요청 시 지체 없이 파기합니다.
          단, 다음의 경우에는 관련 법령에 따라 일정 기간 보관할 수 있습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">구분</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">보존 근거</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">보존 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">계약 또는 청약철회 관련 기록</td>
                <td className="border border-gray-300 px-3 py-2">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                <td className="border border-gray-300 px-3 py-2">5년</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">대금결제 및 재화 제공 기록</td>
                <td className="border border-gray-300 px-3 py-2">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                <td className="border border-gray-300 px-3 py-2">5년</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">소비자 불만 또는 분쟁처리 기록</td>
                <td className="border border-gray-300 px-3 py-2">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                <td className="border border-gray-300 px-3 py-2">3년</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">표시·광고에 관한 기록</td>
                <td className="border border-gray-300 px-3 py-2">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                <td className="border border-gray-300 px-3 py-2">6개월</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">4. 개인정보의 제3자 제공</h4>
        <p className="leading-relaxed mb-2">
          병원은 고객의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          다만, 다음의 경우는 예외로 합니다.
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>법령에 특별한 규정이 있는 경우</li>
          <li>고객이 사전에 명시적으로 동의한 경우</li>
        </ul>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">5. 개인정보 처리의 위탁</h4>
        <p className="leading-relaxed mb-3">
          병원은 서비스 운영 및 마케팅 업무 효율화를 위하여 다음과 같이 개인정보 처리를 위탁할 수 있습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">수탁자</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">위탁업무 내용</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">보유 및 이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">(주)메타(페이스북), 구글코리아 유한회사</td>
                <td className="border border-gray-300 px-3 py-2">광고 성과 분석, 리타겟팅 광고</td>
                <td className="border border-gray-300 px-3 py-2">위탁 목적 달성 시까지</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">문자 및 알림톡 발송 대행사<br/>(예: ㈜카카오, ㈜NICE평가정보 등)</td>
                <td className="border border-gray-300 px-3 py-2">상담 안내, 예약 확인 문자 발송</td>
                <td className="border border-gray-300 px-3 py-2">위탁 목적 달성 시까지</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">서버 및 데이터 관리 업체</td>
                <td className="border border-gray-300 px-3 py-2">랜딩페이지 서버 관리 및 보안 유지</td>
                <td className="border border-gray-300 px-3 py-2">위탁 목적 달성 시까지</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="leading-relaxed mt-2 text-xs text-gray-600">
          병원은 위탁계약 시 개인정보보호 관련 법령 준수를 위해 기술적·관리적 보호조치를 시행하고 있습니다.
        </p>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">6. 정보주체의 권리 및 행사방법</h4>
        <p className="leading-relaxed mb-2">
          고객은 언제든지 본인의 개인정보에 대해 다음의 권리를 행사할 수 있습니다.
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>개인정보 열람 요구</li>
          <li>오류 정정 및 삭제 요구</li>
          <li>처리정지 요구</li>
        </ul>
        <p className="leading-relaxed mt-2">
          요청은 전화, 이메일 또는 방문을 통해 가능합니다.
          삭제 또는 정정을 요청할 경우, 병원은 확인 절차를 거쳐 신속히 처리하며, 완료 시까지 해당 정보를 이용하지 않습니다.
        </p>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">7. 개인정보의 파기 절차 및 방법</h4>
        <p className="leading-relaxed mb-2">
          <span className="font-semibold">파기 절차:</span> 수집 목적이 달성된 후에는 관련 법령 및 내부 방침에 따라 일정 기간 보관 후 파기됩니다.
        </p>
        <p className="leading-relaxed">
          <span className="font-semibold">파기 방법:</span>
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>전자적 파일 형태는 복구 불가능한 방식으로 삭제</li>
          <li>출력물은 분쇄 또는 소각</li>
        </ul>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">8. 개인정보의 안전성 확보조치</h4>
        <p className="leading-relaxed mb-2">
          병원은 개인정보의 안전한 관리를 위해 다음과 같은 조치를 취하고 있습니다.
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>개인정보 접근 권한 제한</li>
          <li>개인정보 처리자 교육 실시</li>
          <li>보안 프로그램 설치 및 정기 점검</li>
          <li>개인정보 암호화 및 안전한 저장</li>
        </ul>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">9. 개인정보 보호책임자</h4>
        <p className="leading-relaxed mb-2">
          병원은 개인정보 처리와 관련한 고객의 문의, 불만처리, 피해구제 등을 위해 아래의 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-gray-900">개인정보 보호책임자</p>
          <p className="text-sm mt-1"><span className="font-semibold">성명:</span> 이정환</p>
          <p className="text-sm"><span className="font-semibold">연락처:</span> 02-6246-1113</p>
        </div>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">10. 동의 거부 권리 및 불이익 안내</h4>
        <p className="leading-relaxed">
          고객은 개인정보 수집 및 이용에 동의하지 않을 수 있습니다.
          다만, 동의를 거부하실 경우 상담 신청 및 예약 접수가 제한될 수 있습니다.
        </p>
      </section>

      <section>
        <h4 className="font-bold text-base text-gray-900 mb-2">11. 개인정보 처리방침 변경 고지</h4>
        <p className="leading-relaxed">
          본 개인정보 처리방침은 2025년 7월 1일부터 적용됩니다.
          내용 추가, 삭제 및 수정이 있을 경우, 변경사항을 본 랜딩페이지를 통해 공지합니다.
        </p>
      </section>

      <section className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          시행일자: 2025년 7월 1일
        </p>
      </section>
    </div>
  );
}

