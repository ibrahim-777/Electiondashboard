import { createContext, useContext, useState, ReactNode } from 'react';

export interface Candidate {
  id: number;
  name: string;
  personalVotes: number;
  block: 1 | 2 | 3;
  religion: string;
  rank?: number;
  wonSeat?: boolean;
}

export interface PartyList {
  id: number;
  name: string;
  shortName: string;
  color: string;
  votes: number;
  candidates: Candidate[];
}

export interface PollingBox {
  id: number;
  name: string;
  block: 1 | 2 | 3;
  blockName: string;
  center: string;
  room: string;
  district: string;
  isOpened: boolean;
  hasVotes: boolean;
}

export interface BoxVotes {
  boxId: number;
  listVotes: { [listId: number]: number };
  candidateVotes: { [candidateId: number]: number };
  rejectedVotes: number;
  blankVotes: number;
  totalVotes: number;
}

export interface VoterData {
  id: number;
  name: string;
  fatherName: string;
  motherName: string;
  recordNumber: string;
  birthday: string;
  sex: 'ذكر' | 'أنثى';
  block: string;
  district: string;
  center?: string;
  room?: string;
  elected?: boolean;
  status?: 'none' | 'green' | 'red' | 'yellow';
}

export interface Mandub {
  id: number;
  name: string;
  block: string;
  district: string;
  recordNumber: number;
  religion: string;
  phoneNumber: string;
  phoneCardType: 'alfa' | 'touch';
  mandubType: 'مندوب ثابت' | 'مندوب جوال' | 'رئيس مركز' | 'رئيس نفوس' | 'مندوب جوال سيارة';
  representative: string;
  sex: 'ذكر' | 'أنثى';
}

export interface CenterAssignment {
  roomId: number; // polling box id
  mandubId: number;
}

export interface Car {
  id: number;
  type: string; // نوع السيارة
  owner: number; // mandub ID - المالك
  plateNumber: string; // رقم اللوحة
  representative: string; // رقم المعرف (1-11)
  isAvailable: boolean; // متاحة/غير متاحة
  block: string; // المنطقة
  numberOfTours: number; // عدد الجولات
}

interface ElectionContextType {
  partyLists: PartyList[];
  pollingBoxes: PollingBox[];
  boxVotes: BoxVotes[];
  voters: VoterData[];
  mandubs: Mandub[];
  centerAssignments: CenterAssignment[];
  cars: Car[];
  addPartyList: (list: Omit<PartyList, 'id'>) => void;
  updatePartyList: (id: number, list: Partial<PartyList>) => void;
  deletePartyList: (id: number) => void;
  addCandidate: (listId: number, candidate: Omit<Candidate, 'id' | 'rank' | 'wonSeat'>) => void;
  updateCandidate: (listId: number, candidateId: number, candidate: Partial<Candidate>) => void;
  deleteCandidate: (listId: number, candidateId: number) => void;
  addBoxVotes: (boxId: number, listVotes: { [listId: number]: number }, candidateVotes: { [candidateId: number]: number }, rejectedVotes: number, blankVotes: number, totalVotes: number) => void;
  getBoxVotes: (boxId: number) => BoxVotes | null;
  updateBoxStatus: (boxId: number, isOpened: boolean) => void;
  getBlockStatistics: () => Array<{
    block: number;
    blockName: string;
    totalBoxes: number;
    openedBoxes: number;
    boxesWithVotes: number;
  }>;
  updateVoterStatus: (voterId: number, elected: boolean) => void;
  updateVoterStatusColor: (voterId: number, status: 'none' | 'green' | 'red' | 'yellow') => void;
  getVotingStatistics: () => Array<{
    block: number;
    blockName: string;
    totalVoters: number;
    votedCount: number;
    percentage: number;
  }>;
  addMandub: (mandub: Omit<Mandub, 'id'>) => void;
  updateMandub: (id: number, mandub: Partial<Mandub>) => void;
  deleteMandub: (id: number) => void;
  assignMandubToRoom: (roomId: number, mandubId: number) => void;
  unassignMandubFromRoom: (roomId: number) => void;
  getCenterStatistics: () => {
    totalCenters: number;
    fullCenters: number;
    emptyCenters: number;
  };
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: number, car: Partial<Car>) => void;
  deleteCar: (id: number) => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

