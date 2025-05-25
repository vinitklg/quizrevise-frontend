import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import Sidebar from '@/components/dashboard/Sidebar';
import { CalendarIcon, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Performance = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Parse the user's preferred subjects into an array - same as Create Quiz page
  const preferredSubjects = user?.preferredSubject 
    ? user.preferredSubject.split(',').map(subject => subject.trim())
    : [];

  // Get only the subjects the user has taken quizzes for
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects/subscribed'],
    enabled: !!user,
  });

  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['/api/quizzes/performance', selectedSubject, startDate, endDate],
    queryFn: async () => {
      let url = '/api/quizzes/performance';
      const params = new URLSearchParams();
      
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
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      return response.json();
    },
    enabled: !!user,
  });

  const resetFilters = () => {
    setSelectedSubject("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getPerformanceAverageByDate = () => {
    if (!performanceData || performanceData.length === 0) return [];
    
    // Group by date and calculate average score
    const groupedData = performanceData.reduce((acc, current) => {
      if (!acc[current.date]) {
        acc[current.date] = { total: current.score, count: 1 };
      } else {
        acc[current.date].total += current.score;
        acc[current.date].count += 1;
      }
      return acc;
    }, {});
    
    // Convert to array format for chart
    return Object.keys(groupedData).map(date => ({
      date,
      score: Math.round(groupedData[date].total / groupedData[date].count),
      quizSet: groupedData[date].count
    }));
  };

  const calculateAverageScore = () => {
    if (!performanceData || performanceData.length === 0) return 0;
    
    const total = performanceData.reduce((sum, item) => sum + item.score, 0);
    return Math.round(total / performanceData.length);
  };

  const getScoreDistribution = () => {
    if (!performanceData || performanceData.length === 0) return { excellent: 0, good: 0, average: 0, needsImprovement: 0 };
    
    const counts = {
      excellent: 0,  // 90-100%
      good: 0,       // 75-89%
      average: 0,    // 60-74%
      needsImprovement: 0  // Below 60%
    };
    
    performanceData.forEach(item => {
      if (item.score >= 90) counts.excellent++;
      else if (item.score >= 75) counts.good++;
      else if (item.score >= 60) counts.average++;
      else counts.needsImprovement++;
    });
    
    return counts;
  };

  const chartData = getPerformanceAverageByDate();
  const averageScore = calculateAverageScore();
  const scoreDistribution = getScoreDistribution();
  const completedQuizzes = performanceData?.length || 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Performance Analysis</h1>
              
              {/* Filters */}
              <div className="mb-6 flex flex-wrap gap-3 items-end">
                <div>
                  <Label htmlFor="subject-filter">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger id="subject-filter" className="w-[180px]">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {/* Filter subjects to only show those in user's preferredSubjects */}
                      {subjects && subjects.length > 0 ? (
                        subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No subjects available in your profile
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button variant="outline" onClick={resetFilters} className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{averageScore}%</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Completed Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{completedQuizzes}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Excellent Scores</CardTitle>
                    <CardDescription>90% or higher</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{scoreDistribution.excellent}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Needs Improvement</CardTitle>
                    <CardDescription>Below 60%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{scoreDistribution.needsImprovement}</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Performance Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                  <CardDescription>Average scores by date</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <div className="h-80">
                      <PerformanceChart data={chartData} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-80 text-gray-500 dark:text-gray-400">
                      {isLoading ? "Loading data..." : "No performance data available"}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Breakdown of your quiz performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-medium text-green-600 dark:text-green-400">Excellent</div>
                      <div className="text-2xl font-bold">{scoreDistribution.excellent}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">90-100%</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-medium text-blue-600 dark:text-blue-400">Good</div>
                      <div className="text-2xl font-bold">{scoreDistribution.good}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">75-89%</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-lg font-medium text-yellow-600 dark:text-yellow-400">Average</div>
                      <div className="text-2xl font-bold">{scoreDistribution.average}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">60-74%</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-lg font-medium text-red-600 dark:text-red-400">Needs Improvement</div>
                      <div className="text-2xl font-bold">{scoreDistribution.needsImprovement}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Below 60%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Performance;