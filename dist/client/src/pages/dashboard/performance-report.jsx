var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import { CalendarIcon, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
var Performance = function () {
    var user = useAuth().user;
    var _a = useState("all"), selectedSubject = _a[0], setSelectedSubject = _a[1];
    var _b = useState(undefined), startDate = _b[0], setStartDate = _b[1];
    var _c = useState(undefined), endDate = _c[0], setEndDate = _c[1];
    // Get subjects that user has taken tests for
    var _d = useQuery({
        queryKey: ['/api/quizzes/performance/subjects'],
        enabled: !!user,
    }).data, subjects = _d === void 0 ? [] : _d;
    var _e = useQuery({
        queryKey: ['/api/quizzes/performance', selectedSubject, startDate, endDate],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var url, params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/quizzes/performance';
                        params = new URLSearchParams();
                        if (selectedSubject && selectedSubject !== "all") {
                            params.append('subjectId', selectedSubject);
                        }
                        if (startDate) {
                            params.append('startDate', startDate.toISOString());
                        }
                        if (endDate) {
                            params.append('endDate', endDate.toISOString());
                        }
                        if (params.toString()) {
                            url += "?".concat(params.toString());
                        }
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to fetch performance data');
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: !!user,
    }), performanceData = _e.data, isLoading = _e.isLoading;
    var resetFilters = function () {
        setSelectedSubject("all");
        setStartDate(undefined);
        setEndDate(undefined);
    };
    var getPerformanceAverageByDate = function () {
        if (!performanceData || performanceData.length === 0)
            return [];
        // Group by date and calculate average score
        var groupedData = performanceData.reduce(function (acc, current) {
            if (!acc[current.date]) {
                acc[current.date] = { total: current.score, count: 1 };
            }
            else {
                acc[current.date].total += current.score;
                acc[current.date].count += 1;
            }
            return acc;
        }, {});
        // Convert to array format for chart
        return Object.entries(groupedData).map(function (_a) {
            var date = _a[0], data = _a[1];
            return ({
                date: date,
                score: Math.round(data.total / data.count),
                quizSet: 1 // or use a real value if needed
            });
        });
    };
    var calculateAverageScore = function () {
        if (!performanceData || performanceData.length === 0)
            return 0;
        var total = performanceData.reduce(function (sum, item) { return sum + item.score; }, 0);
        return Math.round(total / performanceData.length);
    };
    var getScoreDistribution = function () {
        if (!performanceData || performanceData.length === 0)
            return { excellent: 0, good: 0, average: 0, needsImprovement: 0 };
        var counts = {
            excellent: 0, // 90-100%
            good: 0, // 75-89%
            average: 0, // 60-74%
            needsImprovement: 0 // Below 60%
        };
        performanceData.forEach(function (item) {
            if (item.score >= 90)
                counts.excellent++;
            else if (item.score >= 75)
                counts.good++;
            else if (item.score >= 60)
                counts.average++;
            else
                counts.needsImprovement++;
        });
        return counts;
    };
    var chartData = getPerformanceAverageByDate();
    var averageScore = calculateAverageScore();
    var scoreDistribution = getScoreDistribution();
    var completedQuizzes = (performanceData === null || performanceData === void 0 ? void 0 : performanceData.length) || 0;
    return (<div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Performance Analysis</h1>
        
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <Label htmlFor="subject-filter">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject-filter" className="w-[180px]">
                <SelectValue placeholder="All Subjects"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects === null || subjects === void 0 ? void 0 : subjects.map(function (subject) { return (<SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>); })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                 {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus/>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus/>
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={resetFilters} variant="outline" size="icon">
            <Filter className="h-4 w-4"/>
          </Button>
        </div>

        {isLoading ? (<div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
          </div>) : (<div className="grid gap-6 lg:grid-cols-2">
            {/* Performance Overview Cards */}
            <div className="lg:col-span-2 grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedQuizzes}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Excellent Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scoreDistribution.excellent}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">90-100%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Needs Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scoreDistribution.needsImprovement}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Below 60%</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Your quiz scores over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (<PerformanceChart data={chartData}/>) : (<div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p>No performance data available for the selected period.</p>
                  </div>)}
              </CardContent>
            </Card>
          </div>)}
      </div>
    </div>);
};
// Render redeploy fix attempt 1
export default Performance;