// Initial mock data
const initialPartyLists: PartyList[] = [
  {
    id: 1,
    name: 'التحالف التقدمي',
    shortName: 'ت.ت',
    color: '#2563eb',
    votes: 456789,
    candidates: [
      { id: 1, name: 'ماريا سانتوس', personalVotes: 45678, block: 3, religion: 'مسيحي' },
      { id: 2, name: 'جون ديفيس', personalVotes: 42341, block: 3, religion: 'مسلم' },
      { id: 3, name: 'سارة جونسون', personalVotes: 38902, block: 2, religion: 'مسيحي' },
      { id: 4, name: 'مايكل تشين', personalVotes: 35678, block: 3, religion: 'درزي' },
      { id: 5, name: 'إيما ويلسون', personalVotes: 32456, block: 3, religion: 'مسلم' },
      { id: 6, name: 'ديفيد مارتينيز', personalVotes: 29834, block: 2, religion: 'مسيحي' },
      { id: 7, name: 'ليزا أندرسون', personalVotes: 27654, block: 3, religion: 'مسلم' },
      { id: 8, name: 'جيمس براون', personalVotes: 25432, block: 3, religion: 'مسيحي' },
      { id: 9, name: 'آنا تايلور', personalVotes: 23456, block: 1, religion: 'درزي' },
      { id: 10, name: 'روبرت لي', personalVotes: 21234, block: 3, religion: 'مسلم' },
      { id: 11, name: 'صوفي ميلر', personalVotes: 19876, block: 3, religion: 'مسيحي' },
    ],
  },
  {
    id: 2,
    name: 'حزب الوحدة الوطنية',
    shortName: 'و.و',
    color: '#dc2626',
    votes: 389234,
    candidates: [
      { id: 12, name: 'توماس رايت', personalVotes: 39823, block: 3, religion: 'مسيحي' },
      { id: 13, name: 'جينيفر هاريس', personalVotes: 36234, block: 2, religion: 'مسلم' },
      { id: 14, name: 'ويليام كلارك', personalVotes: 33456, block: 3, religion: 'درزي' },
      { id: 15, name: 'باتريشيا لويس', personalVotes: 31234, block: 3, religion: 'مسيحي' },
      { id: 16, name: 'كريستوفر ووكر', personalVotes: 28765, block: 3, religion: 'مسلم' },
      { id: 17, name: 'ليندا هول', personalVotes: 26543, block: 2, religion: 'مسيحي' },
      { id: 18, name: 'دانيال يونغ', personalVotes: 24321, block: 3, religion: 'مسلم' },
      { id: 19, name: 'باربرا كينغ', personalVotes: 22456, block: 1, religion: 'درزي' },
      { id: 20, name: 'ماثيو سكوت', personalVotes: 20678, block: 3, religion: 'مسيحي' },
      { id: 21, name: 'نانسي جرين', personalVotes: 18934, block: 3, religion: 'مسلم' },
      { id: 22, name: 'جوزيف آدمز', personalVotes: 17234, block: 3, religion: 'مسيحي' },
    ],
  },
  {
    id: 3,
    name: 'التحالف الأخضر',
    shortName: 'ت.أ',
    color: '#16a34a',
    votes: 298765,
    candidates: [
      { id: 23, name: 'ألكساندرا ريفرز', personalVotes: 31245, block: 3, religion: 'مسيحي' },
      { id: 24, name: 'ماركوس ستون', personalVotes: 28934, block: 3, religion: 'مسلم' },
      { id: 25, name: 'إيلينا فوستر', personalVotes: 26543, block: 2, religion: 'درزي' },
      { id: 26, name: 'ريان كوبر', personalVotes: 24321, block: 3, religion: 'مسيحي' },
      { id: 27, name: 'فيكتوريا مورغان', personalVotes: 22678, block: 3, religion: 'مسلم' },
      { id: 28, name: 'لوكاس هايز', personalVotes: 20456, block: 2, religion: 'مسيحي' },
      { id: 29, name: 'صوفيا بينيت', personalVotes: 18765, block: 3, religion: 'مسلم' },
      { id: 30, name: 'ناثان برايس', personalVotes: 17234, block: 3, religion: 'درزي' },
      { id: 31, name: 'أوليفيا ريد', personalVotes: 15987, block: 1, religion: 'مسيحي' },
      { id: 32, name: 'إيثان بروكس', personalVotes: 14523, block: 3, religion: 'مسلم' },
      { id: 33, name: 'إيزابيلا وارد', personalVotes: 13234, block: 3, religion: 'مسيحي' },
    ],
  },
];

