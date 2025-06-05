import OpenAI from "openai";
import { getPromptForSubject, substitutePromptVariables, type PromptVariables } from "./prompts.js";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate all quiz questions for spaced repetition in a single API call
export async function generateBatchQuizQuestions(
  subject: string,
  chapter: string,
  topic: string,
  grade: number,
  board: string,
  questionTypes: string[],
  bloomTaxonomyLevels: string[],
  difficultyLevels: string[],
  numberOfQuestions: number,
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
    setNumber: number;
    diagram_instruction?: string;
  }>;
}> {
  try {
    // Calculate total questions needed for spaced repetition
    const totalQuestions = Math.max(80, numberOfQuestions * 2.5); // Minimum 80, or 2.5x requested
    
    // Get the appropriate prompt for the subject
    const basePrompt = getPromptForSubject(subject);
    
    // Prepare variables for prompt substitution
    const promptVariables: PromptVariables = {
      board,
      class: grade.toString(),
      subject,
      chapter,
      topic,
      number_of_questions: totalQuestions,
      question_type: questionTypes.join(", "),
      blooms_level: difficultyLevels.join(", ")
    };
    
    // Substitute variables in the prompt
    let customizedPrompt = substitutePromptVariables(basePrompt, promptVariables);
    
    // Add diagram support instruction if enabled
    if (diagramSupport) {
      customizedPrompt += `\n\n**FORCE DIAGRAM GENERATION: Since diagram support is enabled, you MUST include a "diagram_instruction" field for every question that involves visual concepts, geometric shapes, scientific apparatus, biological structures, or any content that can be represented visually.**`;
    }
    
    // Add spaced repetition specific instructions
    const finalPrompt = `${customizedPrompt}

SPACED REPETITION QUIZ GENERATION:
Generate ${totalQuestions} questions for a comprehensive spaced repetition learning system.

QUESTION DISTRIBUTION:
- ${numberOfQuestions} core questions (difficulty progression from basic to advanced)
- ${totalQuestions - numberOfQuestions} supporting questions (variations, related concepts, challenging applications)

DIFFICULTY DISTRIBUTION:
- 20% Basic/Moderate questions (for initial learning)
- 20% Moderate/Challenging questions (for reinforcement)
- 60% Challenging/Advanced questions (for mastery)

IMPORTANT: Format your response as a valid JSON object:
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
      "setNumber": 1,
      "diagram_instruction": "Optional diagram instruction"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Generate exactly ${totalQuestions} unique questions
2. Include "setNumber" field: distribute questions across 8 sets (1-8)
3. Ensure variety in difficulty and question types
4. For geometry/science topics, include diagram_instruction when applicable
5. All questions must be educationally sound and curriculum-appropriate`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: finalPrompt }],
      response_format: { type: "json_object" }
    });

    const rawContent = response.choices[0].message.content || "{}";
    const result = JSON.parse(rawContent);
    
    // Process and validate questions
