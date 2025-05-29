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
  setNumber: number,
  diagramSupport: boolean = false
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
    let customizedPrompt = substitutePromptVariables(basePrompt, promptVariables);
    
    // Add diagram support instruction if enabled
    if (diagramSupport) {
      customizedPrompt += `\n\n**FORCE DIAGRAM GENERATION: Since diagram support is enabled, you MUST include a "diagram_instruction" field for every question that involves visual concepts, geometric shapes, scientific apparatus, biological structures, or any content that can be represented visually. 

DIAGRAM INSTRUCTION REQUIREMENTS FOR BOARD-LEVEL ACCURACY:
- Clearly mention all POINTS (use capital letters: A, B, C, P, Q, R, O)
- Specify all CHORDS with exact names (e.g., chord PQ, chord AB)
- Include precise ANGLE MEASUREMENTS (e.g., ∠PRQ = 70°, ∠POQ at center)
- Define exact POSITIONS (e.g., "Point R lies on the major arc of PQ", "Point R is on the circumference between P and Q")
- Specify CIRCLE CENTER (e.g., center O) and radius when applicable
- Indicate TYPE OF ANGLE (inscribed angle, central angle, angle in alternate segment)
- Ensure all points have LABELS (capital letters) and all segments are named
- Add measurement values wherever applicable in the question
- Example: "Draw a circle with center O. Chord PQ is drawn. Point R lies on the major arc of PQ. ∠PRQ = 70° (inscribed angle). Show angle ∠POQ at the center. Label all points clearly."

STRICT COMPLIANCE: Every geometry question must follow this exact format for diagram instructions.**`;
    }
    
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

    const rawContent = response.choices[0].message.content || "{}";
    console.log("Raw OpenAI response:", rawContent);
    
    try {
      const result = JSON.parse(rawContent);
      
      // Validate and fix question structure
      if (result.questions && Array.isArray(result.questions)) {
        result.questions = result.questions.map((question: any, index: number) => {
          // Ensure all required fields are present
          const fixedQuestion = {
            id: question.id || index + 1,
            questionType: question.questionType || "mcq",
            question: question.question || "Question text missing",
            options: question.options || {},
            correctAnswer: question.correctAnswer || "A",
            explanation: question.explanation || "Explanation not provided",
            bloomTaxonomy: question.bloomTaxonomy || "Application",
            difficultyLevel: question.difficultyLevel || "Moderate"
          };
          
          // Add diagram instruction if present
          if (question.diagram_instruction) {
            (fixedQuestion as any).diagram_instruction = question.diagram_instruction;
          }
          
          // Fix options format if it's an array instead of object
          if (Array.isArray(fixedQuestion.options)) {
            const optionsObj = {};
            fixedQuestion.options.forEach((option: string, idx: number) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              optionsObj[letter] = option.replace(/^[A-D]\.?\s*/, ''); // Remove existing letter prefix
            });
            fixedQuestion.options = optionsObj;
          }
          
          return fixedQuestion;
        });
      }
      
      return result;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Content that failed to parse:", rawContent);
      
      // Return a fallback structure with empty questions array
      return {
        questions: [],
        error: "Failed to parse AI response"
      };
    }
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
