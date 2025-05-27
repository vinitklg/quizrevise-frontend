// Standardized subject data for different boards, classes, and streams
export const standardizedSubjects = [
  // CBSE Classes 6-10 (Common Core Subjects)
  { code: "CBSE_6_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_ENGLISH", name: "English", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "CBSE_6_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 6, stream: null, isCore: false },
  { code: "CBSE_6_SANSKRIT", name: "Sanskrit", board: "CBSE", gradeLevel: 6, stream: null, isCore: false },

  { code: "CBSE_7_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_ENGLISH", name: "English", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "CBSE_7_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 7, stream: null, isCore: false },
  { code: "CBSE_7_SANSKRIT", name: "Sanskrit", board: "CBSE", gradeLevel: 7, stream: null, isCore: false },

  { code: "CBSE_8_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_ENGLISH", name: "English", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "CBSE_8_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 8, stream: null, isCore: false },
  { code: "CBSE_8_SANSKRIT", name: "Sanskrit", board: "CBSE", gradeLevel: 8, stream: null, isCore: false },

  { code: "CBSE_9_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_ENGLISH", name: "English", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "CBSE_9_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 9, stream: null, isCore: false },
  { code: "CBSE_9_SANSKRIT", name: "Sanskrit", board: "CBSE", gradeLevel: 9, stream: null, isCore: false },

  { code: "CBSE_10_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_ENGLISH", name: "English", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 10, stream: null, isCore: false },
  { code: "CBSE_10_SANSKRIT", name: "Sanskrit", board: "CBSE", gradeLevel: 10, stream: null, isCore: false },

  // CBSE Class 11-12 Science Stream
  { code: "CBSE_11_SCIENCE_PHYSICS", name: "Physics", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_CHEMISTRY", name: "Chemistry", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_BIOLOGY", name: "Biology", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: false },
  { code: "CBSE_11_SCIENCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_COMPUTER", name: "Computer Science", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: false },

  { code: "CBSE_12_SCIENCE_PHYSICS", name: "Physics", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_CHEMISTRY", name: "Chemistry", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_BIOLOGY", name: "Biology", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: false },
  { code: "CBSE_12_SCIENCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "CBSE_12_SCIENCE_COMPUTER", name: "Computer Science", board: "CBSE", gradeLevel: 12, stream: "Science", isCore: false },

  // CBSE Class 11-12 Commerce Stream
  { code: "CBSE_11_COMMERCE_ACCOUNTANCY", name: "Accountancy", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_BUSINESS", name: "Business Studies", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: false },
  { code: "CBSE_11_COMMERCE_IP", name: "Informatics Practices", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: false },

  { code: "CBSE_12_COMMERCE_ACCOUNTANCY", name: "Accountancy", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_BUSINESS", name: "Business Studies", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "CBSE_12_COMMERCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: false },
  { code: "CBSE_12_COMMERCE_IP", name: "Informatics Practices", board: "CBSE", gradeLevel: 12, stream: "Commerce", isCore: false },

  // CBSE Class 11-12 Humanities Stream
  { code: "CBSE_11_HUMANITIES_HISTORY", name: "History", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_GEOGRAPHY", name: "Geography", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_POLITICAL", name: "Political Science", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "CBSE_11_HUMANITIES_PSYCHOLOGY", name: "Psychology", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: false },
  { code: "CBSE_11_HUMANITIES_SOCIOLOGY", name: "Sociology", board: "CBSE", gradeLevel: 11, stream: "Humanities", isCore: false },

  { code: "CBSE_12_HUMANITIES_HISTORY", name: "History", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_GEOGRAPHY", name: "Geography", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_POLITICAL", name: "Political Science", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_ENGLISH", name: "English", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "CBSE_12_HUMANITIES_PSYCHOLOGY", name: "Psychology", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: false },
  { code: "CBSE_12_HUMANITIES_SOCIOLOGY", name: "Sociology", board: "CBSE", gradeLevel: 12, stream: "Humanities", isCore: false },

  // ICSE Classes 6-10
  { code: "ICSE_6_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_ENGLISH", name: "English", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },
  { code: "ICSE_6_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 6, stream: null, isCore: true },

  { code: "ICSE_7_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "ICSE_7_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "ICSE_7_ENGLISH", name: "English", board: "ICSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "ICSE_7_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 7, stream: null, isCore: true },
  { code: "ICSE_7_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 7, stream: null, isCore: true },

  { code: "ICSE_8_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "ICSE_8_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "ICSE_8_ENGLISH", name: "English", board: "ICSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "ICSE_8_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 8, stream: null, isCore: true },
  { code: "ICSE_8_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 8, stream: null, isCore: true },

  // ICSE Classes 9-10 (With Commerce Options)
  { code: "ICSE_9_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "ICSE_9_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "ICSE_9_ENGLISH", name: "English", board: "ICSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "ICSE_9_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "ICSE_9_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 9, stream: null, isCore: true },
  { code: "ICSE_9_COMMERCIAL_STUDIES", name: "Commercial Studies", board: "ICSE", gradeLevel: 9, stream: null, isCore: false },
  { code: "ICSE_9_ECONOMICS", name: "Economics", board: "ICSE", gradeLevel: 9, stream: null, isCore: false },

  { code: "ICSE_10_MATH", name: "Mathematics", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_SCIENCE", name: "Science", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_ENGLISH", name: "English", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_HISTORY", name: "History & Civics", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_GEOGRAPHY", name: "Geography", board: "ICSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "ICSE_10_COMMERCIAL_STUDIES", name: "Commercial Studies", board: "ICSE", gradeLevel: 10, stream: null, isCore: false },
  { code: "ICSE_10_ECONOMICS", name: "Economics", board: "ICSE", gradeLevel: 10, stream: null, isCore: false },

  // ISC Classes 11-12 Science Stream
  { code: "ISC_11_SCIENCE_PHYSICS", name: "Physics", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_CHEMISTRY", name: "Chemistry", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_MATH", name: "Mathematics", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_BIOLOGY", name: "Biology", board: "ISC", gradeLevel: 11, stream: "Science", isCore: false },
  { code: "ISC_11_SCIENCE_ENGLISH", name: "English", board: "ISC", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "ISC_11_SCIENCE_COMPUTER", name: "Computer Science", board: "ISC", gradeLevel: 11, stream: "Science", isCore: false },

  { code: "ISC_12_SCIENCE_PHYSICS", name: "Physics", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_CHEMISTRY", name: "Chemistry", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_MATH", name: "Mathematics", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_BIOLOGY", name: "Biology", board: "ISC", gradeLevel: 12, stream: "Science", isCore: false },
  { code: "ISC_12_SCIENCE_ENGLISH", name: "English", board: "ISC", gradeLevel: 12, stream: "Science", isCore: true },
  { code: "ISC_12_SCIENCE_COMPUTER", name: "Computer Science", board: "ISC", gradeLevel: 12, stream: "Science", isCore: false },

  // ISC Classes 11-12 Commerce Stream
  { code: "ISC_11_COMMERCE_ACCOUNTS", name: "Accounts", board: "ISC", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "ISC_11_COMMERCE_BUSINESS", name: "Business Studies", board: "ISC", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "ISC_11_COMMERCE_ECONOMICS", name: "Economics", board: "ISC", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "ISC_11_COMMERCE_ENGLISH", name: "English", board: "ISC", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "ISC_11_COMMERCE_MATH", name: "Mathematics", board: "ISC", gradeLevel: 11, stream: "Commerce", isCore: false },

  { code: "ISC_12_COMMERCE_ACCOUNTS", name: "Accounts", board: "ISC", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "ISC_12_COMMERCE_BUSINESS", name: "Business Studies", board: "ISC", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "ISC_12_COMMERCE_ECONOMICS", name: "Economics", board: "ISC", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "ISC_12_COMMERCE_ENGLISH", name: "English", board: "ISC", gradeLevel: 12, stream: "Commerce", isCore: true },
  { code: "ISC_12_COMMERCE_MATH", name: "Mathematics", board: "ISC", gradeLevel: 12, stream: "Commerce", isCore: false },

  // ISC Classes 11-12 Humanities Stream
  { code: "ISC_11_HUMANITIES_HISTORY", name: "History", board: "ISC", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "ISC_11_HUMANITIES_GEOGRAPHY", name: "Geography", board: "ISC", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "ISC_11_HUMANITIES_POLITICAL", name: "Political Science", board: "ISC", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "ISC_11_HUMANITIES_ENGLISH", name: "English", board: "ISC", gradeLevel: 11, stream: "Humanities", isCore: true },
  { code: "ISC_11_HUMANITIES_SOCIOLOGY", name: "Sociology", board: "ISC", gradeLevel: 11, stream: "Humanities", isCore: false },

  { code: "ISC_12_HUMANITIES_HISTORY", name: "History", board: "ISC", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "ISC_12_HUMANITIES_GEOGRAPHY", name: "Geography", board: "ISC", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "ISC_12_HUMANITIES_POLITICAL", name: "Political Science", board: "ISC", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "ISC_12_HUMANITIES_ENGLISH", name: "English", board: "ISC", gradeLevel: 12, stream: "Humanities", isCore: true },
  { code: "ISC_12_HUMANITIES_SOCIOLOGY", name: "Sociology", board: "ISC", gradeLevel: 12, stream: "Humanities", isCore: false },
];

// Helper function to get subjects by board, grade, and stream
export function getSubjectsByBoardGradeStream(board: string, grade: number, stream?: string) {
  return standardizedSubjects.filter(subject => 
    subject.board === board && 
    subject.gradeLevel === grade &&
    (grade <= 10 ? subject.stream === null : subject.stream === stream)
  );
}

// Helper function to get available streams for a board and grade
export function getAvailableStreams(board: string, grade: number) {
  if (grade <= 10) return [];
  
  const streams = new Set(
    standardizedSubjects
      .filter(subject => subject.board === board && subject.gradeLevel === grade)
      .map(subject => subject.stream)
      .filter(stream => stream !== null)
  );
  
  return Array.from(streams);
}