if (result.questions && Array.isArray(result.questions)) {
  result.questions = result.questions.map((question: any, index: number) => {
    // Assign default values
    question.id = question.id || index + 1;
    question.questionType = question.questionType || "mcq";
    question.question = question.question || "Question text missing";
    question.correctAnswer = question.correctAnswer || "A";
    question.explanation = question.explanation || "Explanation not provided";
    question.bloomTaxonomy = question.bloomTaxonomy || "Application";
    question.difficultyLevel = question.difficultyLevel || "Moderate";
    question.setNumber = question.setNumber || (Math.floor(index / (totalQuestions / 8)) + 1);

    // ✅ Add default options for true/false
    if (
      question.questionType === "true-false" &&
      (!question.options || Object.keys(question.options).length === 0)
    ) {
      question.options = {
        A: "True",
        B: "False"
      };
    }

    // ✅ Convert options from array to object format
    if (Array.isArray(question.options)) {
      const optionsObj: Record<string, string> = {};
      question.options.forEach((opt: string, idx: number) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        optionsObj[letter] = opt.replace(/^[A-D]\.?\s*/, '');
      });
      question.options = optionsObj;
    }

    // ✅ Return final processed question object
    return {
      id: question.id,
      questionType: question.questionType,
      question: question.question,
      options: question.options || {},
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      bloomTaxonomy: question.bloomTaxonomy,
      difficultyLevel: question.difficultyLevel,
      setNumber: question.setNumber,
      ...(question.diagram_instruction && { diagram_instruction: question.diagram_instruction })
    };
  });
}
    
    return result;
  } catch (error) {
    console.error("Error generating batch quiz questions:", error);
    throw new Error(`Failed to generate quiz questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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
    options: Record<string, string>;
    correctAnswer: string;
    explanation: string;
    questionType: string;
    bloomTaxonomy: string;
    difficultyLevel: string;
    diagram_instruction?: string;
  }>;
}> {
  try {
    const basePrompt = getPromptForSubject(subject);
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

    let customizedPrompt = substitutePromptVariables(basePrompt, promptVariables);

    if (diagramSupport) {
      customizedPrompt += `

**FORCE DIAGRAM GENERATION: Since diagram support is enabled, you MUST include a "diagram_instruction" field for every question that involves visual content.**`;
    }

    const finalPrompt = `${customizedPrompt}

IMPORTANT: Format your response as a valid JSON object like this:
{
  "questions": [
    {
      "id": 1,
      "questionType": "mcq",
      "question": "Question text here",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correctAnswer": "A",
      "explanation": "Explanation here",
      "bloomTaxonomy": "Application",
      "difficultyLevel": "Moderate",
      "diagram_instruction": "Draw triangle ABC..."
    }
  ]
}

REQUIREMENTS:
- Generate exactly ${numberOfQuestions} questions.
- Allowed types: "mcq", "assertion-reasoning", "true-false".
- For true-false, include only two options: A. True, B. False
- Set number: ${setNumber}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: finalPrompt }],
      response_format: { type: "json_object" }
    });

    const rawContent = response.choices[0].message.content || "{}";
    const result = JSON.parse(rawContent);

if (result.questions && Array.isArray(result.questions)) {
  result.questions = result.questions.map((question: any, index: number) => {
    const fixedQuestion = {
      id: question.id || index + 1,
      questionType: question.questionType || "mcq",
      question: question.question || "Question text missing",
      correctAnswer: question.correctAnswer || "A",
      explanation: question.explanation || "Explanation not provided",
      bloomTaxonomy: question.bloomTaxonomy || "Application",
      difficultyLevel: question.difficultyLevel || "Moderate",
      setNumber: question.setNumber || (Math.floor(index / 10) + 1),
      diagram_instruction: question.diagram_instruction || undefined,
      options: [] as string[],
    };

    if (
      fixedQuestion.questionType === "true-false" &&
      (!question.options || Object.keys(question.options).length === 0)
    ) {
      fixedQuestion.options = ["A. True", "B. False"];
    } else if (
      question.options &&
      typeof question.options === "object" &&
      !Array.isArray(question.options)
    ) {
      fixedQuestion.options = Object.entries(question.options).map(
        ([key, value]) => `${key}. ${value}`
      );
    } else if (Array.isArray(question.options)) {
      fixedQuestion.options = question.options.map((opt: string, idx: number) => {
        const letter = String.fromCharCode(65 + idx);
        return `${letter}. ${opt.replace(/^[A-D]\.?\s*/, '')}`;
      });
    }

    // ✅ Fallback if options are still empty
    if (!fixedQuestion.options || fixedQuestion.options.length === 0) {
      fixedQuestion.options = ["A. Option 1", "B. Option 2"];
    }

    return fixedQuestion;
  });
}

return result;
} catch (error) {
  console.error("Error generating quiz questions:", error);
  throw new Error(`Failed to generate quiz questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
} // ✅ catch
} // ✅ closing generateQuizQuestions

// ✅ New Function
export async function answerDoubtQuery(
  question: string,
  subject: string,
  grade: number | string,
  board: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
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
