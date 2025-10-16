# 📸 이미지 업로드 가이드

## 필요한 이미지 목록

### 1. 썸네일 이미지 (9개)
- `1.jpg` - 코끝이 들리거나 짧아진 경우
- `2.jpg` - 코끝이 떨어진 경우
- `3.jpg` - 보형물이 휘어 보이는 경우
- `4.jpg` - 보형물이 비치는 경우
- `5.jpg` - 보형물이 움직이는 경우
- `6.jpg` - 코끝이 찝혀 보이는 경우
- `7.jpg` - 콧구멍이 비대칭인 경우
- `8.jpg` - 복코 재교정이 필요한 경우
- `9.jpg` - 매부리가 남은 경우

### 2. 전후 비교 이미지 (7개)
- `1-b-a.png` - 코끝 구축 전후
- `2-b-a.png` - 코끝 떨어짐 전후
- `3-b-a.png` - 보형물 휘어짐 전후
- `4-b-a.png` - 보형물 비침 전후
- `6-b-a.png` - 코끝 찝힘 전후
- `8-b-a.png` - 복코 재교정 전후
- `9-b-a.png` - 매부리 제거 전후

### 3. 원장님 프로필 (1개) ⭐ NEW
- `profile.jpg` - 원장님 프로필 사진
  - 권장 크기: 200x200px 이상
  - 정사각형 비율
  - 얼굴이 중앙에 위치

---

## 📤 업로드 방법

### Supabase Dashboard 사용

1. **Supabase Dashboard 접속**
   - https://app.supabase.com
   - 프로젝트 선택

2. **Storage 메뉴로 이동**
   - 좌측 메뉴 → Storage

3. **landing-images 버킷 선택**

4. **파일 업로드**
   - "Upload file" 버튼 클릭
   - 파일 선택 또는 드래그 앤 드롭
   - 파일명 확인 (정확해야 함!)

---

## 🔍 업로드 확인

### 이미지 URL 테스트

브라우저에서 다음 URL로 확인:

```
# 썸네일 예시
https://your-project.supabase.co/storage/v1/object/public/landing-images/1.jpg

# 원장님 프로필
https://your-project.supabase.co/storage/v1/object/public/landing-images/profile.jpg
```

이미지가 직접 보이면 성공! ✅

---

## 📋 체크리스트

업로드 완료 체크:

- [ ] 1.jpg
- [ ] 2.jpg
- [ ] 3.jpg
- [ ] 4.jpg
- [ ] 5.jpg
- [ ] 6.jpg
- [ ] 7.jpg
- [ ] 8.jpg
- [ ] 9.jpg
- [ ] 1-b-a.png
- [ ] 2-b-a.png ⭐ NEW
- [ ] 3-b-a.png
- [ ] 4-b-a.png ⭐ NEW
- [ ] 6-b-a.png ⭐ NEW
- [ ] 8-b-a.png
- [ ] 9-b-a.png
- [ ] profile.jpg

---

## 🎨 원장님 프로필 이미지 준비 팁

### 권장 사양
- **크기**: 200x200px ~ 500x500px
- **비율**: 1:1 (정사각형)
- **포맷**: JPG 또는 PNG
- **용량**: 500KB 이하

### 촬영/편집 가이드
- 밝은 배경 (흰색 또는 파란색 계열)
- 얼굴이 프레임의 60-70% 차지
- 자연스러운 미소
- 전문적인 복장 (가운 또는 정장)
- 정면 또는 살짝 측면 (15도 이내)

### 편집 도구 (무료)
- **온라인**: remove.bg (배경 제거)
- **모바일**: Canva (크기 조정)
- **PC**: GIMP, Paint.NET

---

## 🔄 이미지 교체

기존 이미지를 바꾸고 싶다면:

1. Storage → landing-images
2. 기존 파일 삭제
3. 같은 이름으로 새 파일 업로드
4. 브라우저 캐시 삭제 (Ctrl+Shift+R)

---

## 💡 문제 해결

### 이미지가 안 보일 때
1. 파일명 확인 (대소문자 구분!)
2. 버킷이 public인지 확인
3. URL 직접 접속 테스트
4. 개발 서버 재시작

### profile.jpg가 안 보일 때
- 파일이 업로드되었는지 확인
- 파일명이 정확히 `profile.jpg`인지 확인
- 환경 변수 없으면 "원" 텍스트가 표시됨 (정상)


