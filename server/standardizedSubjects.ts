// Comprehensive list of standardized subjects for Indian education boards
export const standardizedSubjects = [
  // CBSE Class 6
  { code: "CBSE_6_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_ENGLISH", name: "English", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 6, stream: null, isCore: false },

  // CBSE Class 7
  { code: "CBSE_7_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_ENGLISH", name: "English", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 7, stream: null, isCore: false },

  // CBSE Class 8
  { code: "CBSE_8_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_ENGLISH", name: "English", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 8, stream: null, isCore: false },

  // CBSE Class 9
  { code: "CBSE_9_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_ENGLISH", name: "English", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 9, stream: null, isCore: false },

  // CBSE Class 10
  { code: "CBSE_10_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_ENGLISH", name: "English", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 10, stream: null, isCore: false },

  // CBSE Class 11 Science
  { code: "CBSE_11_SCIENCE_PHYSICS", name: "Physics", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_CHEMISTRY", name: "Chemistry", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_BIOLOGY", name: "Biology", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: false },
  { code: "CBSE_11_SCIENCE_COMPUTER", name: "Computer Science", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: false },

  // CBSE Class 11 Commerce
  { code: "CBSE_11_COMMERCE_ACCOUNTANCY", name: "Accountancy", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_BUSINESS", name: "Business Studies", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: false },

  // CBSE Class 11 Humanities
  { code: "CBSE_11_HUMANITIES_HISTORY", name: "History", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_GEOGRAPHY", name: "Geography", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_POLITICAL", name: "Political Science", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: false },

  // CBSE Class 12 Science
  { code: "CBSE_12_SCIENCE_PHYSICS", name: "Physics", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_CHEMISTRY", name: "Chemistry", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_BIOLOGY", name: "Biology", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: false },
  { code: "CBSE_12_SCIENCE_COMPUTER", name: "Computer Science", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: false },

  // CBSE Class 12 Commerce
  { code: "CBSE_12_COMMERCE_ACCOUNTANCY", name: "Accountancy", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_BUSINESS", name: "Business Studies", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: false },

  // CBSE Class 12 Humanities
  { code: "CBSE_12_HUMANITIES_HISTORY", name: "History", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_GEOGRAPHY", name: "Geography", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_POLITICAL", name: "Political Science", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_ENGLISH", name: "English", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: false },

  // ICSE Classes 6-10 (similar structure with ICSE prefix)
  { code: "ICSE_6_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_ENGLISH", name: "English Language", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },

  { code: "ICSE_10_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_ENGLISH", name: "English Language", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },

  // ISC Classes 11-12
  { code: "ISC_11_SCIENCE_PHYSICS", name: "Physics", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_CHEMISTRY", name: "Chemistry", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_MATH", name: "Mathematics", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_ENGLISH", name: "English", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_BIOLOGY", name: "Biology", board: "ISC", gradeLevel: 11, stream: "Science", isCore: false },

  { code: "ISC_12_SCIENCE_PHYSICS", name: "Physics", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_CHEMISTRY", name: "Chemistry", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_MATH", name: "Mathematics", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_ENGLISH", name: "English", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_BIOLOGY", name: "Biology", board: "ISC", gradeLevel: 12, stream: "Science", isCore: false },
];

export function getSubjectsByBoardGradeStream(board: string, grade: number, stream?: string) {
  return standardizedSubjects.filter(subject => 
    subject.board === board && 
    subject.gradeLevel === grade && 
    (grade <= 10 ? subject.stream === null : subject.stream === stream)
  );
}

export function getAvailableStreams(board: string, grade: number) {
  if (grade <= 10) return [];
  
  const streams = new Set(
    standardizedSubjects
      .filter(s => s.board === board && s.gradeLevel === grade && s.stream)
      .map(s => s.stream)
  );
  
  return Array.from(streams).filter(Boolean) as string[];
}