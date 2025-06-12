import { db } from "./db.js";
import { subjects, chapters, topics } from "../shared/schema.js";
import { eq, and } from "drizzle-orm";
// Comprehensive curriculum data for CBSE, ICSE, and ISC
const curriculumData = {
    "CBSE": {
        "6": {
            "Mathematics": {
                "Number System": [
                    "Natural Numbers",
                    "Whole Numbers",
                    "Integers",
                    "Fractions",
                    "Decimals"
                ],
                "Algebra": [
                    "Introduction to Algebra",
                    "Linear Equations",
                    "Simple Equations"
                ],
                "Geometry": [
                    "Basic Geometric Shapes",
                    "Lines and Angles",
                    "Triangles",
                    "Quadrilaterals"
                ]
            },
            "Science": {
                "Physics": [
                    "Motion and Measurement",
                    "Light and Shadows",
                    "Electricity and Circuits"
                ],
                "Chemistry": [
                    "Materials and Their Properties",
                    "Acids and Bases",
                    "Mixtures and Solutions"
                ],
                "Biology": [
                    "Living and Non-living",
                    "Plants",
                    "Animals",
                    "Human Body"
                ]
            }
        },
        "10": {
            "Mathematics": {
                "Number System": [
                    "Real Numbers",
                    "Euclid's Division Algorithm",
                    "Rational and Irrational Numbers"
                ],
                "Algebra": [
                    "Polynomials",
                    "Linear Equations in Two Variables",
                    "Quadratic Equations"
                ],
                "Geometry": [
                    "Triangles",
                    "Coordinate Geometry",
                    "Circles"
                ],
                "Trigonometry": [
                    "Introduction to Trigonometry",
                    "Trigonometric Identities",
                    "Heights and Distances"
                ],
                "Statistics": [
                    "Statistics",
                    "Probability"
                ]
            },
            "Science": {
                "Physics": [
                    "Light - Reflection and Refraction",
                    "Human Eye and Colorful World",
                    "Electricity",
                    "Magnetic Effects of Electric Current"
                ],
                "Chemistry": [
                    "Acids, Bases and Salts",
                    "Metals and Non-metals",
                    "Carbon and its Compounds"
                ],
                "Biology": [
                    "Life Processes",
                    "Control and Coordination",
                    "Reproduction",
                    "Heredity and Evolution"
                ]
            }
        },
        "12": {
            "Mathematics": {
                "Relations and Functions": [
                    "Types of Relations",
                    "Types of Functions",
                    "Composition of Functions",
                    "Inverse Functions"
                ],
                "Algebra": [
                    "Matrices",
                    "Determinants",
                    "Linear Programming"
                ],
                "Calculus": [
                    "Limits and Derivatives",
                    "Applications of Derivatives",
                    "Integrals",
                    "Applications of Integrals",
                    "Differential Equations"
                ],
                "Vector Algebra": [
                    "Vector Operations",
                    "Scalar and Vector Products"
                ],
                "Probability": [
                    "Conditional Probability",
                    "Bayes' Theorem",
                    "Random Variables"
                ]
            },
            "Physics": {
                "Electrostatics": [
                    "Electric Charges",
                    "Electric Field",
                    "Electric Potential",
                    "Capacitance"
                ],
                "Current Electricity": [
                    "Electric Current",
                    "Ohm's Law",
                    "Electrical Energy and Power"
                ],
                "Magnetic Effects": [
                    "Magnetic Field",
                    "Electromagnetic Induction",
                    "AC Circuits"
                ],
                "Optics": [
                    "Ray Optics",
                    "Wave Optics"
                ],
                "Modern Physics": [
                    "Dual Nature of Matter",
                    "Atoms and Nuclei",
                    "Electronic Devices"
                ]
            },
            "Chemistry": {
                "Physical Chemistry": [
                    "Chemical Kinetics",
                    "Thermodynamics",
                    "Electrochemistry",
                    "Solutions"
                ],
                "Inorganic Chemistry": [
                    "p-Block Elements",
                    "d-Block Elements",
                    "Coordination Compounds"
                ],
                "Organic Chemistry": [
                    "Alcohols and Phenols",
                    "Aldehydes and Ketones",
                    "Carboxylic Acids",
                    "Amines"
                ]
            },
            "Biology": {
                "Reproduction": [
                    "Sexual Reproduction in Plants",
                    "Human Reproduction",
                    "Reproductive Health"
                ],
                "Genetics": [
                    "Heredity and Variation",
                    "Molecular Basis of Inheritance"
                ],
                "Evolution": [
                    "Evolution",
                    "Human Evolution"
                ],
                "Ecology": [
                    "Organisms and Environment",
                    "Ecosystem",
                    "Biodiversity"
                ]
            }
        }
    },
    "ICSE": {
        "10": {
            "Mathematics": {
                "Algebra": [
                    "Linear Inequations",
                    "Quadratic Equations",
                    "Ratio and Proportion"
                ],
                "Geometry": [
                    "Similarity",
                    "Locus",
                    "Circles"
                ],
                "Trigonometry": [
                    "Trigonometric Identities",
                    "Heights and Distances"
                ],
                "Statistics": [
                    "Mean, Median, Mode",
                    "Histograms"
                ]
            },
            "Physics": {
                "Force and Laws of Motion": [
                    "Force and Pressure",
                    "Work, Energy and Power",
                    "Machines"
                ],
                "Heat and Light": [
                    "Heat and Temperature",
                    "Calorimetry",
                    "Light"
                ],
                "Sound": [
                    "Sound Waves",
                    "Reflection of Sound"
                ],
                "Electricity": [
                    "Current Electricity",
                    "Household Circuits"
                ]
            },
            "Chemistry": {
                "Acids and Bases": [
                    "Acids, Bases and Salts",
                    "pH Scale"
                ],
                "Metals": [
                    "Metals and Non-metals",
                    "Metallurgy"
                ],
                "Carbon Compounds": [
                    "Organic Chemistry",
                    "Ethanol and Ethanoic Acid"
                ]
            },
            "Biology": {
                "Plant Biology": [
                    "Photosynthesis",
                    "Transpiration",
                    "Excretion in Plants"
                ],
                "Human Biology": [
                    "Respiratory System",
                    "Circulatory System",
                    "Excretory System",
                    "Nervous System"
                ]
            }
        }
    }
};
export async function seedDatabase() {
    console.log("Starting database seeding...");
    try {
        for (const [board, grades] of Object.entries(curriculumData)) {
            for (const [grade, subjects_data] of Object.entries(grades)) {
                for (const [subjectName, chapters_data] of Object.entries(subjects_data)) {
                    // Create or get subject
                    let subject = await db.select().from(subjects)
                        .where(and(eq(subjects.name, subjectName), eq(subjects.board, board), eq(subjects.gradeLevel, parseInt(grade)))).then(rows => rows[0]);
                    if (!subject) {
                        [subject] = await db.insert(subjects).values({
                            code: `${board}_${grade}_${subjectName}`.toUpperCase().replace(/\s+/g, "_"),
                            name: subjectName,
                            gradeLevel: parseInt(grade),
                            board: board
                        }).returning();
                        console.log(`Created subject: ${subjectName} for ${board} Grade ${grade}`);
                    }
                    // Create chapters and topics
                    for (const [chapterName, topicsArray] of Object.entries(chapters_data)) {
                        // Create or get chapter
                        let chapter = await db.select().from(chapters)
                            .where(and(eq(chapters.name, chapterName), eq(chapters.subjectId, subject.id))).then(rows => rows[0]);
                        if (!chapter) {
                            [chapter] = await db.insert(chapters).values({
                                subjectId: subject.id,
                                name: chapterName,
                                description: `${chapterName} - ${subjectName} (${board} Grade ${grade})`
                            }).returning();
                            console.log(`Created chapter: ${chapterName} in ${subjectName}`);
                        }
                        // Create topics
                        for (const topicName of topicsArray) {
                            const existingTopic = await db.select().from(topics)
                                .where(and(eq(topics.name, topicName), eq(topics.chapterId, chapter.id))).then(rows => rows[0]);
                            if (!existingTopic) {
                                await db.insert(topics).values({
                                    chapterId: chapter.id,
                                    subjectId: subject.id,
                                    name: topicName,
                                    description: `${topicName} - ${chapterName} (${subjectName})`
                                });
                                console.log(`Created topic: ${topicName} in ${chapterName}`);
                            }
                        }
                    }
                }
            }
        }
        console.log("Database seeding completed successfully!");
    }
    catch (error) {
        console.error("Error during database seeding:", error);
        throw error;
    }
}
