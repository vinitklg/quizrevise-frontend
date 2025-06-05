import { db } from "./db.js";
import { subjects } from "../shared/schema.js";
import { subjectData } from "./subjectData.js"; // your current file

export async function seedStandardizedSubjects() {
  try {
    console.log("Seeding standardized subjects...");

    // 🔄 Flatten subjectData into a flat array
    const allSubjects = Object.entries(subjectData).flatMap(([board, grades]) =>
      Object.entries(grades).flatMap(([grade, subjectsList]) =>
        subjectsList.map(subject => ({
          code: subject.code,
          name: subject.name,
          board,
          gradeLevel: parseInt(grade),
          stream: subject.stream || null,
         is_core: subject.isCore,

        }))
      )
    );

    for (const subject of allSubjects) {
      await db.insert(subjects).values(subject).onConflictDoNothing();
    }

    console.log(`✅ Successfully seeded ${allSubjects.length} standardized subjects`);
  } catch (error) {
    console.error("❌ Error seeding subjects:", error);
    throw error;
  }
}
