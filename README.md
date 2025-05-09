# 🥗 싸밥 (SSABAB) - 프론트엔드

Next.js 기반의 대전 싸피 교육생을 위한, 맞춤형 점심 선택 경험을 제공하는 스마트 식사 선택 서비스 **싸밥(SSABAB)**의 프론트엔드 프로젝트입니다.

---

## 📁 폴더 구조

```
src/
├── app/                    # 라우트 경로 별 페이지 구성
│   ├── signup/            # 회원가입 페이지
│   ├── login/             # 로그인 페이지
│   ├── analysis/          # 차트 분석 페이지
│   ├── ssabab/            # 싸밥 메인 기능 페이지
│   └── layout.tsx         # 전역 레이아웃 정의
│
├── components/            # 재사용 가능한 UI 및 페이지별 컴포넌트
│   ├── authentication/    # 로그인 및 회원가입 폼
│   ├── analysis/          # 분석 차트 컴포넌트 (BarChart, LineChart 등)
│   ├── ssabab/            # 싸밥 주요 섹션 컴포넌트
│   ├── ui/                # 버튼, 카드, 입력창 등 공통 UI 컴포넌트 (shadcn 기반)
│   └── common/            # 섹션 제목 등 기타 공용 요소
│
├── lib/                   # 유틸리티 함수 (예: classNames)
│   └── utils.ts
````

---

## 🚀 실행 방법

### 1. 패키지 설치

```bash
npm install
````

### 2. 개발 서버 실행

```bash
npm run dev
```

* 기본 주소: [http://localhost:3000](http://localhost:3000)

---

## 🧪 주요 기능

* ✅ 회원가입 / 로그인 (/signup, /login)
* ✅ 메뉴 투표: 사용자들이 당일 점심 메뉴를 선택하여 투표
* ✅ 메뉴 평가: 식사 후 별점 및 코멘트를 통한 만족도 평가
* ✅ 투표 및 평가 결과 분석 (/analysis)

---

## 🛠 기술 스택

* [Next.js](https://nextjs.org/) 13+
* TypeScript
* Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
* Axios
* React Hook 기반 상태 관리 (`useState`, `useEffect` 등)

---
