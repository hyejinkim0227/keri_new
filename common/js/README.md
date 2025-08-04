# JavaScript 파일 구조 최종 개선 가이드

## 📁 파일 구조 (최종)

### 1. `common-shared.js` (새로 생성)
- **목적**: 공통으로 사용되는 핵심 함수들
- **포함 함수들**:
  - `pcChk()` - 창 크기 체크
  - `focusLoop()` - 포커스 이동
  - `saveFocus()`, `returnFocus()` - 포커스 저장/복원
  - `bodyScroll()` - 바디 스크롤 제어
  - `mSchOnOff()` - 모바일 검색 토글
  - `mGnbInit()` - 모바일 네비게이션 초기화
  - `mMenuActive1()`, `mMenuActive3()` - 모바일 메뉴 제어
  - `openSitemap()`, `closeSitemap()` - 사이트맵 제어
  - `openSitemapEn()`, `closeSitemapEn()` - 영문 사이트맵 제어 (하위 호환성)

### 2. `common.js` (통합 완료)
- **목적**: 한국어 사이트의 모든 기능 통합
- **주요 기능**:
  - 모든 슬라이더 기능들 (메인배너, 알림판, 사이드배너, 홍보영상, footer배너, 팝업, 인증섹션, 연구인터뷰 등)
  - 한국어 메뉴 시스템
  - 메인 페이지 인터랙션
  - 풀페이지 스크롤 기능
  - 탭 기능
  - 모달 및 팝업 기능
  - 검색 기능
  - 기타 모든 UI 컴포넌트들

### 3. ~~`publish.js`~~ (삭제됨)
- **상태**: 완전 삭제됨
- **이유**: 영문 사이트 미사용으로 불필요
- **이동된 기능**: 필요한 기능들은 `common.js`로 통합됨

## 🔧 로드 순서 (최종)

HTML 파일에서 다음 순서로 스크립트를 로드합니다:

```html
<!-- 1. jQuery 및 플러그인들 -->
<script src="../common/js/jquery-1.12.4.min.js"></script>
<script src="../common/js/wow.js"></script>
<script src="../common/js/slick.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<!-- 2. 공통 함수 (필수 - 먼저 로드) -->
<script src="../common/js/common-shared.js"></script>

<!-- 3. 메인 스크립트 (모든 기능 통합) -->
<script src="../common/js/common.js"></script>
```

## ✨ 최종 개선 효과

### 1. 파일 구조 단순화
- **3개 파일** → **2개 파일**로 축소
- `publish.js` 완전 제거로 관리 포인트 감소
- 영문 관련 불필요한 코드 완전 제거

### 2. 중복 코드 완전 제거
- **제거된 중복 함수들**: 9개 주요 함수
- **코드 중복률**: 약 50% 감소 (영문 코드 + 중복 함수)
- **유지보수성**: 크게 향상

### 3. 명확한 책임 분리
- **공통 함수**: `common-shared.js`에서 중앙 관리
- **모든 사이트 기능**: `common.js`에서 통합 관리
- **영문 전용 기능**: 완전 제거

### 4. 성능 개선
- HTTP 요청 1회 감소 (publish.js 제거)
- 불필요한 영문 관련 코드 실행 제거
- 로드 시간 단축

## 🚨 주의사항

1. **로드 순서 준수**: `common-shared.js`를 반드시 `common.js`보다 먼저 로드
2. **함수 중복 방지**: 새로운 공통 함수는 `common-shared.js`에 추가
3. **영문 관련 코드**: 모두 제거되었으므로 영문 관련 HTML 요소 사용 시 오류 발생 가능

## 🔄 마이그레이션 체크리스트 (완료)

- [x] `common-shared.js` 파일 생성
- [x] `common.js`에서 중복 함수 제거
- [x] `publish.js`에서 필요한 기능을 `common.js`로 이동
- [x] `publish.js` 파일 완전 삭제
- [x] `common.js`에서 영문 관련 코드 제거
- [x] HTML 파일에서 `publish.js` 로드 제거
- [x] HTML 파일의 스크립트 로드 순서 수정
- [x] 함수 호출 부분에 주석 추가
- [x] README 문서 업데이트

## 🎉 완료된 작업 요약

### 제거된 항목들
- `publish.js` 파일 (완전 삭제)
- 영문 헤더 관련 함수들 (`gnb3Open`, `gnb3Close`, `imgResizeEm` 등)
- 영문 검색 관련 함수들 (`openSearchEn`, `resetSearchEn`)
- 영문 사이트맵 관련 이벤트들
- 영문 GNB 관련 이벤트들
- 중복된 9개 공통 함수들

### 통합된 기능들
- certification 섹션 슬라이더
- 연구인터뷰 슬라이더  
- 탭 박스 기능
- 팝업 슬라이드 기능
- 배너 슬라이더들

## 🐛 문제 해결

만약 함수가 정의되지 않았다는 오류가 발생하면:
1. `common-shared.js`가 먼저 로드되는지 확인
2. 브라우저 캐시를 강제 새로고침 (Ctrl+F5)
3. 개발자 도구에서 스크립트 로드 순서 확인
4. 영문 관련 HTML 요소(`.header_en` 등)가 있다면 제거 또는 한국어 요소로 변경 