export type Question = {
  id: number;
  question: string;
  options: string[] | Record<string, string>;
  correctAnswer: string;
  explanation: string;
  questionType: "mcq" | "true-false" | "assertion-reasoning" | "fill-in-blanks";
  bloomTaxonomy: string;
  difficultyLevel: string;
  setNumber?: number;
  diagram_instruction?: string;
  diagramUrl?: string;
};
