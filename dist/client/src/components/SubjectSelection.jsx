var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
// Using the standardized subjects from server
var mockSubjects = [
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
export default function SubjectSelection(_a) {
    var board = _a.board, grade = _a.grade, stream = _a.stream, selectedSubjects = _a.selectedSubjects, onSubjectsChange = _a.onSubjectsChange, onStreamChange = _a.onStreamChange;
    var _b = useState([]), availableStreams = _b[0], setAvailableStreams = _b[1];
    var _c = useState([]), filteredSubjects = _c[0], setFilteredSubjects = _c[1];
    // Fetch subjects from the database
    var _d = useQuery({
        queryKey: ["/api/subjects"],
        enabled: !!board && !!grade,
    }).data, subjects = _d === void 0 ? [] : _d;
    useEffect(function () {
        // Get available streams for grades 11-12
        if (grade >= 11 && subjects.length > 0) {
            var streams = Array.from(new Set(subjects
                .filter(function (s) { return s.board === board && s.gradeLevel === grade && s.stream; })
                .map(function (s) { return s.stream; }))).filter(Boolean);
            setAvailableStreams(streams);
        }
        else {
            setAvailableStreams([]);
        }
    }, [board, grade, subjects]);
    useEffect(function () {
        // Filter subjects based on board, grade, and stream
        if (subjects.length > 0) {
            var filteredSubs = subjects.filter(function (s) {
                return s.board === board && s.gradeLevel === grade;
            });
            if (grade <= 10) {
                // For grades 6-10, show subjects with no stream
                filteredSubs = filteredSubs.filter(function (s) { return s.stream === null; });
            }
            else if (stream) {
                // For grades 11-12 with stream selected:
                // Show core subjects (no stream) + elective subjects for the selected stream
                filteredSubs = filteredSubs.filter(function (s) {
                    return s.stream === null || s.stream === stream;
                });
            }
            else {
                // For grades 11-12 with no stream selected, show only core subjects
                filteredSubs = filteredSubs.filter(function (s) { return s.stream === null; });
            }
            setFilteredSubjects(filteredSubs);
        }
    }, [board, grade, stream, subjects]);
    var handleSubjectToggle = function (subjectCode) {
        var newSelected = selectedSubjects.includes(subjectCode)
            ? selectedSubjects.filter(function (code) { return code !== subjectCode; })
            : __spreadArray(__spreadArray([], selectedSubjects, true), [subjectCode], false);
        onSubjectsChange(newSelected);
    };
    var coreSubjects = filteredSubjects.filter(function (s) { return s.isCore; });
    var electiveSubjects = filteredSubjects.filter(function (s) { return !s.isCore; });
    return (<div className="space-y-6">
      {/* Stream Selection for Class 11-12 */}
      {grade >= 11 && availableStreams.length > 0 && (<Card>
          <CardHeader>
            <CardTitle>Select Your Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={stream || ""} onValueChange={onStreamChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your stream"/>
              </SelectTrigger>
              <SelectContent>
                {availableStreams.map(function (streamOption) { return (<SelectItem key={streamOption} value={streamOption}>
                    {streamOption}
                  </SelectItem>); })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>)}

      {/* Core Subjects */}
      {coreSubjects.length > 0 && (<Card>
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
              {coreSubjects.map(function (subject) { return (<div key={subject.code} className="flex items-center space-x-2">
                  <Checkbox id={subject.code} checked={selectedSubjects.includes(subject.code)} onCheckedChange={function () { return handleSubjectToggle(subject.code); }}/>
                  <Label htmlFor={subject.code} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subject.name}
                  </Label>
                </div>); })}
            </div>
          </CardContent>
        </Card>)}

      {/* Elective Subjects */}
      {electiveSubjects.length > 0 && (<Card>
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
              {electiveSubjects.map(function (subject) { return (<div key={subject.code} className="flex items-center space-x-2">
                  <Checkbox id={subject.code} checked={selectedSubjects.includes(subject.code)} onCheckedChange={function () { return handleSubjectToggle(subject.code); }}/>
                  <Label htmlFor={subject.code} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subject.name}
                  </Label>
                </div>); })}
            </div>
          </CardContent>
        </Card>)}

      {/* Selected Subjects Summary */}
      {selectedSubjects.length > 0 && (<Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Selected Subjects ({selectedSubjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map(function (code) {
                var subject = filteredSubjects.find(function (s) { return s.code === code; });
                return subject ? (<span key={code} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {subject.name}
                  </span>) : null;
            })}
            </div>
          </CardContent>
        </Card>)}
    </div>);
}
