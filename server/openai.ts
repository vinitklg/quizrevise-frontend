import OpenAI from "openai";

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
    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an experienced Examination Head and Senior Board Paper Setter for the ${board} Board, Class ${grade}, Subject: ${subject}.

Use your intelligence and years of experience to generate exam-level questions aligned with the latest syllabus and the **National Education Policy (NEP)**. Your goal is to create **competency-based questions**, not direct rote-learning questions. The focus must be on **application, logic, real-life problem-solving, and deep understanding**.

Generate ${numberOfQuestions} ${questionTypes.join(', ')} questions from the topic '${topic}' in the chapter '${chapter}'.

Each question must reflect the ${bloomTaxonomyLevels.join(', ')} level of Bloom's Taxonomy.

Based on the selected level, adjust your tone and depth:
- If the level is **'Most Challenging' or 'Challenge'**, act like the strictest board examiner. Use your expertise to create **maximum tricky adjustments**, **multi-step problems**, **twists**, and **conceptual traps**. Confuse even toppers. Use realistic or cross-topic logic wherever possible.
- If the level is **'Application' or 'Moderate'**, use relatable life-like data and situations that require thinking and analysis.
- If the level is **'Basic' or 'Understanding'**, keep structure clean and simple for students to build confidence and grasp core ideas.

Use subject-specific formatting and logic:

- For **Accountancy**: Use Indian format for journal entries, ledger, narration, and rounding. Include: Date, Particulars, L.F., Dr./Cr. columns. Format currency as ₹1,00,000.
- For **Math**: **Only generate numerical problems. Do not give definitions, meanings, characteristics, or theory-based questions.** Use full board-style step-by-step solutions. Problems must test understanding through calculations, interpretation, and reasoning.
- For **Science**: Ask concept-based or competency-based questions (avoid definition recall). If needed, include experiment setup, analysis, or labeling instructions.
- For **English**: Create grammar, comprehension, or literature-based application questions. Do not explain answers unless asked.
- For **Social Science**: Use timeline reasoning, cause-effect, case-based, or map-based tasks with clear, context-rich framing.

This is set ${setNumber} of 8 for a spaced repetition learning system. Your responses must reflect real exam logic and academic excellence.

Format your response as a JSON object with an array of questions. Each question should have fields: question, options, correctAnswer, explanation, questionType, bloomTaxonomy, and difficultyLevel.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error(`Failed to generate quiz questions: ${error.message}`);
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

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error answering doubt query:", error);
    throw new Error(`Failed to answer doubt query: ${error.message}`);
  }
}
