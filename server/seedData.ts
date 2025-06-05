import { storage } from "./storage";

// Structured curriculum data for proper hierarchy
const curriculumStructure = {
  "CBSE": {
    6: {
      "Mathematics": {
        "Number System": ["Natural Numbers", "Whole Numbers", "Integers", "Fractions", "Decimals"],
        "Algebra": ["Introduction to Algebra", "Linear Equations", "Simple Equations"],
        "Geometry": ["Basic Geometric Shapes", "Lines and Angles", "Triangles"]
      },
      "Science": {
        "Physics": ["Motion and Measurement", "Light and Shadows", "Electricity"],
        "Chemistry": ["Materials and Properties", "Acids and Bases", "Mixtures"],
        "Biology": ["Living and Non-living", "Plants", "Animals", "Human Body"]
      }
    },
    10: {
      "Mathematics": {
        "Number System": ["Real Numbers", "Euclid's Division Algorithm", "Rational Numbers"],
        "Algebra": ["Polynomials", "Linear Equations in Two Variables", "Quadratic Equations"],
        "Geometry": ["Triangles", "Coordinate Geometry", "Circles"],
        "Trigonometry": ["Introduction to Trigonometry", "Trigonometric Identities", "Heights and Distances"],
        "Statistics": ["Statistics", "Probability"]
      },
      "Science": {
        "Physics": ["Light - Reflection and Refraction", "Human Eye", "Electricity", "Magnetic Effects"],
        "Chemistry": ["Acids, Bases and Salts", "Metals and Non-metals", "Carbon Compounds"],
        "Biology": ["Life Processes", "Control and Coordination", "Reproduction", "Heredity"]
      }
    },
    12: {
      "Mathematics": {
        "Relations and Functions": ["Types of Relations", "Types of Functions", "Composition of Functions"],
        "Algebra": ["Matrices", "Determinants", "Linear Programming"],
        "Calculus": ["Limits and Derivatives", "Applications of Derivatives", "Integrals", "Differential Equations"],
        "Vector Algebra": ["Vector Operations", "Scalar and Vector Products"],
        "Probability": ["Conditional Probability", "Bayes' Theorem", "Random Variables"]
      },
      "Physics": {
        "Electrostatics": ["Electric Charges", "Electric Field", "Electric Potential", "Capacitance"],
        "Current Electricity": ["Electric Current", "Ohm's Law", "Electrical Energy and Power"],
        "Magnetic Effects": ["Magnetic Field", "Electromagnetic Induction", "AC Circuits"],
        "Optics": ["Ray Optics", "Wave Optics"],
        "Modern Physics": ["Dual Nature of Matter", "Atoms and Nuclei", "Electronic Devices"]
      },
      "Chemistry": {
        "Physical Chemistry": ["Chemical Kinetics", "Thermodynamics", "Electrochemistry", "Solutions"],
        "Inorganic Chemistry": ["p-Block Elements", "d-Block Elements", "Coordination Compounds"],
        "Organic Chemistry": ["Alcohols and Phenols", "Aldehydes and Ketones", "Carboxylic Acids", "Amines"]
      },
      "Biology": {
        "Reproduction": ["Sexual Reproduction in Plants", "Human Reproduction", "Reproductive Health"],
        "Genetics": ["Heredity and Variation", "Molecular Basis of Inheritance"],
        "Evolution": ["Evolution", "Human Evolution"],
        "Ecology": ["Organisms and Environment", "Ecosystem", "Biodiversity"]
      }
    }
  },
  "ICSE": {
    10: {
      "Mathematics": {
        "Algebra": ["Linear Inequations", "Quadratic Equations", "Ratio and Proportion"],
        "Geometry": ["Similarity", "Locus", "Circles"],
        "Trigonometry": ["Trigonometric Identities", "Heights and Distances"],
        "Statistics": ["Mean, Median, Mode", "Histograms"]
      },
      "Physics": {
        "Force and Motion": ["Force and Pressure", "Work, Energy and Power", "Machines"],
        "Heat and Light": ["Heat and Temperature", "Calorimetry", "Light"],
        "Sound": ["Sound Waves", "Reflection of Sound"],
        "Electricity": ["Current Electricity", "Household Circuits"]
      },
      "Chemistry": {
        "Acids and Bases": ["Acids, Bases and Salts", "pH Scale"],
        "Metals": ["Metals and Non-metals", "Metallurgy"],
        "Carbon Compounds": ["Organic Chemistry", "Ethanol and Ethanoic Acid"]
      },
      "Biology": {
        "Plant Biology": ["Photosynthesis", "Transpiration", "Excretion in Plants"],
        "Human Biology": ["Respiratory System", "Circulatory System", "Excretory System", "Nervous System"]
      }
    }
  }
};

export async function seedCurriculumData() {
  console.log("Starting curriculum data seeding...");
  
  try {
    for (const [board, grades] of Object.entries(curriculumStructure)) {
      for (const [gradeStr, subjects] of Object.entries(grades)) {
        const grade = parseInt(gradeStr);
        
        for (const [subjectName, chapters] of Object.entries(subjects)) {
          // Create subject
          let subject;
          try {
            subject = await storage.createSubject({
  code: `${board}_${grade}_${subjectName}`.toUpperCase().replace(/\s+/g, "_"),
  name: subjectName,
  gradeLevel: grade,
  board: board
});

            console.log(`✓ Created subject: ${subjectName} (${board} Grade ${grade})`);
          } catch (error) {
            // Subject might already exist, try to get it
            const allSubjects = await storage.getAllSubjects();
            subject = allSubjects.find(s => 
              s.name === subjectName && 
              s.board === board && 
              s.gradeLevel === grade
            );
            if (!subject) throw error;
          }
          
          // Create chapters and topics
          for (const [chapterName, topics] of Object.entries(chapters)) {
            let chapter;
            try {
              chapter = await storage.createChapter({
                subjectId: subject.id,
                name: chapterName,
                description: `${chapterName} - ${subjectName} (${board} Grade ${grade})`
              });
              console.log(`  ✓ Created chapter: ${chapterName}`);
            } catch (error) {
              // Chapter might already exist, try to get it
              const allChapters = await storage.getChaptersBySubject(subject.id);
              chapter = allChapters.find(c => c.name === chapterName);
              if (!chapter) throw error;
            }
            
            // Create topics
            for (const topicName of topics) {
              try {
                await storage.createTopic({
                  chapterId: chapter.id,
                  subjectId: subject.id,
                  name: topicName,
                  description: `${topicName} - ${chapterName} (${subjectName})`
                });
                console.log(`    ✓ Created topic: ${topicName}`);
              } catch (error) {
                // Topic might already exist, skip
                console.log(`    - Topic already exists: ${topicName}`);
              }
            }
          }
        }
      }
    }
    
    console.log("✅ Curriculum data seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during curriculum seeding:", error);
    throw error;
  }
}