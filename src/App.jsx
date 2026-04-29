import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Home, GraduationCap, BookOpen, PlusCircle, ClipboardList, Settings2,
  ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Plus, File,
  Check, X, AlertTriangle, Sparkles, ArrowRight, History, Network,
  Link2, FileUp, Type, Zap, RotateCcw, Send, Dot, Bot,
  Globe, Code, Search, LogOut, Clock, CheckCircle2, XCircle,
  Edit3, RefreshCw, HelpCircle, Users, BookMarked, Building2,
  Briefcase, DollarSign, Shield, ChevronLeft, Info, ExternalLink,
  Tag as TagIcon, Layers, MoreHorizontal
} from 'lucide-react';

/* =========================================================================
   FONTS & GLOBAL STYLES
   ========================================================================= */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Inter', 'Noto Sans KR', -apple-system, system-ui, sans-serif; }

  .nf  { font-family: 'Inter', 'Noto Sans KR', -apple-system, sans-serif; }
  .nm  { font-family: 'Fira Code', monospace; }

  @keyframes fadeIn   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(.97); }      to { opacity:1; transform:scale(1); } }
  @keyframes flowDot  { from { transform:translateX(-100%); }          to { transform:translateX(500%); } }
  @keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:.3;} }

  .aFI { animation: fadeIn  .28s cubic-bezier(.2,.8,.2,1) both; }
  .aSI { animation: scaleIn .22s cubic-bezier(.2,.8,.2,1) both; }
  .aBL { animation: blink 1.6s ease-in-out infinite; }

  .sy::-webkit-scrollbar { width:5px; height:5px; }
  .sy::-webkit-scrollbar-thumb { background:rgba(0,0,0,.12); border-radius:3px; }
  .sy::-webkit-scrollbar-track { background:transparent; }

  .md-content h1, .md-content h2 { margin-top: 24px; margin-bottom: 12px; font-size: 22px; font-weight: 700; letter-spacing: -.3px; }
  .md-content h3 { margin-top: 20px; margin-bottom: 10px; font-size: 18px; font-weight: 600; }
  .md-content p { margin-bottom: 16px; }
  .md-content ul, .md-content ol { padding-left: 24px; margin-bottom: 16px; line-height: 1.7; }
  .md-content li { margin-bottom: 4px; }
  .md-content blockquote { padding: 12px 16px; background: #f6f5f4; border-left: 4px solid rgba(0,0,0,0.1); border-radius: 4px; margin-bottom: 16px; }
  .md-content strong { font-weight: 700; }
  .md-content em { font-style: italic; }
`;

/* =========================================================================
   NOTION DESIGN TOKENS
   ========================================================================= */
const N = {
  bg:        '#ffffff',
  bgWarm:    '#f6f5f4',
  bgDark:    '#31302e',
  ink:       'rgba(0,0,0,0.95)',
  inkSub:    '#615d59',
  inkMute:   '#a39e98',
  border:    'rgba(0,0,0,0.1)',
  blue:      '#0075de',
  blueHov:   '#005bab',
  blueBg:    '#f2f9ff',
  blueTxt:   '#097fe8',
  teal:      '#2a9d99',
  tealBg:    '#f0fafa',
  green:     '#1aae39',
  greenBg:   '#f0faf3',
  orange:    '#dd5b00',
  orangeBg:  '#fff7f0',
  card:      'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px',
  deep:      'rgba(0,0,0,0.01) 0px 1px 3px, rgba(0,0,0,0.02) 0px 3px 7px, rgba(0,0,0,0.02) 0px 7px 15px, rgba(0,0,0,0.04) 0px 14px 28px, rgba(0,0,0,0.05) 0px 23px 52px',
};

const bd = `1px solid ${N.border}`;

/* =========================================================================
   HR WIKI DATA
   ========================================================================= */
const HR_TREE = {
  workspace: '글로벌벨루가 HR Wiki',
  folders: [
    {
      id: 'f1', label: '채용 및 온보딩', icon: Users, open: true,
      pages: [
        { id: 'p-onboard',  title: '신입사원 온보딩 체크리스트', status: 'active', source: 'user',  updated: '1주일 전', content: "# 신입사원 온보딩 체크리스트\n\n신규 입사자의 원활한 적응을 돕기 위해 부서 및 HR에서 진행해야 할 절차를 안내합니다.\n\n## 1. 입사 전 준비 (HR 팀)\n- **근로계약서 및 서약서 발송:** 전자서명 시스템을 통해 입사 전 발송 및 서명 완료\n- **웰컴 키트 준비:** 벨루가 굿즈(티셔츠, 텀블러, 스티커 팩) 및 사원증 제작 대기\n- **기기 및 계정 세팅:** 업무용 노트북(Mac/Windows 선택), Google Workspace, Slack, Jira 등 주요 툴 계정 생성\n\n## 2. 입사 1일차 (온보딩 위크 시작)\n- **오전 (10:00 - 12:00):** HR 오리엔테이션 (회사 소개, 복리후생 안내, 취업규칙 안내) 및 오피스 투어\n- **점심 (12:00 - 13:30):** 팀 환영 점심 식사 (회사 지원)\n- **오후 (13:30 - 18:00):** 업무 환경 셋팅 및 IT 보안 교육 (보안팀 주관)\n\n## 3. 입사 1주차\n- 직무 오리엔테이션 및 OJT 계획 수립 (팀장 주관)\n- 버디(Buddy) 지정 및 주 1회 티타임 진행 (첫 1개월간)\n- 전사 위키 및 슬랙 채널 참여 가이드 숙지\n\n## 4. 입사 1개월차\n- 1개월 차 HR 리텐션 인터뷰 (온보딩 피드백 및 애로사항 청취)\n- 목표(KPI/OKR) 초기 셋업 및 리더와의 1:1 면담\n\n> 신입사원의 긍정적인 첫인상은 장기 근속의 핵심입니다. 각 단계별 체크리스트가 누락되지 않도록 담당자는 유의해 주시기 바랍니다." },
        { id: 'p-recruit',  title: '채용 프로세스 가이드',       status: 'active', source: 'user',  updated: '2주 전', content: "# 채용 프로세스 가이드\n\n우수한 인재를 영입하기 위한 벨루가의 표준 채용 프로세스입니다.\n\n## 1. 채용 포지션 오픈 (TO 승인)\n각 부서장은 충원 또는 신규 채용이 필요할 경우, HR팀에 채용 기안을 제출합니다. 경영진의 TO 승인이 완료되면 채용 파트에서 JD(Job Description)를 검토 및 보완하여 채용 플랫폼(원티드, 리멤버 등)에 공고를 게재합니다.\n\n## 2. 서류 전형\n- 지원서 접수 후 3 영업일 이내에 평가를 완료하는 것을 원칙으로 합니다.\n- 실무 부서의 서류 검토자(보통 팀장 및 시니어)가 역량 및 문화적 적합성을 1차적으로 평가합니다.\n\n## 3. 1차 실무 면접\n- **참석자:** 직무 연관성이 높은 실무진 (2~3명)\n- **평가 요소:** 하드 스킬, 문제 해결 능력, 과거 프로젝트 경험\n- **방식:** 필요시 코딩 테스트, 사전 과제(과제비 지급)를 병행할 수 있습니다.\n\n## 4. 2차 컬쳐핏(임원) 면접\n- **참석자:** C-Level 또는 HR 리더, 부서 리더\n- **평가 요소:** 회사의 핵심 가치(Core Value) 부합도, 커뮤니케이션 스타일, 성장 잠재력\n\n## 5. 처우 협의 및 오퍼\n합격자에 한해 레퍼런스 체크(경력직)를 진행한 후, HR팀에서 개별적으로 처우 협의를 진행합니다. 오퍼 레터 수락 시 입사일을 확정합니다." },
        { id: 'p-probation',title: '수습기간 평가 기준',         status: 'draft',  source: 'user',  updated: '3주 전', content: "# 수습기간 평가 기준\n\n신규 입사자는 입사일로부터 **2개월**의 수습기간(Probation Period)을 가집니다. 수습기간은 상호 핏을 확인하는 중요한 시기입니다.\n\n## 1. 평가 목적\n- 직무 수행 능력 및 회사 적합성 검증\n- 신규 입사자의 빠른 적응 지원 및 피드백 제공\n\n## 2. 평가 일정\n- **중간 점검 (1개월 차):** 팀장과 1:1 면담을 통해 적응도 파악 및 긍정적/개선 피드백 제공\n- **최종 평가 (수습 종료 2주 전):** HR팀과 팀장이 협의하여 본 평가 진행\n\n## 3. 평가 항목 및 비중\n1. **직무 역량 (50%):** 부여된 업무의 완성도, 업무 속도, 문제 해결 능력, 학습 태도\n2. **조직 적합성 (30%):** 코어 밸류 실천, 팀원과의 협업 마인드, 피드백 수용성\n3. **근태 및 기본기 (20%):** 지각/결근 여부, 사내 규정 준수, 업무 에티켓\n\n## 4. 평가 결과 및 조치\n- **Pass:** 정규직으로 전환되며, 수습 해제 안내 메일이 발송됩니다.\n- **Fail:** 평가 기준 미달 시, 취업규칙 제14조에 의거하여 본 채용이 거절될 수 있습니다. 단, 이 경우 구체적인 사유와 피드백이 사전에 제공되어야 합니다.\n\n세부 기준 및 평가표 양식은 본 위키의 '평가 양식 모음'을 참조하시기 바랍니다." },
      ],
    },
    {
      id: 'f2', label: '근태 및 휴가', icon: Clock, open: true,
      pages: [
        { id: 'p-leave',    title: '연차 사용 가이드',           status: 'active', source: 'ai',    updated: '방금 전', isNew: true, content: "# 연차 사용 가이드\n\n## 신규 입사자 연차\n입사 1년 미만 직원은 **매월 1일씩** 연차가 발생하며, 발생 즉시 사용할 수 있어요.\n1년 이상 근속 시 연 15일이 일괄 부여돼요.\n\n## 연차 신청 방법\n1. Workflow 시스템에 접속해요.\n2. \"휴가 신청\" 메뉴에서 날짜를 선택해요.\n3. 팀장 승인 후 자동으로 일정에 반영돼요.\n\n## 1. 연차 촉진 제도\n- 1차 촉진: 매년 7월 (미사용 연차 일수 안내 및 사용 계획서 제출 요청)\n- 2차 촉진: 매년 10월 (사용 계획서 미제출 시, 회사에서 임의 지정하여 통보)\n\n## 2. 반차 및 반반차\n- 반차: 4시간 휴가 (오전/오후 선택 가능)\n- 반반차: 2시간 휴가 (지각 대용 불가, 개인 사정으로 인한 조기 퇴근 등에 활용)\n\n연차는 직원의 정당한 권리입니다! 팀 내 업무 조율 후 자유롭게 사용하시기 바랍니다." },
        { id: 'p-condol',   title: '경조사 휴가 정책',           status: 'active', source: 'user',  updated: '1달 전', content: "# 경조사 휴가 정책\n\n직원 본인 및 직계 가족의 경조사 발생 시, 회사는 유급 휴가 및 경조금을 지원합니다.\n\n## 1. 경조사 휴가 부여 기준\n- **본인 결혼:** 휴가 5일, 경조금 100만원\n- **자녀 출산:** \n  - 배우자 출산 휴가 10일 (분할 사용 가능)\n  - 출산 축하금 50만원 및 과일 바구니\n- **본인 및 배우자 부모상:** 휴가 5일, 경조금 100만원, 조화 지급\n- **조부모/외조부모상:** 휴가 3일, 경조금 30만원\n- **형제자매상:** 휴가 3일, 경조금 50만원\n\n## 2. 신청 프로세스\n- 사유 발생 전후 1주일 내 Workflow 시스템을 통해 신청서 작성\n- 증빙 서류(청첩장, 가족관계증명서, 부고장 등) 스캔본 첨부 필수\n\n## 3. 유의사항\n- 경조 휴가는 주휴일(토/일) 및 공휴일을 제외하고 평일 기준으로 산정합니다.\n- 부득이한 사정으로 사전 신청이 불가한 경우, 사후 신청이 가능하나 즉각적인 구두 보고를 원칙으로 합니다." },
        { id: 'p-remote',   title: '재택근무 가이드라인',         status: 'active', source: 'user',  updated: '2달 전', content: "# 재택근무 가이드라인\n\n효율적인 업무 수행과 직원 만족도를 높이기 위해 조건부 재택근무 제도를 운영합니다.\n\n## 1. 재택근무 일수 및 기준\n- **허용 일수:** 주 최대 2일 (월, 금 연속 사용 지양)\n- **신청 기한:** 사용 전일 18:00까지 Workflow 신청 및 팀장 승인\n- 수습기간(입사 후 2개월) 중인 직원은 재택근무를 제한합니다. (팀장 재량 하 예외 가능)\n\n## 2. 코어타임 운영\n- **10:00 - 16:00**는 필수 근무 시간(Core Time)입니다.\n- 코어타임 중에는 즉각적인 연락(Slack 응답 15분 이내) 및 화상 회의 참석이 가능해야 합니다.\n\n## 3. 재택근무 시 준수사항\n- 업무에 집중할 수 있는 독립된 공간에서 근무\n- 공공장소(카페 등) 근무 시 화면 보안 필름 사용 및 개방형 와이파이(Public WiFi) 사용 주의\n- 불가피한 자리 비움 시 Slack 상태 메시지 업데이트\n\n재택근무는 자율과 책임이 따르는 제도입니다. 업무 성과 저하 시 부서장 권한으로 제재될 수 있습니다." },
      ],
    },
    {
      id: 'f3', label: '급여 및 복지', icon: DollarSign, open: false,
      pages: [
        { id: 'p-salary',   title: '급여 지급 일정',             status: 'active', source: 'user',  updated: '3달 전', content: "# 급여 지급 일정\n\n급여 및 상여금 지급에 관한 기본 규정입니다.\n\n## 1. 정기 급여 지급일\n- **매월 25일**에 지급됩니다.\n- 지급일이 주말 또는 공휴일인 경우, 직전 영업일에 선지급됩니다.\n- 급여 산정 기간: 전월 1일 ~ 전월 말일\n\n## 2. 연장/야간/휴일 근로 수당\n- 사전 승인된 연장 근무에 대해서만 수당이 지급됩니다.\n- 산정 기준: 통상임금의 1.5배 (밤 10시 이후 야간 근로 시 추가 0.5배 가산)\n- 당월 발생한 연장 수당은 익월 급여에 합산되어 지급됩니다.\n\n## 3. 인센티브 및 상여\n- 경영 성과에 따라 연 1회(보통 1월 말) 성과급(PI/PS)이 차등 지급될 수 있습니다.\n- 성과급은 연간 인사평가 결과를 바탕으로 산정됩니다.\n\n급여 명세서는 매월 지급일 하루 전, 등록된 개인 이메일(암호화된 PDF)로 자동 발송됩니다." },
        { id: 'p-welfare',  title: '복리후생 안내',              status: 'active', source: 'user',  updated: '1주일 전', content: "# 복리후생 안내\n\n글로벌벨루가는 직원의 삶의 질 향상과 건강을 위해 다양한 복지 제도를 운영합니다.\n\n## 1. 건강 및 의료 지원\n- **종합건강검진:** 매년 1회, 제휴 병원(강북삼성, 하나로의료재단 등) 무료 검진 (본인 외 가족 1인 추가 시 할인가 적용)\n- **사내 의료비 지원 (신설):** 직원 본인 의료비의 50%, 연 100만원 한도로 지원 (정규직 1년 이상)\n- **심리 상담:** 연 5회 전문가 1:1 심리 상담(EAP) 전액 지원\n\n## 2. 식대 및 자기계발\n- **점심 식대:** 매월 20만원 한도의 식권대장 포인트 지급\n- **자기계발비:** 도서 구매, 직무 관련 인강 수강 등 연 120만원 한도 실비 지원\n- **어학 지원:** 전화영어, 사내 원어민 클래스 무료 제공\n\n## 3. 기타 복지\n- **기념일 선물:** 생일 및 입사 주년기념일(1/3/5년) 리워드 지급\n- **리프레시 휴가:** 3년 만근 시 유급 휴가 5일 + 휴가비 100만원 지급\n- **사내 카페테리아:** 무제한 커피, 스낵 및 음료 자판기 무료 운영" },
        { id: 'p-retire',   title: '퇴직금 규정',                status: 'active', source: 'user',  updated: '2달 전', content: "# 퇴직금 규정\n\n직원이 퇴사할 경우 지급되는 퇴직금의 산정 및 지급 절차입니다.\n\n## 1. 지급 대상\n- 1주 소정근로시간이 15시간 이상이며, **계속근로기간이 1년 이상**인 근로자\n\n## 2. 퇴직연금 제도\n당사는 확정기여형(DC) 퇴직연금 제도를 운영합니다.\n- 회사는 매년 근로자 연간 임금총액의 1/12 이상을 근로자 명의의 퇴직연금 계좌로 납입합니다.\n- 근로자가 직접 금융상품을 선택하여 운용할 수 있으며, 운용 수익 및 손실은 근로자에게 귀속됩니다.\n- 가입 금융기관: 삼성증권, 미래에셋증권 중 택 1\n\n## 3. 퇴직 프로세스\n1. 사직서 제출 (최소 희망 퇴사일 30일 전)\n2. 소속 부서장 및 HR팀 면담\n3. 업무 인수인계 및 사내 자산(노트북, 사원증 등) 반납\n4. 퇴직금 수령을 위한 IRP(개인형 퇴직연금) 계좌 사본 제출\n\n## 4. 지급 기한\n- 퇴사일로부터 14일 이내에 지정된 IRP 계좌로 입금 완료됩니다." },
      ],
    },
    {
      id: 'f4', label: '조직 및 규정', icon: Shield, open: false,
      pages: [
        { id: 'p-rules',    title: '취업규칙',                   status: 'active', source: 'user',  updated: '2주 전', content: "# 취업규칙\n\n당사의 취업규칙은 모든 임직원이 준수해야 할 사내 규범의 최상위 문서입니다.\n\n## 제1장 총칙\n**제1조 (목적)** 이 규칙은 근로자의 근로조건, 복무 규율 및 기타 필요한 사항을 정함으로써 회사의 발전과 근로자의 기본적 생활 보장을 목적으로 합니다.\n\n**제2조 (적용 범위)** 회사에 근무하는 모든 근로자에게 적용됩니다. 단, 별도의 계약이 있는 경우 그에 따릅니다.\n\n## 제2장 복무 규율\n**제11조 (신의성실의 의무)** 근로자는 회사의 규정을 준수하고 맡은 바 직무를 성실히 수행해야 정하며, 회사의 명예를 훼손하는 행위를 하여서는 안 됩니다.\n\n**제12조 (기밀 유지)** 근로자는 재직 중은 물론 퇴직 후에도 직무상 알게 된 회사의 기밀을 외부에 누설해서는 안 됩니다. 위반 시 민/형사상 책임을 질 수 있습니다.\n\n**제22조 (재택근무)** 재택근무는 팀장 승인 후 주 2회까지 허용합니다. 재택근무일에도 코어타임(10:00–16:00)은 온라인 접속을 유지해야 합니다. 세부 사항은 재택근무 가이드라인을 따릅니다.\n\n*전체 조항은 법무팀 또는 HR팀을 통해 열람하실 수 있습니다.*" },
        { id: 'p-security', title: '보안 정책',                  status: 'active', source: 'user',  updated: '1달 전', content: "# 보안 정책\n\n안전한 IT 환경과 정보 자산 보호를 위한 전사 보안 정책입니다.\n\n## 1. 비밀번호 관리\n- **복잡도:** 영문 대/소문자, 숫자, 특수문자를 포함하여 12자리 이상 설정\n- **변경 주기:** 최소 3개월마다 1회 필수 변경\n- **공유 금지:** 어떠한 경우에도 개인 계정 비밀번호를 타인(IT팀 포함)과 공유해서는 안 됩니다.\n\n## 2. 기기 보안\n- 자리 이석 시 반드시 **화면 잠금** (Mac: ⌘ + ctrl + Q / Win: Win + L)\n- 회사가 승인하지 않은 외부 저장 매체(USB 등) 사용 엄격히 금지\n- 업무용 기기에 불법 소프트웨어 설치 금지 (사내망 모니터링 중)\n\n## 3. 데이터 반출 규정\n- 업무 관련 문서, 소스코드, 고객 개인정보 등 모든 사내 데이터는 인가된 채널(사내 이메일, 클라우드 드라이브)로만 전송 가능합니다.\n- 개인 메일, 메신저(카카오톡 등)를 통한 사내 데이터 반출은 보안 위반으로 간주되어 징계 사유가 됩니다.\n\n정보 보안은 선택이 아닌 필수입니다. 의심스러운 이메일(피싱) 수신 시 즉시 보안팀에 신고 바랍니다." },
        { id: 'p-conduct',  title: '행동강령',                   status: 'active', source: 'user',  updated: '2달 전', content: "# 행동강령\n\n글로벌벨루가의 임직원으로서 서로를 존중하고 윤리적인 업무 환경을 조성하기 위한 행동강령(Code of Conduct)입니다.\n\n## 1. 상호 존중과 수평적 커뮤니케이션\n- 직급에 관계없이 상호 존댓말 사용을 원칙으로 합니다. (예: \"다영님, 이 내용 확인 부탁드립니다.\")\n- 인종, 성별, 나이, 종교, 장애 등을 이유로 한 어떠한 차별도 용납하지 않습니다.\n\n## 2. 직장 내 괴롭힘 및 성희롱 무관용 원칙 (Zero Tolerance)\n- 육체적, 언어적, 시각적 성희롱 행위를 엄격히 금지합니다.\n- 지위를 이용해 업무상 적정 범위를 넘어 고통을 주거나 근무 환경을 악화시키는 '직장 내 괴롭힘' 발생 시, 신고 센터(익명)를 통해 즉각 조사 및 중징계(해고 포함) 처리합니다.\n\n## 3. 이해상충 방지\n- 직무와 관련하여 협력업체나 이해관계자로부터 일체의 금품, 접대, 향응을 요구하거나 제공받을 수 없습니다. (명절 선물 포함)\n- 본인 또는 가족이 회사의 이익과 상충되는 비즈니스를 운영하거나 투자하는 행위를 금지합니다.\n\n우리는 투명하고 건강한 조직 문화를 함께 만들어갑니다." },
      ],
    },
  ],
};

const ALL_PAGES = HR_TREE.folders.flatMap(f => f.pages);

/* ── Triple graph data ─────────────────────────────────────────────────── */
// Nodes: id, label, type (doc|concept|policy|system|person), x, y
const GRAPH_NODES = [
  { id: 'n-doc',      label: '연차 사용 가이드',    type: 'doc',     x: 390, y: 235 },
  { id: 'n-newbie',   label: '신규입사자',           type: 'person',  x: 230, y: 110 },
  { id: 'n-regular',  label: '정규직 직원',          type: 'person',  x: 560, y: 110 },
  { id: 'n-leave',    label: '연차',                 type: 'concept', x: 100, y: 235 },
  { id: 'n-workflow', label: 'Workflow 시스템',       type: 'system',  x: 640, y: 235 },
  { id: 'n-mgr',      label: '팀장',                 type: 'person',  x: 640, y: 360 },
  { id: 'n-hr',       label: 'HR 정책',              type: 'policy',  x: 390, y: 390 },
  { id: 'n-rule',     label: '취업규칙',             type: 'doc',     x: 150, y: 380 },
  { id: 'n-condol',   label: '경조사 휴가 정책',     type: 'doc',     x: 200, y: 390 },
];

// Triples: subject → predicate → object
const GRAPH_EDGES = [
  { s: 'n-doc',      p: '적용 대상',    o: 'n-newbie'   },
  { s: 'n-doc',      p: '적용 대상',    o: 'n-regular'  },
  { s: 'n-doc',      p: '참조 정책',    o: 'n-hr'       },
  { s: 'n-doc',      p: '법적 근거',    o: 'n-rule'     },
  { s: 'n-doc',      p: '관련 정책',    o: 'n-condol'   },
  { s: 'n-newbie',   p: '월 1일 발생',  o: 'n-leave'    },
  { s: 'n-newbie',   p: '신청 시스템',  o: 'n-workflow' },
  { s: 'n-workflow', p: '승인권자',     o: 'n-mgr'      },
  { s: 'n-regular',  p: '연 15일 부여', o: 'n-leave'    },
];

const NODE_INFO = {
  'n-doc': {
    type: 'doc', label: '연차 사용 가이드',
    desc: 'AI가 Slack HR봇 답변을 기반으로 자동 생성한 공식 문서예요.',
    source: 'Slack · HR봇', updated: '방금 전',
    inputs:  ['HR 정책', '취업규칙', 'Slack 답변'],
    outputs: ['챗봇 답변', '신규입사자 안내'],
    related: ['경조사 휴가 정책', '재택근무 가이드라인'],
    triples: ['연차 사용 가이드 → 적용 대상 → 신규입사자', '연차 사용 가이드 → 참조 정책 → HR 정책'],
  },
  'n-newbie': {
    type: 'person', label: '신규입사자',
    desc: '입사 1년 미만의 직원을 의미해요. 연차 정책에서 별도 규정이 적용돼요.',
    source: '취업규칙 §14',
    inputs:  ['채용 확정', '입사일'],
    outputs: ['월 1일 연차', '온보딩 프로세스'],
    related: ['신입사원 온보딩 체크리스트', '수습기간 평가 기준'],
    triples: ['신규입사자 → 월 1일 발생 → 연차', '신규입사자 → 신청 시스템 → Workflow 시스템'],
  },
  'n-regular': {
    type: 'person', label: '정규직 직원',
    desc: '입사 1년 이상의 정규직 직원이에요. 연 15일의 기본 연차가 부여돼요.',
    source: '취업규칙 §15',
    inputs:  ['1년 근속'],
    outputs: ['연 15일 연차'],
    related: ['취업규칙', '급여 지급 일정'],
    triples: ['정규직 직원 → 연 15일 부여 → 연차'],
  },
  'n-leave': {
    type: 'concept', label: '연차',
    desc: '근로기준법에 따른 유급 휴가 제도예요. 발생 즉시 사용 가능해요.',
    source: '근로기준법 §60',
    inputs:  ['근속 기간'],
    outputs: ['유급 휴가', '반차 (4시간)'],
    related: ['경조사 휴가 정책'],
    triples: ['신규입사자 → 월 1일 발생 → 연차', '정규직 직원 → 연 15일 부여 → 연차'],
  },
  'n-workflow': {
    type: 'system', label: 'Workflow 시스템',
    desc: '사내 업무 자동화 시스템이에요. 연차 신청 및 승인 프로세스를 처리해요.',
    source: 'IT 시스템',
    inputs:  ['연차 신청서', '직원 정보'],
    outputs: ['팀장 알림', '승인 결과', '일정 자동 등록'],
    related: ['재택근무 가이드라인'],
    triples: ['신규입사자 → 신청 시스템 → Workflow 시스템', 'Workflow 시스템 → 승인권자 → 팀장'],
  },
  'n-mgr': {
    type: 'person', label: '팀장',
    desc: '연차 신청의 1차 승인권자예요. Workflow 시스템에서 알림을 받아요.',
    source: '조직 규정',
    inputs:  ['Workflow 알림'],
    outputs: ['승인 또는 반려'],
    related: ['취업규칙'],
    triples: ['Workflow 시스템 → 승인권자 → 팀장'],
  },
  'n-hr': {
    type: 'policy', label: 'HR 정책',
    desc: '인사팀이 운영하는 내부 정책 체계예요. 연차 외 다양한 복지 정책을 포함해요.',
    source: 'HR 내부 문서',
    inputs:  ['법령', '경영 방침'],
    outputs: ['각종 HR 규정'],
    related: ['취업규칙', '복리후생 안내'],
    triples: ['연차 사용 가이드 → 참조 정책 → HR 정책'],
  },
  'n-rule': {
    type: 'doc', label: '취업규칙',
    desc: '고용노동부에 신고된 사내 근로 규정의 최상위 문서예요.',
    source: '법무팀',
    inputs:  ['근로기준법'],
    outputs: ['각종 내부 규정'],
    related: ['행동강령', 'HR 정책'],
    triples: ['연차 사용 가이드 → 법적 근거 → 취업규칙'],
  },
  'n-condol': {
    type: 'doc', label: '경조사 휴가 정책',
    desc: '결혼, 출산, 장례 등 경조사 시 부여되는 특별 휴가 규정이에요.',
    source: 'HR 내부 문서',
    inputs:  ['경조사 신청서'],
    outputs: ['특별 휴가 부여'],
    related: ['연차 사용 가이드'],
    triples: ['연차 사용 가이드 → 관련 정책 → 경조사 휴가 정책'],
  },
};

const NODE_TYPE_STYLE = {
  doc:     { bg: N.blueBg,   border: N.blueTxt,  fg: N.blueTxt,  label: '문서',  r: 6 },
  concept: { bg: N.greenBg,  border: N.teal,     fg: N.teal,     label: '개념',  r: 9999 },
  policy:  { bg: N.orangeBg, border: N.orange,   fg: N.orange,   label: '정책',  r: 4 },
  system:  { bg: N.bgWarm,   border: N.inkSub,   fg: N.inkSub,   label: '시스템',r: 4 },
  person:  { bg: '#faf0ff',  border: '#7c3aed',  fg: '#7c3aed',  label: '사람',  r: 9999 },
};

/* ── History / diff data ──────────────────────────────────────────────── */
const HISTORY = [
  {
    id: 'h1', when: '방금 전 (현재)', ago: '방금',
    who: 'ai', whoLabel: 'Wekiflow AI', kind: 'create',
    target: '연차 사용 가이드', blockCount: 8, isCurrent: true,
    diff: [
      { type: 'add', content: '# 연차 사용 가이드' },
      { type: 'add', content: '' },
      { type: 'add', content: '## 신규 입사자 연차' },
      { type: 'add', content: '입사 1년 미만 직원은 **매월 1일씩** 연차가 발생하며, 발생 즉시 사용할 수 있어요.' },
      { type: 'add', content: '1년 이상 근속 시 연 15일이 일괄 부여돼요.' },
      { type: 'add', content: '' },
      { type: 'add', content: '## 연차 신청 방법' },
      { type: 'add', content: '1. Workflow 시스템에 접속해요.' },
      { type: 'add', content: '2. "휴가 신청" 메뉴에서 날짜를 선택해요.' },
      { type: 'add', content: '3. 팀장 승인 후 자동으로 일정에 반영돼요.' },
    ],
    summary: '연차 사용 가이드 신규 생성 (Slack HR봇 답변 기반)',
  },
  {
    id: 'h2', when: '4시간 전', ago: '4시간',
    who: 'user', whoLabel: '정다영', kind: 'edit',
    target: '채용 프로세스 가이드', blockCount: 3,
    diff: [
      { type: 'ctx',  content: '## 수습기간' },
      { type: 'del',  content: '수습기간은 입사일로부터 **3개월**입니다.' },
      { type: 'add',  content: '수습기간은 입사일로부터 **2개월**입니다.' },
      { type: 'ctx',  content: '' },
      { type: 'ctx',  content: '수습 종료 2주 전 평가를 진행합니다.' },
      { type: 'del',  content: '평가 기준은 팀장이 결정합니다.' },
      { type: 'add',  content: '평가 기준은 HR팀과 팀장이 협의하여 결정합니다.' },
      { type: 'add',  content: '세부 기준은 수습기간 평가 기준 문서를 참고해요.' },
    ],
    summary: '수습기간 3개월 → 2개월 변경, 평가 기준 협의 주체 명확화',
  },
  {
    id: 'h3', when: '어제', ago: '어제',
    who: 'user', whoLabel: '정다영', kind: 'edit',
    target: '복리후생 안내', blockCount: 5,
    diff: [
      { type: 'ctx',  content: '## 건강 지원' },
      { type: 'ctx',  content: '매년 종합건강검진을 지원해요.' },
      { type: 'add',  content: '' },
      { type: 'add',  content: '## 사내 의료비 지원 (신설)' },
      { type: 'add',  content: '직원 본인 의료비의 50%, 연 100만원 한도로 지원해요.' },
      { type: 'add',  content: '- 대상: 정규직 1년 이상 근속 직원' },
      { type: 'add',  content: '- 신청: 영수증 제출 후 익월 급여일 지급' },
    ],
    summary: '사내 의료비 지원 제도 신설 (50%, 연 100만원)',
  },
  {
    id: 'h4', when: '2주 전', ago: '2주',
    who: 'user', whoLabel: '이지수', kind: 'edit',
    target: '취업규칙', blockCount: 12,
    diff: [
      { type: 'ctx',  content: '## 제22조 (재택근무)' },
      { type: 'del',  content: '재택근무에 관한 사항은 추후 공지합니다.' },
      { type: 'add',  content: '재택근무는 팀장 승인 후 주 2회까지 허용합니다.' },
      { type: 'add',  content: '재택근무일에도 코어타임(10:00–16:00)은 온라인 접속을 유지해야 합니다.' },
      { type: 'add',  content: '세부 사항은 재택근무 가이드라인을 따릅니다.' },
    ],
    summary: '취업규칙 §22 재택근무 조항 신설',
  },
  {
    id: 'h5', when: '1달 전', ago: '1달',
    who: 'ai', whoLabel: 'Wekiflow AI', kind: 'create',
    target: '에이전트 빌더 가이드', blockCount: 175,
    diff: [
      { type: 'add', content: '# 에이전트 빌더 가이드' },
      { type: 'add', content: '코딩 없이 AI 에이전트를 만드는 방법을 안내해요.' },
      { type: 'add', content: '... (175개 항목)' },
    ],
    summary: '에이전트 빌더 가이드 자동 등록 (175 항목)',
  },
];

/* ── Learnings ─────────────────────────────────────────────────────────── */
const LEARNINGS = [
  {
    id: 'l1', status: 'auto', accuracy: 97,
    title: '연차 사용 가이드',
    source: 'slack', sourceLabel: 'Slack · HR봇',
    when: '방금 전', isNew: true,
    summary: 'Slack에서 HR봇이 답변한 연차 정책 내용이 새 문서로 자동 등록됐어요.',
    before: null,
    after: '# 연차 사용 가이드\n\n## 신규 입사자 연차\n입사 1년 미만 직원은 **매월 1일씩** 연차가 발생해요.\n\n## 연차 신청 방법\n1. Workflow 시스템에 접속해요.\n2. "휴가 신청" 에서 날짜를 선택해요.\n3. 팀장 승인 후 자동 반영돼요.',
    aiNote: '기존 문서와 일치하는 내용이 없어 새 문서로 등록했어요. 연차·휴가·신청 방법이 처음 등장한 주제예요.',
    pageId: 'p-leave',
  },
  {
    id: 'l2', status: 'check', accuracy: 76,
    title: '챗봇 빌더 가이드 업데이트',
    source: 'url', sourceLabel: '웹 페이지',
    when: '6시간 전',
    summary: '기존 문서와 내용이 겹쳐요. 새 내용을 덮어쓸지 합칠지 확인해주세요.',
    before: '챗봇 이름과 설명을 자유롭게 작성하세요.',
    after: '챗봇 이름과 설명을 자유롭게 작성하세요. **이름은 최대 30자, 설명은 200자**까지 입력할 수 있어요.',
    aiNote: '기존 문서와 87% 일치하지만, 글자 수 제한이라는 새 정보가 추가됐어요.',
    pageId: 'p-onboard',
  },
];

/* =========================================================================
   PRIMITIVES — Notion style
   ========================================================================= */
function NBtn({ children, variant = 'ghost', size = 'md', onClick, disabled, full, className = '' }) {
  const vs = {
    primary:  { bg: N.blue,     fg: '#fff',         hov: N.blueHov,           bd: 'transparent' },
    teal:     { bg: N.teal,     fg: '#fff',         hov: '#208e8a',            bd: 'transparent' },
    outline:  { bg: 'transparent', fg: N.ink,       hov: N.bgWarm,             bd: N.border },
    ghost:    { bg: 'transparent', fg: N.inkSub,    hov: N.bgWarm,             bd: 'transparent' },
    danger:   { bg: 'transparent', fg: N.orange,    hov: N.orangeBg,           bd: 'transparent' },
    subtle:   { bg: 'rgba(0,0,0,0.05)', fg: N.ink,  hov: 'rgba(0,0,0,0.08)',  bd: 'transparent' },
  }[variant];
  const pads = { sm: '4px 10px', md: '7px 14px', lg: '9px 20px' };
  const fss  = { sm: 12, md: 13.5, lg: 14 };
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`nf ${full ? 'w-full justify-center' : ''} ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
        padding: pads[size], fontSize: fss[size], fontWeight: 600,
        color: vs.fg, background: vs.bg, border: `1px solid ${vs.bd}`,
        borderRadius: 4, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? .5 : 1,
        transition: 'background .12s, color .12s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = vs.hov; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = vs.bg; }}
    >
      {children}
    </button>
  );
}

