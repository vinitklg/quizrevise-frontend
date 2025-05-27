import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface Subject {
  code: string;
  name: string;
  board: string;
  gradeLevel: number;
  stream: string | null;
  isCore: boolean;
}

interface SubjectSelectionProps {
  board: string;
  grade: number;
  stream?: string;
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  onStreamChange?: (stream: string) => void;
}

// Using the standardized subjects from server
const mockSubjects: Subject[] = [
  // CBSE Class 10
  { code: "CBSE_10_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_SCIENCE", name: "Science", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_ENGLISH", name: "English", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_SOCIAL", name: "Social Science", board: "CBSE", gradeLevel: 10, stream: null, isCore: true },
  { code: "CBSE_10_HINDI", name: "Hindi", board: "CBSE", gradeLevel: 10, stream: null, isCore: false },
  
  // CBSE Class 11 Commerce
  { code: "CBSE_11_COMMERCE_ACCOUNTANCY", name: "Accountancy", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_BUSINESS", name: "Business Studies", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_ECONOMICS", name: "Economics", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: true },
  { code: "CBSE_11_COMMERCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 11, stream: "Commerce", isCore: false },
  
  // CBSE Class 11 Science
  { code: "CBSE_11_SCIENCE_PHYSICS", name: "Physics", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_CHEMISTRY", name: "Chemistry", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_MATH", name: "Mathematics", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
  { code: "CBSE_11_SCIENCE_BIOLOGY", name: "Biology", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: false },
  { code: "CBSE_11_SCIENCE_ENGLISH", name: "English", board: "CBSE", gradeLevel: 11, stream: "Science", isCore: true },
];

export default function SubjectSelection({ 
  board, 
  grade, 
  stream, 
  selectedSubjects, 
  onSubjectsChange,
  onStreamChange 
}: SubjectSelectionProps) {
  const [availableStreams, setAvailableStreams] = useState<string[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

  // Fetch subjects from the database
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
    enabled: !!board && !!grade,
  });

  useEffect(() => {
    // Get available streams for grades 11-12
    if (grade >= 11 && subjects.length > 0) {
      const streams = Array.from(new Set(
        subjects
          .filter(s => s.board === board && s.gradeLevel === grade && s.stream)
          .map(s => s.stream)
      )).filter(Boolean) as string[];
      setAvailableStreams(streams);
    } else {
      setAvailableStreams([]);
    }
  }, [board, grade, subjects]);

  useEffect(() => {
    // Filter subjects based on board, grade, and stream
    if (subjects.length > 0) {
      let filteredSubs = subjects.filter(s => 
        s.board === board && s.gradeLevel === grade
      );

      if (grade <= 10) {
        filteredSubs = filteredSubs.filter(s => s.stream === null);
      } else if (stream) {
        filteredSubs = filteredSubs.filter(s => s.stream === stream);
      }

      setFilteredSubjects(filteredSubs);
    }
  }, [board, grade, stream, subjects]);

  const handleSubjectToggle = (subjectCode: string) => {
    const newSelected = selectedSubjects.includes(subjectCode)
      ? selectedSubjects.filter(code => code !== subjectCode)
      : [...selectedSubjects, subjectCode];
    
    onSubjectsChange(newSelected);
  };

  const coreSubjects = filteredSubjects.filter(s => s.isCore);
  const electiveSubjects = filteredSubjects.filter(s => !s.isCore);

  return (
    <div className="space-y-6">
      {/* Stream Selection for Class 11-12 */}
      {grade >= 11 && availableStreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={stream || ""} onValueChange={onStreamChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your stream" />
              </SelectTrigger>
              <SelectContent>
                {availableStreams.map(streamOption => (
                  <SelectItem key={streamOption} value={streamOption}>
                    {streamOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Core Subjects */}
      {coreSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Core Subjects
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                (Required)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreSubjects.map(subject => (
                <div key={subject.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.code}
                    checked={selectedSubjects.includes(subject.code)}
                    onCheckedChange={() => handleSubjectToggle(subject.code)}
                  />
                  <Label 
                    htmlFor={subject.code} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elective Subjects */}
      {electiveSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Elective Subjects
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                (Optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {electiveSubjects.map(subject => (
                <div key={subject.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.code}
                    checked={selectedSubjects.includes(subject.code)}
                    onCheckedChange={() => handleSubjectToggle(subject.code)}
                  />
                  <Label 
                    htmlFor={subject.code} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Subjects Summary */}
      {selectedSubjects.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Selected Subjects ({selectedSubjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map(code => {
                const subject = filteredSubjects.find(s => s.code === code);
                return subject ? (
                  <span 
                    key={code}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {subject.name}
                  </span>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}