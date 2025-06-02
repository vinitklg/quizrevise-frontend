import { db } from "./db";
import { subjects } from "@shared/schema";
import { standardizedSubjects } from "./subjectData";

export async function seedStandardizedSubjects() {
  try {
    console.log("Seeding standardized subjects...");
    
    // Insert all standardized subjects
    for (const subject of standardizedSubjects) {
      await db.insert(subjects).values(subject).onConflictDoNothing();
    }
    
    console.log(`Successfully seeded ${standardizedSubjects.length} standardized subjects`);
  } catch (error) {
    console.error("Error seeding subjects:", error);
    throw error;
  }
}