function NBadge({ children, color = 'blue', size = 'md' }) {
  const cs = {
    blue:   { bg: N.blueBg,   fg: N.blueTxt  },
    green:  { bg: N.greenBg,  fg: N.teal     },
    teal:   { bg: N.tealBg,   fg: N.teal     },
    orange: { bg: N.orangeBg, fg: N.orange   },
    warm:   { bg: N.bgWarm,   fg: N.inkSub   },
    purple: { bg: '#faf0ff',  fg: '#7c3aed'  },
  }[color] || { bg: N.bgWarm, fg: N.inkSub };
  return (
    <span className="nf" style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'sm' ? '2px 7px' : '3px 9px',
      fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, letterSpacing: '.08px',
      background: cs.bg, color: cs.fg, borderRadius: 9999,
      border: `1px solid ${cs.bg}`, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function NLabel({ children }) {
  return (
    <div className="nf" style={{ fontSize: 11.5, fontWeight: 600, color: N.inkMute, letterSpacing: '.1em', textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}

function Divider({ my = 16 }) {
  return <div style={{ height: 1, background: N.border, margin: `${my}px 0` }} />;
}

/* =========================================================================
   SIDEBAR
   ========================================================================= */
function Sidebar({ view, setView, openPage, currentPageId, openFolder, currentFolderId, openNewPage }) {
  const [folderState, setFolderState] = useState(() =>
    Object.fromEntries(HR_TREE.folders.map(f => [f.id, f.open]))
  );
  const toggleFolder = (id) => setFolderState(s => ({ ...s, [id]: !s[id] }));

  const menu = [
    { key: 'home',  Icon: Home,          label: '대시보드' },
    { key: 'learn', Icon: GraduationCap, label: '신규 지식', badge: 1 },
    { key: 'wiki',  Icon: BookOpen,       label: '전사 위키' },
    { key: 'teach', Icon: PlusCircle,     label: '지식 등록하기' },
    { key: 'log',   Icon: ClipogramList,  label: '학습 기록' },
  ];

  return (
    <aside className="nf" style={{
      width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%',
      background: N.bgWarm, borderRight: bd,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: N.ink, letterSpacing: '-.5px' }}>Wekiflow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, cursor: 'pointer' }}>
          <div style={{ width: 18, height: 18, borderRadius: 3, background: N.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>V</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: N.ink }}>글로벌벨루가 HR Wiki</span>
          <ChevronDown size={11} color={N.inkMute} style={{ marginLeft: 'auto' }} />
        </div>
      </div>

      <nav style={{ padding: '0 8px' }}>
        {menu.map(({ key, Icon, label, badge }) => {
          const Icon2 = Icon === ClipogramList ? ClipboardList : Icon;
          const active = view === key || (view === 'page' && key === 'wiki');
          return (
            <SidebarItem key={key} active={active} onClick={() => setView(key)}>
              <Icon2 size={14} strokeWidth={1.8} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && <span style={{ fontSize: 11, fontWeight: 700, background: N.teal, color: '#fff', borderRadius: 9999, padding: '1px 6px' }}>{badge}</span>}
            </SidebarItem>
          );
        })}
        <SidebarItem active={view === 'system'} onClick={() => setView('system')} muted>
          <Settings2 size={13} strokeWidth={1.7} />
          <span style={{ flex: 1 }}>시스템 상태</span>
          <span className="aBL" style={{ width: 5, height: 5, borderRadius: '50%', background: N.teal, display: 'inline-block' }} />
        </SidebarItem>
      </nav>

      <Divider my={10} />

      {/* Tree */}
      <div className="sy" style={{ flex: 1, padding: '0 8px', overflow: 'auto' }}>
        <div style={{ padding: '2px 8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NLabel>문서 목록</NLabel>
          <button onClick={() => openNewPage()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 3 }} title="새 문서" onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <Plus size={11} color={N.inkMute} />
          </button>
        </div>
        {HR_TREE.folders.map(folder => {
          const FolderIcon = folder.icon;
          return (
            <div key={folder.id}>
              <button
                onClick={() => { toggleFolder(folder.id); openFolder(folder.id); }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, width: '100%', padding: '4px 8px', borderRadius: 4, background: currentFolderId === folder.id && view === 'folder' ? 'rgba(0,0,0,0.06)' : 'none', border: 'none', cursor: 'pointer', color: N.ink, fontSize: 12.5, fontWeight: currentFolderId === folder.id && view === 'folder' ? 600 : 500 }}
                onMouseEnter={e => { if (!(currentFolderId === folder.id && view === 'folder')) e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
                onMouseLeave={e => { if (!(currentFolderId === folder.id && view === 'folder')) e.currentTarget.style.background = 'none' }}
              >
                {folderState[folder.id] ? <ChevronDown size={10} color={N.inkMute} /> : <ChevronRight size={10} color={N.inkMute} />}
                <FolderIcon size={12} color={N.inkSub} strokeWidth={1.6} />
                <span>{folder.label}</span>
              </button>
              {folderState[folder.id] && (
                <div style={{ paddingLeft: 12, borderLeft: bd, marginLeft: 14 }}>
                  {folder.pages.map(p => (
                    <button key={p.id} onClick={() => openPage(p.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, width: '100%', padding: '4px 8px', borderRadius: 4, background: currentPageId === p.id && view === 'page' ? 'rgba(0,0,0,0.06)' : 'none', border: 'none', cursor: 'pointer', color: N.ink, fontSize: 12, fontWeight: currentPageId === p.id && view === 'page' ? 600 : 400 }}
                      onMouseEnter={e => { if (!(currentPageId === p.id && view === 'page')) e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                      onMouseLeave={e => { if (!(currentPageId === p.id && view === 'page')) e.currentTarget.style.background = 'none'; }}
                    >
                      <FileText size={11} strokeWidth={1.5} color={N.inkMute} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                      {p.isNew && <span className="aBL" style={{ width: 5, height: 5, borderRadius: '50%', background: N.teal, flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User */}
      <div style={{ padding: '10px 14px', borderTop: bd, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: N.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>다</span>
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: N.ink }}>정다영</div>
          <div style={{ fontSize: 11, color: N.inkMute }}>HR · 편집자</div>
        </div>
        <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut size={12} color={N.inkMute} />
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ children, active, onClick, muted }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', gap: 7, width: '100%',
      padding: '6px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
      background: active ? 'rgba(0,0,0,0.07)' : 'none',
      color: muted ? N.inkSub : N.ink,
      fontSize: 13.5, fontWeight: active ? 600 : 500, marginBottom: 1,
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(0,0,0,0.07)' : 'none'; }}
    >
      {children}
    </button>
  );
}

// Fix reference
const ClipogramList = ClipboardList;

/* =========================================================================
   TOP BAR
   ========================================================================= */
function TopBar({ crumbs, openPage }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const searchResults = query.trim().length > 0 ? ALL_PAGES.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    (p.content && p.content.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  return (
    <div className="nf" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 28px', borderBottom: bd, background: N.bg, flexShrink: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span style={{ fontSize: 13, color: i === crumbs.length - 1 ? N.ink : N.inkMute, fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>{c}</span>
            {i < crumbs.length - 1 && <ChevronRight size={11} color={N.inkMute} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRadius: 4, border: isFocused ? `1px solid ${N.blue}` : bd, background: N.bg, transition: 'border 0.2s', height: 28, boxSizing: 'border-box' }}>
            <Search size={12} color={isFocused ? N.blue : N.inkMute} />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="HR Wiki 검색…"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, color: N.ink, width: 140 }}
            />
            {!isFocused && !query && <span className="nm" style={{ fontSize: 10, color: N.inkMute, background: N.bgWarm, border: bd, borderRadius: 3, padding: '1px 5px' }}>⌘K</span>}
          </div>
          {isFocused && query && (
            <div className="aFI" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 360, background: N.bg, border: bd, borderRadius: 8, boxShadow: N.deep, zIndex: 100, maxHeight: 400, overflowY: 'auto' }}>
              {searchResults.length > 0 ? (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ padding: '0 16px', fontSize: 11, fontWeight: 600, color: N.inkMute, marginBottom: 4 }}>검색 결과 {searchResults.length}건</div>
                  {searchResults.map(p => (
                    <div key={p.id} onClick={() => { openPage(p.id); setQuery(''); setIsFocused(false); }} style={{ padding: '8px 16px', cursor: 'pointer', borderBottom: `1px solid ${N.bgWarm}` }} onMouseEnter={e => e.currentTarget.style.background = N.bgWarm} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: N.ink, marginBottom: 2 }}>{p.title}</div>
                      {p.content && (
                        <div style={{ fontSize: 11.5, color: N.inkSub, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>
                          {p.content.replace(/#/g, '').substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: N.inkSub }}>결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: N.teal, fontWeight: 500 }}>
          <span className="aBL" style={{ width: 6, height: 6, borderRadius: '50%', background: N.teal, display: 'inline-block' }} />
          정상 운영 중
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HOME VIEW
   ========================================================================= */
function HomeView({ gotoLearn, openPage }) {
  const totalPages = HR_TREE.folders.reduce((a, f) => a + f.pages.length, 0);
  return (
    <div className="nf sy" style={{ flex: 1, background: N.bg, padding: '44px 48px 64px', overflowY: 'auto' }}>
      <div className="aFI" style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: N.ink, letterSpacing: '-1px', marginBottom: 8 }}>
          안녕하세요, 정다영님. 👋
        </h1>
        <p style={{ fontSize: 15.5, color: N.inkSub, lineHeight: 1.6 }}>
          챗봇이 오늘 <strong style={{ color: N.teal }}>1가지</strong>를 새로 배웠어요. 확인이 필요한 내용도 있어요.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        <HomeCard icon={<CheckCircle2 size={20} color={N.teal} />} title="AI가 자동으로 배웠어요" count="1건" sub="방금 전 · Slack에서" cta="내용 확인하기" onClick={gotoLearn} color={N.tealBg} accent={N.teal} delay="0ms" />
        <HomeCard icon={<AlertTriangle size={20} color={N.orange} />} title="확인이 필요해요" count="1건" sub="6시간 전 · 웹 페이지에서" cta="지금 확인하기" onClick={gotoLearn} color={N.orangeBg} accent={N.orange} delay="60ms" />
      </div>
      <div className="aFI" style={{ animationDelay: '100ms', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <NLabel>위키 현황</NLabel>
          <NBadge color="warm">{totalPages}개 문서</NBadge>
        </div>
        <div style={{ border: bd, borderRadius: 8, overflow: 'hidden', boxShadow: N.card }}>
          {HR_TREE.folders.map((folder, fi) => {
            const FIcon = folder.icon;
            return (
              <div key={folder.id}>
                <div style={{ padding: '10px 18px', background: N.bgWarm, borderTop: fi === 0 ? 'none' : bd, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <FIcon size={13} color={N.inkSub} strokeWidth={1.6} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: N.inkSub }}>{folder.label}</span>
                  <NBadge color="warm" size="sm">{folder.pages.length}</NBadge>
                </div>
                {folder.pages.map(p => (
                  <button key={p.id} onClick={() => openPage(p.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 20px 11px 32px',
                    background: N.bg, border: 'none', cursor: 'pointer', borderTop: bd, textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = N.bgWarm}
                  onMouseLeave={e => e.currentTarget.style.background = N.bg}
                  >
                    <FileText size={13} color={N.inkMute} strokeWidth={1.5} />
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: N.ink, flex: 1 }}>{p.title}</span>
                    {p.isNew && <NBadge color="teal" size="sm"><Sparkles size={9} />방금 학습됨</NBadge>}
                    {p.source === 'ai' && !p.isNew && <NBadge color="blue" size="sm"><Bot size={9} />AI 자동</NBadge>}
                    <span style={{ fontSize: 12, color: N.inkMute, fontFamily: 'Fira Code' }}>{p.updated}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HomeCard({ icon, title, count, sub, cta, onClick, color, accent, delay }) {
  return (
    <div className="aFI" onClick={onClick} style={{
      padding: '20px 22px', borderRadius: 8, background: color, border: `1.5px solid ${accent}`,
      cursor: 'pointer', animationDelay: delay, boxShadow: N.card, transition: 'transform .15s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>{icon}<ChevronRight size={14} color={N.inkSub} /></div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: N.inkSub, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: N.ink, letterSpacing: '-.5px', lineHeight: 1, marginBottom: 5 }}>{count}</div>
      <div style={{ fontSize: 12, color: N.inkSub, marginBottom: 16 }}>{sub}</div>
      <NBtn variant="outline" size="sm" onClick={onClick}>{cta} <ArrowRight size={11} /></NBtn>
    </div>
  );
}

/* =========================================================================
   LEARN VIEW
   ========================================================================= */
function LearnView({ openPage }) {
  const [sel, setSel] = useState('l1');
  const detail = LEARNINGS.find(l => l.id === sel);
  return (
    <div className="nf" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: N.bg, overflow: 'hidden' }}>
      <div style={{ padding: '28px 36px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: N.ink, letterSpacing: '-.6px', marginBottom: 5 }}>신규 지식</h1>
        <p style={{ fontSize: 13.5, color: N.inkSub, marginBottom: 20 }}>챗봇이 새로 배울 내용이에요. AI가 자동 처리한 것도 언제든 되돌릴 수 있어요.</p>
        <div style={{ display: 'flex', gap: 2, borderBottom: bd }}>
          {[['전체', LEARNINGS.length], ['확인 필요', 1], ['처리 실패', 0]].map(([l, c]) => (
            <button key={l} style={{ padding: '7px 16px 9px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'none', color: l === '전체' ? N.ink : N.inkMute, borderBottom: l === '전체' ? `2px solid ${N.ink}` : '2px solid transparent', marginBottom: -1 }}>
              {l} <span style={{ fontSize: 11, color: N.inkMute, marginLeft: 4, fontFamily: 'Fira Code' }}>{c}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', overflow: 'hidden' }}>
        <div className="sy" style={{ borderRight: bd, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LEARNINGS.map((item, i) => (
            <LearnCard key={item.id} item={item} selected={sel === item.id} onClick={() => setSel(item.id)} delay={`${i*40}ms`} />
          ))}
        </div>
        <div className="sy" style={{ padding: '28px 32px' }}>
          {detail && <LearnDetail item={detail} openPage={openPage} />}
        </div>
      </div>
    </div>
  );
}

function LearnCard({ item, selected, onClick, delay }) {
  const statusMap = {
    auto:  { badge: <NBadge color="teal" size="sm"><Bot size={9} />AI 자동 학습</NBadge> },
    check: { badge: <NBadge color="orange" size="sm"><AlertTriangle size={9} />확인 필요</NBadge> },
    fail:  { badge: <NBadge color="orange" size="sm"><XCircle size={9} />처리 실패</NBadge> },
  };
  return (
    <button onClick={onClick} className={`nf aFI`} style={{
      textAlign: 'left', border: `1px solid ${selected ? N.blue : N.border}`, borderRadius: 8, padding: '14px 15px', cursor: 'pointer', background: N.bg, animationDelay: delay,
      boxShadow: selected ? `0 0 0 2px ${N.blueBg}, ${N.card}` : N.card, transition: 'box-shadow .15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {statusMap[item.status].badge}
        <span className="nm" style={{ fontSize: 10.5, color: N.inkMute }}>{item.accuracy > 0 ? `${item.accuracy}%` : '—'}</span>
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: N.ink, marginBottom: 5, lineHeight: 1.4 }}>{item.title}</div>
      <p style={{ fontSize: 12.5, color: N.inkSub, lineHeight: 1.55, marginBottom: 10 }}>{item.summary}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: N.inkMute }}>
        <Send size={10} /><span>{item.sourceLabel}</span>
        <span>·</span><span>{item.when}</span>
        {item.isNew && <><span>·</span><span style={{ color: N.teal, fontWeight: 600 }}>방금 도착</span></>}
      </div>
    </button>
  );
}

function LearnDetail({ item, openPage }) {
  return (
    <div className="nf aFI">
      <h2 style={{ fontSize: 24, fontWeight: 700, color: N.ink, letterSpacing: '-.4px', marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {item.status === 'auto' ? <NBadge color="teal"><Bot size={9} />AI 자동 학습</NBadge> : <NBadge color="orange"><AlertTriangle size={9} />확인 필요</NBadge>}
        <NBadge color="warm"><Send size={9} />{item.sourceLabel}</NBadge>
        <span style={{ fontSize: 12, color: N.inkMute, alignSelf: 'center' }}>{item.when}</span>
      </div>
      <div style={{ borderRadius: 6, padding: '14px 16px', background: N.bgWarm, border: bd, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Sparkles size={13} color={N.blue} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: N.blue, textTransform: 'uppercase', letterSpacing: '.1em' }}>챗봇의 판단 이유</span>
        </div>
        <p style={{ fontSize: 13.5, color: N.ink, lineHeight: 1.65 }}>{item.aiNote}</p>
      </div>
      {(item.before || item.after) && (
        <div style={{ marginBottom: 20 }}>
          <NLabel style={{ marginBottom: 10 }}>변경 내용</NLabel>
          <div style={{ marginTop: 10, borderRadius: 6, overflow: 'hidden', border: bd }}>
            {item.before && (
              <div style={{ padding: '12px 14px', background: '#fff5f5', borderBottom: bd }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="nm" style={{ color: '#dc2626', fontSize: 11, flexShrink: 0 }}>−</span>
                  <p className="nm" style={{ fontSize: 12.5, color: N.inkSub, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.before}</p>
                </div>
              </div>
            )}
            {item.after && (
              <div style={{ padding: '12px 14px', background: '#f0faf3' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="nm" style={{ color: N.teal, fontSize: 11, flexShrink: 0 }}>+</span>
                  <p className="nm" style={{ fontSize: 12.5, color: N.ink, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.after}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {item.status === 'auto' && <>
          {item.pageId && <NBtn variant="outline" onClick={() => openPage(item.pageId)}>위키에서 보기</NBtn>}
          <NBtn variant="ghost"><RotateCcw size={12} />되돌리기</NBtn>
        </>}
        {item.status === 'check' && <>
          <NBtn variant="teal"><Check size={13} />챗봇에게 가르치기</NBtn>
          <NBtn variant="outline"><Edit3 size={12} />수정 후 가르치기</NBtn>
          <NBtn variant="ghost">건너뛰기</NBtn>
        </>}
      </div>
    </div>
  );
}

/* =========================================================================
   WIKI LIST VIEW
   ========================================================================= */
function WikiView({ openPage, openNewPage }) {
  return (
    <div className="nf sy" style={{ flex: 1, background: N.bg, padding: '40px 48px 64px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: N.ink, letterSpacing: '-.6px', marginBottom: 5 }}>전사 위키</h1>
          <p style={{ fontSize: 13.5, color: N.inkSub }}>챗봇이 답변에 활용하는 모든 문서예요.</p>
        </div>
        <NBtn variant="primary" onClick={openNewPage}><Plus size={14} />새 문서 만들기</NBtn>
      </div>
      {HR_TREE.folders.map(folder => {
        const FIcon = folder.icon;
        return (
          <div key={folder.id} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <FIcon size={15} color={N.inkSub} strokeWidth={1.7} />
              <span style={{ fontSize: 15, fontWeight: 700, color: N.ink, letterSpacing: '-.2px' }}>{folder.label}</span>
              <NBadge color="warm" size="sm">{folder.pages.length}</NBadge>
            </div>
            <div style={{ border: bd, borderRadius: 8, overflow: 'hidden', boxShadow: N.card }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 150px', padding: '8px 18px', background: N.bgWarm }}>
                {['제목', '챗봇 반영', '등록 방법', '최근 변경'].map(h => <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: N.inkMute, letterSpacing: '.08em' }}>{h}</span>)}
              </div>
              {folder.pages.map((p, i) => (
                <button key={p.id} onClick={() => openPage(p.id)} style={{
                  display: 'grid', gridTemplateColumns: '1fr 130px 110px 150px', alignItems: 'center',
                  padding: '13px 18px', width: '100%', background: N.bg, border: 'none', cursor: 'pointer', borderTop: bd, textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = N.bgWarm}
                onMouseLeave={e => e.currentTarget.style.background = N.bg}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={13} color={N.inkMute} strokeWidth={1.5} />
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: N.ink }}>{p.title}</span>
                    {p.isNew && <NBadge color="teal" size="sm"><Sparkles size={9} />방금</NBadge>}
                  </span>
                  <span>{p.status === 'active' ? <NBadge color="teal" size="sm"><CheckCircle2 size={9} />반영됨</NBadge> : <NBadge color="orange" size="sm"><Clock size={9} />작성 중</NBadge>}</span>
                  <span>{p.source === 'ai' ? <NBadge color="blue" size="sm"><Bot size={9} />AI 자동</NBadge> : <NBadge color="warm" size="sm">직접 작성</NBadge>}</span>
                  <span className="nm" style={{ fontSize: 12, color: N.inkMute }}>{p.updated}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================================
   PAGE EDITOR
   ========================================================================= */
function PageEditorView({ page, panel, setPanel }) {
  const [mode, setMode] = useState('block');
  const [panelWidth, setPanelWidth] = useState(480);
  return (
    <div className="nf" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: N.bg, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 24px', borderBottom: bd, flexShrink: 0, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: N.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.title}</span>
        {page.isNew && <NBadge color="teal"><Bot size={9} />AI 자동 등록</NBadge>}
        <div style={{ display: 'flex', border: bd, borderRadius: 4, overflow: 'hidden' }}>
          {['block','source'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '5px 13px', fontSize: 12.5, fontWeight: 600, border: 'none', cursor: 'pointer', background: mode === m ? N.ink : 'none', color: mode === m ? '#fff' : N.inkSub }}>
              {m === 'block' ? '편집' : '소스'}
            </button>
          ))}
        </div>
        <NBtn variant={panel === 'graph' ? 'subtle' : 'ghost'} size="sm" onClick={() => setPanel(panel === 'graph' ? null : 'graph')}><Network size={12} />연결 관계</NBtn>
        <NBtn variant={panel === 'hist' ? 'subtle' : 'ghost'} size="sm" onClick={() => setPanel(panel === 'hist' ? null : 'hist')}><History size={12} />변경 기록</NBtn>
        <div style={{ width: 1, height: 18, background: N.border }} />
        <span style={{ fontSize: 12, color: N.teal, fontWeight: 500 }}>● 저장됨</span>
        <NBtn variant="ghost" size="sm"><RotateCcw size={11} />다시 정리</NBtn>
        <NBtn variant="primary" size="sm"><Send size={11} />챗봇에 반영</NBtn>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className="sy" style={{ flex: 1, overflowY: 'auto' }}>
          {mode === 'block' ? <BlockContent page={page} /> : <SourceContent page={page} />}
        </div>
        {panel && (
          <>
            <div 
              style={{ width: 4, cursor: 'col-resize', background: 'transparent', flexShrink: 0, zIndex: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = N.border}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onMouseDown={e => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = panelWidth;
                const onMouseMove = moveEvent => {
                  const newWidth = startWidth - (moveEvent.clientX - startX);
                  if (newWidth > 300 && newWidth < 800) setPanelWidth(newWidth);
                };
                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
            />
            <div style={{ width: panelWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: bd }}>
              {panel === 'graph' && <TripleGraphPanel onClose={() => setPanel(null)} pageId={page.id} />}
              {panel === 'hist'  && <HistPanel onClose={() => setPanel(null)} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BlockContent({ page }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 52px 80px' }}>
      <h1 style={{ fontSize: 40, fontWeight: 700, color: N.ink, letterSpacing: '-1px', marginBottom: 36, lineHeight: 1.15 }}>{page.title}</h1>
      {page.isNew && page.source === 'ai' && (
        <div style={{ borderRadius: 6, padding: '16px 18px', background: N.tealBg, border: `1px solid ${N.teal}22`, marginBottom: 28 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: N.teal, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Bot size={12} /> AI가 Slack에서 자동으로 학습했어요 · 방금 전
          </div>
        </div>
      )}
      <div className="md-content" style={{ fontSize: 15, color: N.ink, lineHeight: 1.75 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {page.content || '이 문서의 내용을 작성해주세요.'}
        </ReactMarkdown>
      </div>
      <div style={{ marginTop: 48, paddingTop: 20, borderTop: bd, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: N.inkMute }}>
        {page.source === 'ai' ? <Bot size={13} color={N.blue} /> : <Users size={13} color={N.teal} />}
        <span>{page.source === 'ai' ? 'Slack에서 자동 등록됨 · 잘못된 내용이 있으면 직접 수정하거나 되돌릴 수 있어요.' : '사용자가 직접 작성함'}</span>
      </div>
    </div>
  );
}

function SourceContent({ page }) {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 52px' }}>
      <pre className="nm" style={{ fontSize: 13, lineHeight: 1.85, color: N.ink, whiteSpace: 'pre-wrap' }}>{page.content || '이 문서의 내용을 작성해주세요.'}</pre>
    </div>
  );
}

/* =========================================================================
   TRIPLE GRAPH PANEL
   ========================================================================= */
function TripleGraphPanel({ onClose, pageId }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filter, setFilter] = useState('all');
  const svgRef = useRef(null);

  const nodeTypes = ['all', 'doc', 'concept', 'policy', 'system', 'person'];
  const typeLabels = { all: '전체', doc: '문서', concept: '개념', policy: '정책', system: '시스템', person: '사람' };

  const visibleNodes = filter === 'all' ? GRAPH_NODES : GRAPH_NODES.filter(n => n.type === filter);
  const visibleIds = new Set(visibleNodes.map(n => n.id));
  const visibleEdges = GRAPH_EDGES.filter(e => visibleIds.has(e.s) && visibleIds.has(e.o));

  const getNode = (id) => GRAPH_NODES.find(n => n.id === id);

  const edgeMidpoint = (e) => {
    const s = getNode(e.s), o = getNode(e.o);
    if (!s || !o) return null;
    return { x: (s.x + o.x) / 2, y: (s.y + o.y) / 2, sx: s.x, sy: s.y, ox: o.x, oy: o.y };
  };

  return (
    <aside style={{ flex: 1, background: N.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: bd, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: N.ink, letterSpacing: '-.2px' }}>연결 관계 그래프</div>
          <div style={{ fontSize: 12, color: N.inkMute, marginTop: 2 }}>노드를 클릭하면 상세 정보를 볼 수 있어요</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 }} onMouseEnter={e => e.currentTarget.style.background = N.bgWarm} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <X size={14} color={N.inkSub} />
        </button>
      </div>

      {/* Legend + filter */}
      <div style={{ padding: '10px 16px', borderBottom: bd, flexShrink: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {nodeTypes.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '3px 9px', borderRadius: 9999, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filter === t ? N.blue : N.border}`,
              background: filter === t ? N.blueBg : 'none',
              color: filter === t ? N.blueTxt : N.inkSub,
            }}>
              {typeLabels[t]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(NODE_TYPE_STYLE).map(([type, style]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: type === 'concept' || type === 'person' ? '50%' : 2, background: style.bg, border: `1.5px solid ${style.border}` }} />
              <span style={{ fontSize: 10.5, color: N.inkSub, fontWeight: 500 }}>{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: N.bgWarm }}>
        <svg ref={svgRef} viewBox="0 0 760 490" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={N.inkMute} />
            </marker>
          </defs>

          {/* Edges with predicate labels */}
          {visibleEdges.map((e, i) => {
            const mid = edgeMidpoint(e);
            if (!mid) return null;
            const sNode = getNode(e.s), oNode = getNode(e.o);
            if (!sNode || !oNode) return null;
            // Offset the line end so it doesn't overlap node circle
            const dx = oNode.x - sNode.x, dy = oNode.y - sNode.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len, uy = dy / len;
            const ex = oNode.x - ux * 22, ey = oNode.y - uy * 22;
            return (
              <g key={i}>
                <line x1={sNode.x} y1={sNode.y} x2={ex} y2={ey}
                  stroke={hoveredNode === e.s || hoveredNode === e.o ? N.blue : N.border}
                  strokeWidth={hoveredNode === e.s || hoveredNode === e.o ? 1.8 : 1.2}
                  markerEnd="url(#arrowhead)" strokeDasharray={e.s === 'n-doc' || e.o === 'n-doc' ? 'none' : '4 3'}
                  style={{ transition: 'stroke .2s, stroke-width .2s' }}
                />
                {/* Predicate label */}
                <rect x={mid.x - 28} y={mid.y - 10} width={56} height={16} rx={8}
                  fill={N.bg} stroke={N.border} strokeWidth={1} />
                <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={9}
                  fill={N.inkSub} fontFamily="'Inter','Noto Sans KR',sans-serif" fontWeight={500}>
                  {e.p}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {visibleNodes.map((node) => {
            const ts = NODE_TYPE_STYLE[node.type];
            const isSel = selectedNode?.id === node.id;
            const isHov = hoveredNode === node.id;
            const r = 22;
            return (
              <g key={node.id} style={{ cursor: 'pointer' }}
                onClick={() => setSelectedNode(isSel ? null : node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Glow ring for selected */}
                {isSel && <circle cx={node.x} cy={node.y} r={r + 7} fill="none" stroke={N.blue} strokeWidth={1.5} opacity={.5} />}
                {/* Node shape */}
                <circle cx={node.x} cy={node.y} r={r}
                  fill={isSel ? N.blueBg : ts.bg}
                  stroke={isSel ? N.blue : ts.border}
                  strokeWidth={isSel ? 2 : 1.5}
                  style={{ transition: 'fill .15s, stroke .15s' }}
                />
                {/* Label */}
                <text x={node.x} y={node.y - r - 7} textAnchor="middle" fontSize={10.5}
                  fill={isSel ? N.blue : N.ink} fontFamily="'Inter','Noto Sans KR',sans-serif" fontWeight={600}>
                  {node.label.length > 8 ? node.label.slice(0, 7) + '…' : node.label}
                </text>
                {/* Type indicator */}
                <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={8}
                  fill={ts.fg} fontFamily="'Inter',sans-serif" fontWeight={600}>
                  {ts.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Node detail popup (floated inside panel) */}
        {selectedNode && NODE_INFO[selectedNode.id] && (
          <NodeDetailPopup
            node={selectedNode}
            info={NODE_INFO[selectedNode.id]}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Bottom stats */}
      <div style={{ padding: '8px 16px', borderTop: bd, display: 'flex', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 11.5, color: N.inkMute }}>노드 <strong style={{ color: N.ink }}>{visibleNodes.length}</strong></span>
        <span style={{ fontSize: 11.5, color: N.inkMute }}>관계 <strong style={{ color: N.ink }}>{visibleEdges.length}</strong></span>
        <span style={{ fontSize: 11.5, color: N.inkMute, marginLeft: 'auto' }}>트리플 그래프</span>
      </div>
    </aside>
  );
}

/* ── Node Detail Popup ──────────────────────────────────────────────────── */
function NodeDetailPopup({ node, info, onClose }) {
  const ts = NODE_TYPE_STYLE[node.type];
  return (
    <div className="nf aSI" style={{
      position: 'absolute', bottom: 52, left: 12, right: 12, maxHeight: 310, overflowY: 'auto',
      background: N.bg, borderRadius: 8, border: bd, boxShadow: N.deep, zIndex: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: bd }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ts.border }} />
            <NBadge color={node.type === 'doc' ? 'blue' : node.type === 'concept' ? 'teal' : node.type === 'policy' ? 'orange' : node.type === 'person' ? 'purple' : 'warm'} size="sm">{ts.label}</NBadge>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: N.ink, letterSpacing: '-.3px' }}>{info.label}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
          <X size={13} color={N.inkMute} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: N.inkSub, lineHeight: 1.6 }}>{info.desc}</p>

        {/* Source */}
        <div>
          <NLabel>출처</NLabel>
          <div style={{ marginTop: 5, fontSize: 13, color: N.ink, display: 'flex', alignItems: 'center', gap: 5 }}>
            <BookMarked size={12} color={N.blue} />{info.source}
            {info.updated && <span style={{ color: N.inkMute }}>· {info.updated}</span>}
          </div>
        </div>

        {/* Inputs / Outputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <NLabel>인풋</NLabel>
            <ul style={{ marginTop: 6, paddingLeft: 14, fontSize: 12.5, color: N.inkSub, lineHeight: 1.9 }}>
              {info.inputs.map((inp, i) => <li key={i}>{inp}</li>)}
            </ul>
          </div>
          <div>
            <NLabel>아웃풋</NLabel>
            <ul style={{ marginTop: 6, paddingLeft: 14, fontSize: 12.5, color: N.inkSub, lineHeight: 1.9 }}>
              {info.outputs.map((out, i) => <li key={i}>{out}</li>)}
            </ul>
          </div>
        </div>

        {/* Triples */}
        <div>
          <NLabel>이 노드의 관계 (트리플)</NLabel>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {info.triples.map((t, i) => (
              <div key={i} className="nm" style={{ fontSize: 11, background: N.bgWarm, borderRadius: 4, padding: '4px 10px', color: N.inkSub }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Related docs */}
        {info.related.length > 0 && (
          <div>
            <NLabel>연관 문서</NLabel>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {info.related.map((r, i) => (
                <NBadge key={i} color="blue" size="sm"><FileText size={9} />{r}</NBadge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   HISTORY PANEL — with diff view
   ========================================================================= */
function HistPanel({ onClose }) {
  const [sel, setSel] = useState('h1');
  const rev = HISTORY.find(h => h.id === sel);

  return (
    <aside style={{ flex: 1, background: N.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: bd, flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: N.ink, letterSpacing: '-.2px' }}>변경 기록</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 }} onMouseEnter={e => e.currentTarget.style.background = N.bgWarm} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <X size={14} color={N.inkSub} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', overflow: 'hidden' }}>
        {/* Rev list */}
        <div className="sy" style={{ borderRight: bd, overflowY: 'auto' }}>
          {HISTORY.map((h) => {
            const isSel = h.id === sel;
            const whoColor = h.who === 'ai' ? N.blue : N.teal;
            return (
              <button key={h.id} onClick={() => setSel(h.id)} style={{
                display: 'flex', flexDirection: 'column', width: '100%', padding: '12px 14px', background: 'none', border: 'none',
                borderBottom: bd, cursor: 'pointer', textAlign: 'left',
                borderLeft: isSel ? `2.5px solid ${N.blue}` : '2.5px solid transparent',
                background: isSel ? N.bgWarm : 'none',
              }}
              onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = N.bgWarm; }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: N.ink }}>{h.when}</span>
                  {h.isCurrent && <NBadge color="teal" size="sm">현재</NBadge>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: whoColor, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: N.inkSub, fontWeight: 500 }}>{h.whoLabel}</span>
                </div>
                <span style={{ fontSize: 11.5, color: N.inkSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.target}</span>
                <span className="nm" style={{ fontSize: 10.5, color: N.inkMute, marginTop: 2 }}>{h.blockCount}개 변경</span>
              </button>
            );
          })}
        </div>

        {/* Diff view */}
        <div className="sy" style={{ overflowY: 'auto', padding: '16px 18px' }}>
          {rev && (
            <div className="aFI">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: N.ink, letterSpacing: '-.2px', marginBottom: 5 }}>{rev.target}</div>
                <p style={{ fontSize: 12.5, color: N.inkSub, lineHeight: 1.6, marginBottom: 10 }}>{rev.summary}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {rev.who === 'ai' ? <NBadge color="blue" size="sm"><Bot size={9} />Wekiflow AI</NBadge> : <NBadge color="teal" size="sm"><Users size={9} />{rev.whoLabel}</NBadge>}
                  <NBadge color={rev.kind === 'create' ? 'blue' : 'warm'} size="sm">{rev.kind === 'create' ? '새 문서 생성' : '문서 편집'}</NBadge>
                  <NBadge color="warm" size="sm">{rev.blockCount}개 항목 변경</NBadge>
                  <span style={{ fontSize: 11.5, color: N.inkMute, alignSelf: 'center' }}>{rev.when}</span>
                </div>
              </div>
              <Divider my={12} />
              <NLabel>변경 내용 (Diff)</NLabel>
              <div style={{ marginTop: 10, borderRadius: 6, overflow: 'hidden', border: bd, boxShadow: N.card }}>
                {/* Diff header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: N.bgWarm, padding: '6px 14px', borderBottom: bd }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: N.inkMute }}>이전</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: N.inkMute, borderLeft: bd, paddingLeft: 14 }}>변경 후</span>
                </div>
                {/* Unified diff */}
                <div className="nm" style={{ fontSize: 12.5, lineHeight: 1.8 }}>
                  {rev.diff.map((line, i) => {
                    const bg = line.type === 'add' ? '#f0faf3' : line.type === 'del' ? '#fff5f5' : N.bg;
                    const fg = line.type === 'add' ? N.teal : line.type === 'del' ? '#dc2626' : N.inkMute;
                    const prefix = line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' ';
                    return (
                      <div key={i} style={{ display: 'flex', background: bg, padding: '1px 14px', borderTop: i === 0 ? 'none' : `1px solid ${line.type === 'ctx' ? N.border : 'transparent'}` }}>
                        <span style={{ color: fg, fontWeight: 700, width: 16, flexShrink: 0, userSelect: 'none' }}>{prefix}</span>
                        <span style={{ color: line.type === 'ctx' ? N.inkSub : line.type === 'add' ? '#1a5c2e' : '#8b1c1c', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {line.content || ' '}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                {!rev.isCurrent && <NBtn variant="outline" size="sm"><RotateCcw size={11} />이 버전으로 복원</NBtn>}
                <NBtn variant="ghost" size="sm"><ExternalLink size={11} />전체 화면으로 보기</NBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* =========================================================================
   TEACH VIEW
   ========================================================================= */
function TeachView() {
  const [tab, setTab] = useState('paste');
  const tabs = [{ k: 'file', l: '파일', I: FileUp }, { k: 'url', l: '웹 페이지', I: Globe }, { k: 'paste', l: '직접 입력', I: Type }, { k: 'ext', l: '외부 연동', I: Zap }];
  return (
    <div className="nf sy" style={{ flex: 1, background: N.bg, padding: '40px 48px 64px', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, color: N.ink, letterSpacing: '-.6px', marginBottom: 6 }}>지식 등록하기</h1>
      <p style={{ fontSize: 13.5, color: N.inkSub, marginBottom: 28, lineHeight: 1.6 }}>파일, 웹 페이지, 텍스트 — 어디서든 챗봇에게 가르칠 내용을 보내주세요.</p>
      <div style={{ borderRadius: 8, padding: '16px 18px', background: N.bgWarm, border: bd, marginBottom: 28, maxWidth: 700 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: N.ink, marginBottom: 4 }}>저장 위치</div>
        <p style={{ fontSize: 13, color: N.inkSub, marginBottom: 12 }}>같은 내용이 이미 있다면 중복 없이 자동으로 합쳐져요.</p>
        <div style={{ borderRadius: 6, border: bd, background: N.bg, overflow: 'hidden', display: 'inline-block', width: '100%' }}>
          <div style={{ padding: '7px 14px', fontSize: 13, color: N.ink }}>🏠 최상위</div>
          <div style={{ padding: '7px 14px 7px 28px', fontSize: 13, color: N.ink, background: N.blueBg, borderTop: bd, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FolderOpen size={12} color={N.blue} />
            <span style={{ fontWeight: 600 }}>근태 및 휴가</span>
            <NBadge color="blue" size="sm">선택됨</NBadge>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', borderBottom: bd, marginBottom: 24 }}>
          {tabs.map(({ k, l, I }) => (
            <button key={k} onClick={() => setTab(k)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 16px 9px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'none', color: tab === k ? N.ink : N.inkMute, borderBottom: tab === k ? `2px solid ${N.ink}` : '2px solid transparent', marginBottom: -1 }}>
              <I size={13} strokeWidth={1.7} />{l}
            </button>
          ))}
        </div>
        {tab === 'file' && <div style={{ textAlign: 'center', padding: '48px 24px', borderRadius: 8, border: `2px dashed ${N.border}`, background: N.bgWarm }}><FileUp size={30} color={N.inkMute} strokeWidth={1.4} style={{ margin: '0 auto 10px' }} /><div style={{ fontSize: 14, fontWeight: 600, color: N.ink, marginBottom: 4 }}>파일을 끌어다 놓거나 클릭해 선택해요</div><div className="nm" style={{ fontSize: 11.5, color: N.inkMute, marginBottom: 16 }}>PDF · DOCX · PPTX · XLSX · MD · TXT · 최대 20 MB</div><NBtn variant="primary">파일 선택</NBtn></div>}
        {tab === 'url' && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><FField label="웹 페이지 주소"><input placeholder="https://example.com" style={iStyle} /></FField><NBtn variant="primary" size="lg">가져오기 시작</NBtn></div>}
        {tab === 'paste' && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><FField label="제목 힌트 (선택)" hint="비워두면 AI가 자동으로 정해줘요"><input placeholder="예) 경조사 휴가 규정 업데이트" style={iStyle} /></FField><FField label="내용"><textarea rows={10} placeholder="여기에 내용을 붙여넣어요…" style={{ ...iStyle, resize: 'vertical', fontFamily: 'Fira Code, monospace', lineHeight: 1.7 }} /></FField><NBtn variant="primary" size="lg"><Send size={13} />챗봇에게 보내기</NBtn></div>}
        {tab === 'ext' && <div style={{ borderRadius: 8, padding: '18px 20px', background: N.bgDark }}><pre className="nm" style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.8 }}>{`# Slack 연동 예시\nPOST https://api.wekiflow.io/v1/teach\n{\n  "to": "근태 및 휴가",\n  "text": "...",\n  "from": "slack-hr-bot"\n}`}</pre></div>}
      </div>
    </div>
  );
}
const iStyle = { width: '100%', padding: '9px 13px', borderRadius: 4, fontSize: 13.5, color: N.ink, border: bd, background: N.bg, outline: 'none', display: 'block' };
function FField({ label, hint, children }) {
  return <div><div style={{ fontSize: 13, fontWeight: 600, color: N.ink, marginBottom: 5 }}>{label}</div>{children}{hint && <div style={{ fontSize: 11.5, color: N.inkMute, marginTop: 4 }}>{hint}</div>}</div>;
}

/* =========================================================================
   LOG VIEW
   ========================================================================= */
function LogView() {
  return (
    <div className="nf sy" style={{ flex: 1, background: N.bg, padding: '40px 48px 64px', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, color: N.ink, letterSpacing: '-.6px', marginBottom: 6 }}>학습 기록</h1>
      <p style={{ fontSize: 13.5, color: N.inkSub, marginBottom: 32, lineHeight: 1.6 }}>챗봇이 언제 무엇을 배웠는지 모두 기록돼요.</p>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 14, top: 8, bottom: 8, width: 1, background: N.border }} />
        {HISTORY.map((h, i) => (
          <div key={h.id} className="aFI" style={{ position: 'relative', paddingLeft: 44, paddingBottom: 22, animationDelay: `${i * 35}ms` }}>
            <div style={{ position: 'absolute', left: 10, top: 5, width: 9, height: 9, borderRadius: '50%', background: h.who === 'ai' ? N.blue : N.teal, border: `2px solid ${N.bg}`, zIndex: 1 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
              {h.who === 'ai' ? <NBadge color="blue" size="sm">AI</NBadge> : <NBadge color="teal" size="sm">사람</NBadge>}
              <span style={{ fontSize: 13.5, fontWeight: 600, color: N.ink }}>{h.whoLabel}</span>
              <span style={{ fontSize: 13.5, color: N.inkSub }}>이(가)</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: N.ink, textDecoration: 'underline dotted', textDecorationColor: N.border }}>{h.target}</span>
              <span style={{ fontSize: 13.5, color: N.inkSub }}>를 {h.kind === 'create' ? '새로 등록했어요' : '편집했어요'}</span>
              <span className="nm" style={{ fontSize: 11, color: N.inkMute, marginLeft: 'auto' }}>{h.when}</span>
            </div>
            <p style={{ fontSize: 12.5, color: N.inkSub, lineHeight: 1.55 }}>{h.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SYSTEM VIEW
   ========================================================================= */
function SystemView() {
  const [lastSync, setLastSync] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setLastSync(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const STEPS = [{ l: '받기', n: 3 }, { l: '분석', n: 43 }, { l: '통합', n: 0 }, { l: '정리', n: 1 }, { l: '반영', n: 2 }, { l: '색인', n: 40 }, { l: '연결', n: 0 }];
  return (
    <div className="nf sy" style={{ flex: 1, background: N.bg, padding: '40px 48px 64px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: N.ink, letterSpacing: '-.6px', marginBottom: 5 }}>시스템 상태</h1>
          <p style={{ fontSize: 13.5, color: N.inkSub }}>새로 들어온 내용이 7단계를 거쳐 챗봇에 반영돼요.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="nm" style={{ fontSize: 11.5, color: N.inkMute }}>{lastSync}</span>
          <NBtn variant="outline" size="sm"><RefreshCw size={11} />새로 고침</NBtn>
        </div>
      </div>
      <div style={{ borderRadius: 8, padding: '22px 24px', background: N.bgWarm, border: bd, marginBottom: 28, boxShadow: N.card }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: N.ink }}>처리 파이프라인</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: N.teal, fontWeight: 500 }}>
            <span className="aBL" style={{ width: 6, height: 6, borderRadius: '50%', background: N.teal, display: 'inline-block' }} />
            정상 운영 중
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.l}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ borderRadius: 6, padding: '10px 6px', background: s.n > 0 ? N.bg : 'transparent', border: `1px solid ${s.n > 0 ? N.border : 'transparent'}`, boxShadow: s.n > 0 ? N.card : 'none' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.n > 0 ? N.ink : N.inkMute }}>{s.n}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: N.inkSub, marginTop: 2 }}>{s.l}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 18, flexShrink: 0, position: 'relative', height: 1, background: N.border, overflow: 'hidden' }}>
                {s.n > 0 && <div style={{ position: 'absolute', top: -1, left: 0, width: 6, height: 3, background: N.blue, borderRadius: 2, animation: 'flowDot 1.4s linear infinite' }} />}
              </div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   FOLDER VIEW
   ========================================================================= */
function FolderView({ folder, openPage }) {
  return (
    <div className="nf sy" style={{ flex: 1, background: N.bg, padding: '40px 48px 64px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: N.ink, letterSpacing: '-.6px', marginBottom: 8 }}>{folder.label}</h1>
        <p style={{ fontSize: 14, color: N.inkSub }}>이 폴더에 포함된 모든 하위 문서들을 한눈에 볼 수 있어요.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {folder.pages.map(p => (
          <div key={p.id} style={{ border: bd, borderRadius: 8, background: N.bgWarm, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: N.bg, borderBottom: bd }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={15} color={N.inkSub} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: N.ink }}>{p.title}</h2>
              </div>
              <NBtn variant="ghost" size="sm" onClick={() => openPage(p.id)}>
                상세 보기 <ChevronRight size={12} />
              </NBtn>
            </div>
            <div className="md-content" style={{ padding: '20px 24px', fontSize: 14, color: N.ink, lineHeight: 1.7, background: N.bgWarm }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {p.content || '이 문서의 내용을 작성해주세요.'}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   NEW PAGE MODAL
   ========================================================================= */
function NewPageModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('f2');
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }} onClick={onClose}>
      <div className="nf aSI" style={{ width: 480, borderRadius: 8, background: N.bg, border: bd, padding: 28, boxShadow: N.deep }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: N.ink, letterSpacing: '-.3px', marginBottom: 5 }}>새 문서 만들기</h3>
        <p style={{ fontSize: 13, color: N.inkMute, marginBottom: 22 }}>선택한 위치에 새 문서가 만들어져요.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FField label="제목"><input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="문서 또는 폴더 제목을 입력해요" style={iStyle} /></FField>
          <FField label="위치">
            <select value={folder} onChange={e => setFolder(e.target.value)} style={{ ...iStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="root">최상위 문서 (새 폴더 만들기)</option>
              {HR_TREE.folders.map(f => <option key={f.id} value={f.id}>{f.label} 하위 문서</option>)}
            </select>
          </FField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
          <NBtn variant="ghost" onClick={onClose}>취소</NBtn>
          <NBtn variant="primary" disabled={!title} onClick={onClose}><Plus size={13} />문서 만들기</NBtn>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN APP
   ========================================================================= */
export default function Wekiflow() {
  const [view, setView] = useState('home');
  const [currentPage, setCurrentPage] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [panel, setPanel] = useState(null);
  const [newPageOpen, setNewPageOpen] = useState(false);

  const openPage = (id) => {
    const p = ALL_PAGES.find(pg => pg.id === id);
    setCurrentPage(p || null);
    setView('page');
    setPanel(null);
  };

  const openFolder = (id) => {
    const f = HR_TREE.folders.find(fd => fd.id === id);
    setCurrentFolder(f || null);
    setView('folder');
    setPanel(null);
  };

  const crumbs = {
    home:   ['글로벌벨루가 HR Wiki', '대시보드'],
    learn:  ['글로벌벨루가 HR Wiki', '신규 지식'],
    wiki:   ['글로벌벨루가 HR Wiki', '전사 위키'],
    teach:  ['글로벌벨루가 HR Wiki', '지식 등록하기'],
    log:    ['글로벌벨루가 HR Wiki', '학습 기록'],
    system: ['글로벌벨루가 HR Wiki', '시스템 상태'],
    page:   ['글로벌벨루가 HR Wiki', '전사 위키', currentPage?.title || ''],
    folder: ['글로벌벨루가 HR Wiki', '전사 위키', currentFolder?.label || '폴더'],
  };

  return (
    <div className="nf" style={{ display: 'flex', height: '100vh', width: '100%', background: N.bg, color: N.ink }}>
      <style>{FONTS}</style>
      <Sidebar view={view} setView={(v) => { setView(v); setPanel(null); }} openPage={openPage} currentPageId={currentPage?.id} openFolder={openFolder} currentFolderId={currentFolder?.id} openNewPage={() => setNewPageOpen(true)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar crumbs={crumbs[view] || ['글로벌벨루가 HR Wiki']} openPage={openPage} />
        {view === 'home'   && <HomeView gotoLearn={() => setView('learn')} openPage={openPage} />}
        {view === 'learn'  && <LearnView openPage={openPage} />}
        {view === 'wiki'   && <WikiView openPage={openPage} openNewPage={() => setNewPageOpen(true)} />}
        {view === 'teach'  && <TeachView />}
        {view === 'log'    && <LogView />}
        {view === 'system' && <SystemView />}
        {view === 'page' && currentPage && <PageEditorView page={currentPage} panel={panel} setPanel={setPanel} />}
        {view === 'folder' && currentFolder && <FolderView folder={currentFolder} openPage={openPage} />}
      </div>
      <NewPageModal open={newPageOpen} onClose={() => setNewPageOpen(false)} />
    </div>
  );
}
