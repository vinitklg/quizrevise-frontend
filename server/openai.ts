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
          content: `You are an expert educational content creator specializing in ${board} curriculum for grade ${grade} students. 
          Create ${numberOfQuestions} questions for a quiz on the subject ${subject}, chapter "${chapter}", focusing on the topic "${topic}".
          
          Use the following question types: ${questionTypes.join(', ')}.
          Incorporate Bloom's Taxonomy levels: ${bloomTaxonomyLevels.join(', ')}.
          Include questions at these difficulty levels: ${difficultyLevels.join(', ')}.
          
          For each question, provide:
          1. The question text
          2. Four options (A, B, C, D)
          3. The correct answer (as the letter)
          4. A brief explanation of why the answer is correct
          5. The question type used (from the provided types)
          6. The Bloom's Taxonomy level targeted
          7. The difficulty level assigned
          
          This is set ${setNumber} of 8 for a spaced repetition learning system. Ensure questions test genuine understanding at the appropriate cognitive levels.
          
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