const initialPollingBoxes: PollingBox[] = [
  // Block 1 - Minieh (1 seat)
  { id: 1, name: 'صندوق 1', block: 1, blockName: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 1', district: 'المنية', isOpened: true, hasVotes: false },
  { id: 2, name: 'صندوق 2', block: 1, blockName: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 2', district: 'المنية', isOpened: true, hasVotes: false },
  { id: 3, name: 'صندوق 3', block: 1, blockName: 'المنية', center: 'مركز المنية الثاني', room: 'غرفة 1', district: 'المنية', isOpened: true, hasVotes: false },
  { id: 4, name: 'صندوق 4', block: 1, blockName: 'المنية', center: 'مركز المنية الثاني', room: 'غرفة 2', district: 'المنية', isOpened: false, hasVotes: false },
  
  // Block 2 - Donnieh (2 seats)
  { id: 5, name: 'صندوق 5', block: 2, blockName: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 1', district: 'الضنية', isOpened: true, hasVotes: false },
  { id: 6, name: 'صندوق 6', block: 2, blockName: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 2', district: 'الضنية', isOpened: true, hasVotes: false },
  { id: 7, name: 'صندوق 7', block: 2, blockName: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 3', district: 'الضنية', isOpened: true, hasVotes: false },
  { id: 8, name: 'صندوق 8', block: 2, blockName: 'الضنية', center: 'مركز الضنية الشرقي', room: 'غرفة 1', district: 'الضنية', isOpened: true, hasVotes: false },
  { id: 9, name: 'صندوق 9', block: 2, blockName: 'الضنية', center: 'مركز الضنية الشرقي', room: 'غرفة 2', district: 'الضنية', isOpened: false, hasVotes: false },
  
  // Block 3 - Tripoli (8 seats)
  { id: 10, name: 'صندوق 10', block: 3, blockName: 'طرابلس', center: 'مركز باب الرمل', room: 'غرفة 1', district: 'باب الرمل', isOpened: true, hasVotes: false },
  { id: 11, name: 'صندوق 11', block: 3, blockName: 'طرابلس', center: 'مركز باب الرمل', room: 'غرفة 2', district: 'باب الرمل', isOpened: true, hasVotes: false },
  { id: 12, name: 'صندوق 12', block: 3, blockName: 'طرابلس', center: 'مركز باب الرمل', room: 'غرفة 3', district: 'باب الرمل', isOpened: true, hasVotes: false },
  { id: 13, name: 'صندوق 13', block: 3, blockName: 'طرابلس', center: 'مركز التل', room: 'غرفة 1', district: 'التل', isOpened: true, hasVotes: false },
  { id: 14, name: 'صندوق 14', block: 3, blockName: 'طرابلس', center: 'مركز التل', room: 'غرفة 2', district: 'التل', isOpened: true, hasVotes: false },
  { id: 15, name: 'صندوق 15', block: 3, blockName: 'طرابلس', center: 'مركز الميناء', room: 'غرفة 1', district: 'الميناء', isOpened: true, hasVotes: false },
  { id: 16, name: 'صندوق 16', block: 3, blockName: 'طرابلس', center: 'مركز الميناء', room: 'غرفة 2', district: 'الميناء', isOpened: true, hasVotes: false },
  { id: 17, name: 'صندوق 17', block: 3, blockName: 'طرابلس', center: 'مركز الميناء', room: 'غرفة 3', district: 'الميناء', isOpened: false, hasVotes: false },
  { id: 18, name: 'صندوق 18', block: 3, blockName: 'طرابلس', center: 'مركز القبة', room: 'غرفة 1', district: 'القبة', isOpened: true, hasVotes: false },
  { id: 19, name: 'صندوق 19', block: 3, blockName: 'طرابلس', center: 'مركز القبة', room: 'غرفة 2', district: 'القبة', isOpened: true, hasVotes: false },
  { id: 20, name: 'صندوق 20', block: 3, blockName: 'طرابلس', center: 'مركز القبة', room: 'غرفة 3', district: 'القبة', isOpened: true, hasVotes: false },
];

const initialMandubs: Mandub[] = [
  // Block 1 - المنية
  { id: 1, name: 'أحمد محمد حسن', block: '1', district: 'المنية', recordNumber: 1001, religion: 'سني', phoneNumber: '71123456', phoneCardType: 'alfa', mandubType: 'رئيس مركز', representative: 'محمد عمر', sex: 'ذكر' },
  { id: 2, name: 'علي خليل يوسف', block: '1', district: 'المنية', recordNumber: 1002, religion: 'سني', phoneNumber: '71234567', phoneCardType: 'touch', mandubType: 'مندوب ثابت', representative: 'حسن أحمد', sex: 'ذكر' },
  { id: 3, name: 'جورج طوني خوري', block: '1', district: 'المنية', recordNumber: 1003, religion: 'ماروني', phoneNumber: '71345678', phoneCardType: 'alfa', mandubType: 'مندوب جوال', representative: 'فادي نصر', sex: 'ذكر' },
  { id: 4, name: 'زينة سعيد خالد', block: '1', district: 'المنية', recordNumber: 1004, religion: 'سني', phoneNumber: '71223344', phoneCardType: 'touch', mandubType: 'مندوب جوال سيارة', representative: 'سارة محمود', sex: 'أنثى' },
  
  // Block 2 - الضنية
  { id: 5, name: 'محمد فارس عمر', block: '2', district: 'الضنية', recordNumber: 2001, religion: 'سني', phoneNumber: '71456789', phoneCardType: 'touch', mandubType: 'رئيس نفوس', representative: 'خالد فارس', sex: 'ذكر' },
  { id: 6, name: 'حسن عبد الله كريم', block: '2', district: 'الضنية', recordNumber: 2002, religion: 'سني', phoneNumber: '71567890', phoneCardType: 'alfa', mandubType: 'مندوب جوال سيارة', representative: 'علي يوسف', sex: 'ذكر' },
  { id: 7, name: 'ميشال بطرس حداد', block: '2', district: 'الضنية', recordNumber: 2003, religion: 'روم أرثوذكس', phoneNumber: '71678901', phoneCardType: 'touch', mandubType: 'مندوب ثابت', representative: 'جورج حداد', sex: 'ذكر' },
  { id: 8, name: 'نادين كريم سعد', block: '2', district: 'الضنية', recordNumber: 2004, religion: 'ماروني', phoneNumber: '71334455', phoneCardType: 'alfa', mandubType: 'مندوب جوال', representative: 'ماريا سليم', sex: 'أنثى' },
  { id: 9, name: 'وليد محمود طه', block: '2', district: 'الضنية', recordNumber: 2005, religion: 'سني', phoneNumber: '71445566', phoneCardType: 'touch', mandubType: 'رئيس مركز', representative: 'رامي حسن', sex: 'ذكر' },
  
  // Block 3 - طرابلس
  { id: 10, name: 'خالد سعيد أحمد', block: '3', district: 'باب الرمل', recordNumber: 3001, religion: 'سني', phoneNumber: '71789012', phoneCardType: 'alfa', mandubType: 'رئيس مركز', representative: 'عمر خالد', sex: 'ذكر' },
  { id: 11, name: 'عمر جمال طه', block: '3', district: 'التل', recordNumber: 3002, religion: 'سني', phoneNumber: '71890123', phoneCardType: 'touch', mandubType: 'مندوب جوال', representative: 'طارق جمال', sex: 'ذكر' },
  { id: 12, name: 'فادي يوسف عون', block: '3', district: 'الميناء', recordNumber: 3003, religion: 'ماروني', phoneNumber: '71901234', phoneCardType: 'alfa', mandubType: 'مندوب ثابت', representative: 'ميشال يوسف', sex: 'ذكر' },
  { id: 13, name: 'رفيق محمود حسين', block: '3', district: 'جبل محسن', recordNumber: 3004, religion: 'علوي', phoneNumber: '71012345', phoneCardType: 'touch', mandubType: 'مندوب جوال سيارة', representative: 'حسام محمود', sex: 'ذكر' },
  { id: 14, name: 'وليد كريم سليم', block: '3', district: 'القبة', recordNumber: 3005, religion: 'سني', phoneNumber: '71123457', phoneCardType: 'alfa', mandubType: 'رئيس نفوس', representative: 'بلال كريم', sex: 'ذكر' },
  { id: 15, name: 'لينا فارس توفيق', block: '3', district: 'القبة', recordNumber: 3006, religion: 'ماروني', phoneNumber: '71556677', phoneCardType: 'touch', mandubType: 'مندوب ثابت', representative: 'كارلا فارس', sex: 'أنثى' },
  { id: 16, name: 'سامر رشيد عبد الله', block: '3', district: 'التل', recordNumber: 3007, religion: 'سني', phoneNumber: '71667788', phoneCardType: 'alfa', mandubType: 'مندوب جال', representative: 'رامي رشيد', sex: 'ذكر' },
  { id: 17, name: 'مايا حسن صالح', block: '3', district: 'باب الرمل', recordNumber: 3008, religion: 'روم كاثوليك', phoneNumber: '71778899', phoneCardType: 'touch', mandubType: 'مندوب جوال سيار', representative: 'دينا حسن', sex: 'أنثى' },
];

const initialVoters: VoterData[] = [
  // Block 1 - المنية - مركز المنية الأول - غرفة 1 (voters 1-500)
  { id: 1, name: 'محمد علي أحمد', fatherName: 'محمد أحمد', motherName: 'فاطمة محمد', recordNumber: '101', birthday: '1980-01-01', sex: 'ذكر', block: '1', district: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 1' },
  { id: 2, name: 'حسن خليل سعد', fatherName: 'خليل سعد', motherName: 'نورا حسن', recordNumber: '102', birthday: '1985-02-02', sex: 'ذكر', block: '1', district: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 1' },
  { id: 3, name: 'عبد الله كريم', fatherName: 'عبد الله كريم', motherName: 'سميرة عبد الله', recordNumber: '103', birthday: '1990-03-03', sex: 'ذكر', block: '1', district: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 1' },
  
  // Block 1 - المنية - مركز المنية الأول - غرفة 2 (voters 1-500)
  { id: 4, name: 'سارة حسن محمد', fatherName: 'حسن محمد', motherName: 'نورا حسن', recordNumber: '201', birthday: '1982-04-04', sex: 'أنثى', block: '1', district: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 2' },
  { id: 5, name: 'جورج طوني خليل', fatherName: 'طوني خليل', motherName: 'ماري جورج', recordNumber: '202', birthday: '1987-05-05', sex: 'ذكر', block: '1', district: 'المنية', center: 'مركز المنية الأول', room: 'غرفة 2' },
  
  // Block 1 - المنية - مركز المنية الثاني - غرفة 1 (voters 1-450)
  { id: 6, name: 'علي حسن يوسف', fatherName: 'حسن يوسف', motherName: 'فاطمة محمد', recordNumber: '301', birthday: '1984-06-06', sex: 'ذكر', block: '1', district: 'المنية', center: 'مركز المنية الثاني', room: 'غرفة 1' },
  { id: 7, name: 'أحمد فارس عمر', fatherName: 'فارس عمر', motherName: 'ليلى أحمد', recordNumber: '302', birthday: '1989-07-07', sex: 'ذكر', block: '1', district: 'المنية', center: 'مركز المنية الثاني', room: 'غرفة 1' },
  
  // Block 1 - المنية - مركز المنية الثاني - غرفة 2 (voters 1-480)
  { id: 8, name: 'فاطمة حسن علي', fatherName: 'حسن علي', motherName: 'نورا حسن', recordNumber: '401', birthday: '1986-08-08', sex: 'أنثى', block: '1', district: 'المنية', center: 'مركز المنية الثاني', room: 'غرفة 2' },
  { id: 9, name: 'ماريا يوسف سليم', fatherName: 'يوسف سليم', motherName: 'رنا ماريا', recordNumber: '402', birthday: '1991-09-09', sex: 'أنثى', block: '1', district: 'المنية', center: 'مركز المنية الثاني', room: 'غرفة 2' },
  
  // Block 2 - الضنية - مركز الضنية المركزي - غرفة 1 (voters 1-550)
  { id: 10, name: 'أحمد خليل حسن', fatherName: 'خليل حسن', motherName: 'ليلى أحمد', recordNumber: '501', birthday: '1983-10-10', sex: 'ذكر', block: '2', district: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 1' },
  { id: 11, name: 'محمد عبد الرحمن', fatherName: 'عبد الرحمن', motherName: 'خديجة محمد', recordNumber: '502', birthday: '1988-11-11', sex: 'ذكر', block: '2', district: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 1' },
  
  // Block 2 - الضنية - مركز الضنية المركزي - غرفة 2 (voters 1-520)
  { id: 12, name: 'ليلى محمود حسين', fatherName: 'محمد حسين', motherName: 'نور محمود', recordNumber: '601', birthday: '1981-12-12', sex: 'أنثى', block: '2', district: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 2' },
  { id: 13, name: 'نادين فارس بشارة', fatherName: 'فارس بشارة', motherName: 'سميرة نادين', recordNumber: '602', birthday: '1986-01-13', sex: 'أنثى', block: '2', district: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 2' },
  
  // Block 2 - الضنية - مركز الضنية المركزي - غرفة 3 (voters 1-490)
  { id: 14, name: 'يوسف عبدو جمال', fatherName: 'عبدو جمال', motherName: 'مريم يوسف', recordNumber: '701', birthday: '1984-02-14', sex: 'ذكر', block: '2', district: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 3' },
  { id: 15, name: 'كمال سعيد خليل', fatherName: 'سعيد خليل', motherName: 'فاطمة كمال', recordNumber: '702', birthday: '1989-03-15', sex: 'ذكر', block: '2', district: 'الضنية', center: 'مركز الضنية المركزي', room: 'غرفة 3' },
  
  // Block 2 - الضنية - مركز الضنية الشرقي - غرفة 1 (voters 1-470)
  { id: 16, name: 'ريم سعيد أحمد', fatherName: 'سعيد أحمد', motherName: 'هدى سعيد', recordNumber: '801', birthday: '1982-04-16', sex: 'أنثى', block: '2', district: 'الضنية', center: 'مركز الضنية الشرقي', room: 'غرفة 1' },
  { id: 17, name: 'إيلي جورج حداد', fatherName: 'جورج حداد', motherName: 'لطيفة إيلي', recordNumber: '802', birthday: '1987-05-17', sex: 'أنثى', block: '2', district: 'الضنية', center: 'مركز الضنية الشرقي', room: 'غرفة 1' },
  
  // Block 2 - الضنية - مركز الضنية الشرقي - غرفة 2 (voters 1-510)
  { id: 18, name: 'خالد جمال طه', fatherName: 'جمال طه', motherName: 'سلمى خالد', recordNumber: '901', birthday: '1985-06-18', sex: 'ذكر', block: '2', district: 'الضنية', center: 'مركز الضنية الشرقي', room: 'غرفة 2' },
  { id: 19, name: 'عمر فيصل عثمان', fatherName: 'فيصل عثمان', motherName: 'نجلاء عمر', recordNumber: '902', birthday: '1990-07-19', sex: 'ذكر', block: '2', district: 'الضنية', center: 'مركز الضنية الشرقي', room: 'غرفة 2' },
  
  // Block 3 - طرابلس - الزاهرية للبنات - غرفة رقم 2 (voters 1-600)
  { id: 20, name: 'مصطفى خالد', fatherName: 'خالد', motherName: 'أم اختبار', recordNumber: '50', birthday: '1983-08-20', sex: 'ذكر', block: '3', district: 'الزاهرية', center: 'مركز باب الرمل', room: 'غرفة 1' },
  { id: 21, name: 'عائشة محمد رشيد', fatherName: 'محمد رشيد', motherName: 'أمينة عائشة', recordNumber: '51', birthday: '1988-09-21', sex: 'أنثى', block: '3', district: 'الزاهرية', center: 'مركز باب الرمل', room: 'غرفة 1' },
  { id: 22, name: 'زينب عمر كريم', fatherName: 'عمر كريم', motherName: 'سعاد زينب', recordNumber: '52', birthday: '1993-10-22', sex: 'أنثى', block: '3', district: 'الزاهرية', center: 'مركز باب الرمل', room: 'غرفة 1' },
  
  // Block 3 - طرابلس - مركز باب الرمل - غرفة 1 (voters 1-580)
  { id: 23, name: 'نور الدين عمر حسن', fatherName: 'عمر حسن', motherName: 'زينب عمر', recordNumber: '1001', birthday: '1981-11-23', sex: 'ذكر', block: '3', district: 'باب الرمل', center: 'مركز باب الرمل', room: 'غرفة 1' },
  { id: 24, name: 'بلال محمود جابر', fatherName: 'محمد جابر', motherName: 'هدى بلال', recordNumber: '1002', birthday: '1986-12-24', sex: 'ذكر', block: '3', district: 'باب الرمل', center: 'مركز باب الرمل', room: 'غرفة 1' },
  
  // Block 3 - طرابلس - مركز باب الرمل - غرفة 2 (voters 1-560)
  { id: 25, name: 'فادي طوني حداد', fatherName: 'طوني حداد', motherName: 'ماري فادي', recordNumber: '1101', birthday: '1984-01-25', sex: 'ذكر', block: '3', district: 'باب الرمل', center: 'مركز باب الرمل', room: 'غرفة 2' },
  { id: 26, name: 'جوزيف أنطوان عون', fatherName: 'أنطوان عون', motherName: 'ليلى جوزيف', recordNumber: '1102', birthday: '1989-02-26', sex: 'ذكر', block: '3', district: 'باب الرمل', center: 'مركز باب الرمل', room: 'غرفة 2' },
  
  // Block 3 - طرابلس - مركز باب الرمل - غرفة 3 (voters 1-540)
  { id: 27, name: 'رنا كريم سعد', fatherName: 'كريم سعد', motherName: 'سميرة كريم', recordNumber: '1201', birthday: '1982-03-27', sex: 'أنثى', block: '3', district: 'باب الرمل', center: 'مركز باب الرمل', room: 'غرفة 3' },
  { id: 28, name: 'ميشال بطرس سليم', fatherName: 'بطرس سليم', motherName: 'نور ميشال', recordNumber: '1202', birthday: '1987-04-28', sex: 'أنثى', block: '3', district: 'باب الرمل', center: 'مركز باب الرمل', room: 'غرفة 3' },
  
  // Block 3 - طرابلس - مركز التل - غرفة 1 (voters 1-590)
  { id: 29, name: 'وليد فارس خالد', fatherName: 'فارس خالد', motherName: 'ندى فارس', recordNumber: '1301', birthday: '1985-05-29', sex: 'ذكر', block: '3', district: 'التل', center: 'مركز التل', room: 'غرفة 1' },
  { id: 30, name: 'رامي سمير عبد الله', fatherName: 'سمير عبد الله', motherName: 'لينا رامي', recordNumber: '1302', birthday: '1990-06-30', sex: 'ذكر', block: '3', district: 'التل', center: 'مركز التل', room: 'غرفة 1' },
  
  // Block 3 - طرابلس - مركز التل - غرفة 2 (voters 1-570)
  { id: 31, name: 'دينا رشيد حسن', fatherName: 'رشيد حسن', motherName: 'نادية رشيد', recordNumber: '1401', birthday: '1983-07-01', sex: 'أنثى', block: '3', district: 'التل', center: 'مركز التل', room: 'غرفة 2' },
  { id: 32, name: 'كارلا ميشال نصر', fatherName: 'ميشال نصر', motherName: 'سوزان كارلا', recordNumber: '1402', birthday: '1988-08-02', sex: 'أنثى', block: '3', district: 'التل', center: 'مركز التل', room: 'غرفة 2' },
  
  // Block 3 - طرابلس - مركز الميناء - غرفة 1 (voters 1-600)
  { id: 33, name: 'طارق حمدان صالح', fatherName: 'حمدان صالح', motherName: 'رانيا حمدان', recordNumber: '1501', birthday: '1986-09-03', sex: 'ذكر', block: '3', district: 'الميناء', center: 'مركز الميناء', room: 'غرفة 1' },
  { id: 34, name: 'حسام عادل محمود', fatherName: 'عادل محمود', motherName: 'فاطمة حسام', recordNumber: '1502', birthday: '1991-10-04', sex: 'ذكر', block: '3', district: 'الميناء', center: 'مركز الميناء', room: 'غرفة 1' },
  
  // Block 3 - طرابلس - مركز الميناء - غرفة 2 (voters 1-580)
  { id: 35, name: 'هالة توفيق علي', fatherName: 'توفيق علي', motherName: 'جميلة توفيق', recordNumber: '1601', birthday: '1984-11-05', sex: 'أنثى', block: '3', district: 'جبل محسن', center: 'مركز الميناء', room: 'غرفة 2' },
  { id: 36, name: 'رفيق محمد حسين', fatherName: 'محمد حسين', motherName: 'نور رفيق', recordNumber: '1602', birthday: '1989-12-06', sex: 'ذكر', block: '3', district: 'جبل محسن', center: 'مركز الميناء', room: 'غرفة 2' },
  
  // Block 3 - طرابلس - مركز الميناء - غرفة 3 (voters 1-550)
  { id: 37, name: 'سامر نصار جمال', fatherName: 'نصار جمال', motherName: 'فادية نصار', recordNumber: '1701', birthday: '1982-01-07', sex: 'ذكر', block: '3', district: 'الميناء', center: 'مركز الميناء', room: 'غرفة 3' },
  { id: 38, name: 'ياسر فوزي عمر', fatherName: 'فوزي عمر', motherName: 'سعاد ياسر', recordNumber: '1702', birthday: '1987-02-08', sex: 'ذكر', block: '3', district: 'الميناء', center: 'مركز الميناء', room: 'غرفة 3' },
  
  // Block 3 - طرابلس - مركز القبة - غرفة 1 (voters 1-595)
  { id: 39, name: 'لينا قاسم توفيق', fatherName: 'قاسم توفيق', motherName: 'وفاء قاسم', recordNumber: '1801', birthday: '1985-03-09', sex: 'أنثى', block: '3', district: 'القبة', center: 'مركز القبة', room: 'غرفة 1' },
  { id: 40, name: 'سيلين بطرس خوري', fatherName: 'بطرس خوري', motherName: 'ريتا سيلين', recordNumber: '1802', birthday: '1990-04-10', sex: 'أنثى', block: '3', district: 'القبة', center: 'مركز القبة', room: 'غرفة 1' },
  
  // Block 3 - طرابلس - مركز القبة - غرفة 2 (voters 1-575)
  { id: 41, name: 'عماد شاهين أحمد', fatherName: 'شاهين أحمد', motherName: 'إيمان شاهين', recordNumber: '1901', birthday: '1983-05-11', sex: 'ذكر', block: '3', district: 'القبة', center: 'مركز القبة', room: 'غرفة 2' },
  { id: 42, name: 'طلال عبد الكريم', fatherName: 'عبد الكريم', motherName: 'لبنى طلال', recordNumber: '1902', birthday: '1988-06-12', sex: 'ذكر', block: '3', district: 'القبة', center: 'مركز القبة', room: 'غرفة 2' },
  
  // Block 3 - طرابلس - مركز القبة - غرفة 3 (voters 1-565)
  { id: 43, name: 'مايا صالح حسن', fatherName: 'صالح حسن', motherName: 'غادة صالح', recordNumber: '2001', birthday: '1986-07-13', sex: 'أنثى', block: '3', district: 'القبة', center: 'مركز القبة', room: 'غرفة 3' },
  { id: 44, name: 'نينا سمير يوسف', fatherName: 'سمير يوسف', motherName: 'رنا نينا', recordNumber: '2002', birthday: '1991-08-14', sex: 'أنثى', block: '3', district: 'القبة', center: 'مركز القبة', room: 'غرفة 3' },
];

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [partyLists, setPartyLists] = useState<PartyList[]>(initialPartyLists);
  const [pollingBoxes, setPollingBoxes] = useState<PollingBox[]>(initialPollingBoxes);
  const [boxVotes, setBoxVotes] = useState<BoxVotes[]>([]);
  const [voters, setVoters] = useState<VoterData[]>(initialVoters);
  const [mandubs, setMandubs] = useState<Mandub[]>(initialMandubs);
  const [centerAssignments, setCenterAssignments] = useState<CenterAssignment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  const addPartyList = (list: Omit<PartyList, 'id'>) => {
    const newId = Math.max(...partyLists.map(l => l.id), 0) + 1;
    setPartyLists([...partyLists, { ...list, id: newId }]);
  };

  const updatePartyList = (id: number, updates: Partial<PartyList>) => {
    setPartyLists(partyLists.map(list => 
      list.id === id ? { ...list, ...updates } : list
    ));
  };

  const deletePartyList = (id: number) => {
    setPartyLists(partyLists.filter(list => list.id !== id));
  };

  const addCandidate = (listId: number, candidate: Omit<Candidate, 'id' | 'rank' | 'wonSeat'>) => {
    setPartyLists(partyLists.map(list => {
      if (list.id === listId) {
        const newId = Math.max(...list.candidates.map(c => c.id), 0) + 1;
        return {
          ...list,
          candidates: [...list.candidates, { ...candidate, id: newId }]
        };
      }
      return list;
    }));
  };

  const updateCandidate = (listId: number, candidateId: number, updates: Partial<Candidate>) => {
    setPartyLists(partyLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          candidates: list.candidates.map(c => 
            c.id === candidateId ? { ...c, ...updates } : c
          )
        };
      }
      return list;
    }));
  };

  const deleteCandidate = (listId: number, candidateId: number) => {
    setPartyLists(partyLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          candidates: list.candidates.filter(c => c.id !== candidateId)
        };
      }
      return list;
    }));
  };

  const addBoxVotes = (boxId: number, listVotes: { [listId: number]: number }, candidateVotes: { [candidateId: number]: number }, rejectedVotes: number, blankVotes: number, totalVotes: number) => {
    // Remove existing votes for this box if any
    const updatedBoxVotes = boxVotes.filter(v => v.boxId !== boxId);
    setBoxVotes([...updatedBoxVotes, { boxId, listVotes, candidateVotes, rejectedVotes, blankVotes, totalVotes }]);
    
    setPollingBoxes(pollingBoxes.map(box => 
      box.id === boxId ? { ...box, hasVotes: true } : box
    ));

    // Aggregate all votes and update party lists
    const allBoxVotes = [...updatedBoxVotes, { boxId, listVotes, candidateVotes, rejectedVotes, blankVotes, totalVotes }];
    
    // Calculate total votes per list
    const totalListVotes: { [listId: number]: number } = {};
    const totalCandidateVotes: { [candidateId: number]: number } = {};
    
    allBoxVotes.forEach(boxVote => {
      Object.entries(boxVote.listVotes).forEach(([listId, votes]) => {
        totalListVotes[parseInt(listId)] = (totalListVotes[parseInt(listId)] || 0) + votes;
      });
      
      Object.entries(boxVote.candidateVotes).forEach(([candidateId, votes]) => {
        totalCandidateVotes[parseInt(candidateId)] = (totalCandidateVotes[parseInt(candidateId)] || 0) + votes;
      });
    });

    // Update party lists with aggregated votes
    setPartyLists(partyLists.map(list => ({
      ...list,
      votes: totalListVotes[list.id] || 0,
      candidates: list.candidates.map(candidate => ({
        ...candidate,
        personalVotes: totalCandidateVotes[candidate.id] || 0,
      })),
    })));
  };

  const getBoxVotes = (boxId: number) => {
    return boxVotes.find(votes => votes.boxId === boxId) || null;
  };

  const updateBoxStatus = (boxId: number, isOpened: boolean) => {
    setPollingBoxes(pollingBoxes.map(box => 
      box.id === boxId ? { ...box, isOpened } : box
    ));
  };

  const getBlockStatistics = () => {
    const blockStats: Array<{
      block: number;
      blockName: string;
      totalBoxes: number;
      openedBoxes: number;
      boxesWithVotes: number;
    }> = [];

    const blocks = pollingBoxes.reduce((acc, box) => {
      if (!acc[box.block]) {
        acc[box.block] = {
          block: box.block,
          blockName: box.blockName,
          totalBoxes: 0,
          openedBoxes: 0,
          boxesWithVotes: 0,
        };
      }
      acc[box.block].totalBoxes += 1;
      if (box.isOpened) {
        acc[box.block].openedBoxes += 1;
      }
      if (box.hasVotes) {
        acc[box.block].boxesWithVotes += 1;
      }
      return acc;
    }, {} as { [block: number]: {
      block: number;
      blockName: string;
      totalBoxes: number;
      openedBoxes: number;
      boxesWithVotes: number;
    } });

    for (const block in blocks) {
      blockStats.push(blocks[block]);
    }

    return blockStats;
  };

  const updateVoterStatus = (voterId: number, elected: boolean) => {
    setVoters(voters.map(voter => 
      voter.id === voterId ? { ...voter, elected } : voter
    ));
  };

  const updateVoterStatusColor = (voterId: number, status: 'none' | 'green' | 'red' | 'yellow') => {
    setVoters(voters.map(voter => 
      voter.id === voterId ? { ...voter, status } : voter
    ));
  };

  const getVotingStatistics = () => {
    const blockStats: Array<{
      block: number;
      blockName: string;
      totalVoters: number;
      votedCount: number;
      percentage: number;
    }> = [];

    const blocks = voters.reduce((acc, voter) => {
      const blockNumber = parseInt(voter.block);
      if (!acc[blockNumber]) {
        acc[blockNumber] = {
          block: blockNumber,
          blockName: pollingBoxes.find(box => box.block === blockNumber)?.blockName || '',
          totalVoters: 0,
          votedCount: 0,
          percentage: 0,
        };
      }
      acc[blockNumber].totalVoters += 1;
      if (voter.elected) {
        acc[blockNumber].votedCount += 1;
      }
      acc[blockNumber].percentage = acc[blockNumber].votedCount / acc[blockNumber].totalVoters * 100;
      return acc;
    }, {} as { [block: number]: {
      block: number;
      blockName: string;
      totalVoters: number;
      votedCount: number;
      percentage: number;
    } });

    for (const block in blocks) {
      blockStats.push(blocks[block]);
    }

    return blockStats.sort((a, b) => a.block - b.block);
  };

  const addMandub = (mandub: Omit<Mandub, 'id'>) => {
    const newId = Math.max(...mandubs.map(m => m.id), 0) + 1;
    setMandubs([...mandubs, { ...mandub, id: newId }]);
  };

  const updateMandub = (id: number, updates: Partial<Mandub>) => {
    setMandubs(mandubs.map(mandub => 
      mandub.id === id ? { ...mandub, ...updates } : mandub
    ));
  };

  const deleteMandub = (id: number) => {
    setMandubs(mandubs.filter(mandub => mandub.id !== id));
  };

  const assignMandubToRoom = (roomId: number, mandubId: number) => {
    // Remove any existing assignment for this room
    const updatedAssignments = centerAssignments.filter(assignment => assignment.roomId !== roomId);
    setCenterAssignments([...updatedAssignments, { roomId, mandubId }]);
  };

  const unassignMandubFromRoom = (roomId: number) => {
    setCenterAssignments(centerAssignments.filter(assignment => assignment.roomId !== roomId));
  };

  const getCenterStatistics = () => {
    const totalCenters = pollingBoxes.length;
    const fullCenters = centerAssignments.length;
    const emptyCenters = totalCenters - fullCenters;
    return {
      totalCenters,
      fullCenters,
      emptyCenters,
    };
  };

  const addCar = (car: Omit<Car, 'id'>) => {
    const newId = Math.max(...cars.map(c => c.id), 0) + 1;
    setCars([...cars, { ...car, id: newId }]);
  };

  const updateCar = (id: number, updates: Partial<Car>) => {
    setCars(cars.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
  };

  const deleteCar = (id: number) => {
    setCars(cars.filter(car => car.id !== id));
  };

  return (
    <ElectionContext.Provider value={{
      partyLists,
      pollingBoxes,
      boxVotes,
      voters,
      mandubs,
      centerAssignments,
      cars,
      addPartyList,
      updatePartyList,
      deletePartyList,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      addBoxVotes,
      getBoxVotes,
      updateBoxStatus,
      getBlockStatistics,
      updateVoterStatus,
      updateVoterStatusColor,
      getVotingStatistics,
      addMandub,
      updateMandub,
      deleteMandub,
      assignMandubToRoom,
      unassignMandubFromRoom,
      getCenterStatistics,
      addCar,
      updateCar,
      deleteCar,
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
}