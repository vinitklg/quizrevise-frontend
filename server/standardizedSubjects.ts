import { db } from "./db.js";
import { subjects } from "../shared/schema.js";
import { subjectData } from "./subjectData.js";

// ✅ Flatten and transform the subject data properly
export const standardizedSubjects = Object.entries(subjectData).flatMap(
  ([board, grades]) =>
    Object.entries(grades).flatMap(([grade, subjectList]) =>
      subjectList.map((subject) => ({
        code: subject.code,
        name: subject.name,
        board,
        gradeLevel: parseInt(grade), // 🔁 convert string to number
        stream: subject.stream ?? null,
        is_core: subject.isCore, // ✅ match column name in Supabase
        description: null,
      }))
    )
);

// ✅ Seeding function
export async function seedStandardizedSubjects() {
  try {
    console.log("🚀 Seeding standardized subjects...");
    console.log("✅ Loaded subjects?", Array.isArray(standardizedSubjects), standardizedSubjects.length);

    for (const subject of standardizedSubjects) {
      console.log("🔍 DEBUG SUBJECT:", subject); // Optional: remove after success
      await db.insert(subjects).values(subject).onConflictDoNothing();
    }

    console.log(`✅ Successfully seeded ${standardizedSubjects.length} subjects`);
  } catch (error) {
    console.error("❌ Error seeding subjects:", error);
    throw error;
  }
}
seedStandardizedSubjects();
