import { RevisionType } from "@/types";
import { getLandingImageUrl } from "@/lib/supabase/storage";

// 개발 환경에서는 placeholder 사용, 프로덕션에서는 Supabase Storage 사용
const USE_SUPABASE_IMAGES = process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined;

export const revisionTypes: RevisionType[] = [
  {
    id: 1,
    title: "코끝이 들리거나 짧아진 경우",
    cause: "염증 또는 반복된 수술로 인해 흉살 조직과 피막이 유착되면서 코끝이 들리거나 짧아지고, 피부가 단단해지는 현상입니다.",
    method: "보형물을 제거하고 유착된 조직을 풀어준 뒤, 피부를 충분히 늘리고 코끝 연골을 재배치하여 자연스럽게 코끝 위치를 복원합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("1.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("1-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("1-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("1-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("1_profile.jpg") : undefined
  },
  {
    id: 2,
    title: "코끝이 떨어진 경우",
    cause: "코끝 연골이 약하거나 비중격의 지지력이 부족한 경우, 시간이 지나며 코끝이 아래로 처질 수 있습니다.",
    method: "자가 늑연골로 지지대를 세우고, 코끝 날개연골을 묶어 구조를 보강함으로써 처진 코끝을 올려줍니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("2.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("2-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("2-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("2-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("2_profile.jpg") : undefined
  },
  {
    id: 3,
    title: "보형물이 휘어 보이는 경우",
    cause: "보형물의 아랫면이 코뼈와 정확히 맞지 않거나 한쪽으로 쏠려 있으면 코가 전체적으로 비뚤어져 보일 수 있습니다.",
    method: "보형물 하단을 코뼈와 일치하도록 정밀하게 다듬고, 균형 있게 안착시켜 휘어진 라인을 교정합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("3.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("3-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("3-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("3-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("3_profile.jpg") : undefined
  },
  {
    id: 4,
    title: "보형물이 비치는 경우",
    cause: "피부가 얇거나, 두꺼운 보형물 삽입으로 인해 실리콘 테두리나 연골 모양이 겉으로 드러나는 경우입니다.",
    method: "보형물을 얇은 실리콘으로 교체하거나, 자가 진피 또는 인공 진피를 덧대어 비침을 완화합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("4.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("4-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("4-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("4-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("4_profile.jpg") : undefined
  },
  {
    id: 5,
    title: "보형물이 움직이는 경우",
    cause: "보형물이 코뼈 위에 정확히 고정되지 않으면 만졌을 때 움직임이 느껴질 수 있습니다.",
    method: "보형물의 위치를 재조정하거나, 골막에 안정적으로 고정시켜 재수술을 진행합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("5.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("5-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("5-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("5-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("5_profile.jpg") : undefined
  },
  {
    id: 6,
    title: "코끝이 찝혀 보이는 경우",
    cause: "코끝 연골을 과하게 묶었거나, 피부가 얇은 상태에서 무리하게 높였을 때 생기는 현상입니다.",
    method: "연골을 재배치하거나 연골·진피이식을 통해 코끝의 볼륨과 라인을 부드럽게 보완합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("6.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("6-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("6-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("6-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("6_profile.jpg") : undefined
  },
  {
    id: 7,
    title: "콧구멍이 비대칭인 경우",
    cause: "날개연골 재배치가 정확하지 않거나 비중격 지지력이 약할 경우 콧구멍 비대칭이 생길 수 있습니다.",
    method: "비중격과 코끝 연골을 보강하고, 콧날개 연골을 재정렬해 대칭을 맞춥니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("7.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("7-b-a.png") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("7_profile.jpg") : undefined
  },
  {
    id: 8,
    title: "복코 재교정이 필요한 경우",
    cause: "연골을 충분히 모아주지 않았거나, 피하지방을 제대로 제거하지 않은 경우 복코가 지속될 수 있습니다.",
    method: "연골을 다시 모아주고 불필요한 피하지방을 정리해 보다 선명한 코끝 라인을 완성합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("8.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("8-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("8-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("8-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("8_profile.jpg") : undefined
  },
  {
    id: 9,
    title: "매부리가 남은 경우",
    cause: "매부리 절제량이 부족하거나, 수술 후 뼈가 다시 자라면서 돌출이 남아 있을 수 있습니다.",
    method: "매부리를 정밀하게 제거한 뒤, 콧대를 보형물이나 자가조직으로 다듬어 라인을 자연스럽게 연결합니다.",
    thumb: USE_SUPABASE_IMAGES ? getLandingImageUrl("9.jpg") : "",
    beforeAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("9-b-a.png") : undefined,
    selfieBefore: USE_SUPABASE_IMAGES ? getLandingImageUrl("9-before.jpg") : undefined,
    selfieAfter: USE_SUPABASE_IMAGES ? getLandingImageUrl("9-after-1.jpg") : undefined,
    profileImage: USE_SUPABASE_IMAGES ? getLandingImageUrl("9_profile.jpg") : undefined
  }
];

