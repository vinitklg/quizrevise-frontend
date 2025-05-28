import OpenAI from "openai";
import { getPromptForSubject, substitutePromptVariables, type PromptVariables } from "./prompts";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate quiz questions based on subject, chapter, topic, and various parameters
export async function generateQuizQuestions(
  subject: string,
  chapter: string,
  topic: string,
  grade: number,
  board: string,
  questionTypes: string[],
  bloomTaxonomyLevels: string[],
  difficultyLevels: string[],
  numberOfQuestions: number,
  setNumber: number
): Promise<{
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    questionType: string;
    bloomTaxonomy: string;
    difficultyLevel: string;
  }>;
}> {
  try {
    // Get the appropriate prompt for the subject
    const basePrompt = getPromptForSubject(subject);
    
    // Prepare variables for prompt substitution
    const promptVariables: PromptVariables = {
      board,
      class: grade.toString(),
      subject,
      chapter,
      topic,
      number_of_questions: numberOfQuestions,
      question_type: questionTypes.join(", "),
      blooms_level: difficultyLevels.join(", ")
    };
    
    // Substitute variables in the prompt
    const customizedPrompt = substitutePromptVariables(basePrompt, promptVariables);
    
    // Add JSON formatting instruction
    const finalPrompt = `${customizedPrompt}

IMPORTANT: Format your response as a valid JSON object with the following structure:
{
  "questions": [
    {
      "id": 1,
      "questionType": "mcq",
      "question": "Question text here",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correctAnswer": "A",
      "explanation": "Detailed step-by-step solution",
      "bloomTaxonomy": "Application",
      "difficultyLevel": "Moderate",
      "diagram_instruction": "Draw triangle ABC with AB = 6 cm, angle B = 90°, mark all angles and sides clearly"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. questionType must be exactly one of: "mcq", "assertion-reasoning", "true-false"
2. For MCQ questions, options must be formatted as ["A. Text", "B. Text", "C. Text", "D. Text"]
3. correctAnswer must be just the letter: "A", "B", "C", or "D"
4. For geometry, physics diagrams, chemistry apparatus, or biology structures, ALWAYS include diagram_instruction
5. Generate exactly ${numberOfQuestions} questions following the subject-specific guidelines above.

This is set ${setNumber} of 8 for spaced repetition learning.`;

    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: finalPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error(`Failed to generate quiz questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Answer a student's doubt query
export async function answerDoubtQuery(
  question: string,
  subject: string,
  grade: number | string,
  board: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert educational tutor specializing in ${board} curriculum for grade ${grade} students. 
          A student has a doubt about ${subject}. Provide a clear, concise, and accurate answer to their question.
          Your explanation should be appropriate for their grade level but not oversimplified. Include relevant examples or diagrams if helpful.`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error answering doubt query:", error);
    throw new Error(`Failed to answer doubt query: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
