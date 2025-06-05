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
import type { Subject } from "@shared/schema";
type ChartDataItem = { date: string; score: number; quizSet: number };

const Performance = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Get subjects that user has taken tests for
  const { data: subjects = [] } = useQuery<Subject[]>({
  queryKey: ['/api/quizzes/performance/subjects'],
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
    const groupedData = performanceData.reduce((acc: any, current: any) => {
      if (!acc[current.date]) {
        acc[current.date] = { total: current.score, count: 1 };
      } else {
        acc[current.date].total += current.score;
        acc[current.date].count += 1;
      }
      return acc;
    }, {});
    
    // Convert to array format for chart
   return Object.entries(groupedData).map(([date, data]: [string, any]) => ({
  date,
  score: Math.round(data.total / data.count),
  quizSet: 1 // or use a real value if needed
}));


  const calculateAverageScore = () => {
    if (!performanceData || performanceData.length === 0) return 0;
    
    const total = performanceData.reduce((sum: number, item: any) => sum + item.score, 0);
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
    
    performanceData.forEach((item: any) => {
      if (item.score >= 90) counts.excellent++;
      else if (item.score >= 75) counts.good++;
      else if (item.score >= 60) counts.average++;
      else counts.needsImprovement++;
    });
    
    return counts;
  };

 const chartData: ChartDataItem[] = getPerformanceAverageByDate();

  const averageScore = calculateAverageScore();
  const scoreDistribution = getScoreDistribution();
  const completedQuizzes = performanceData?.length || 0;

  return (
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
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
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
                 {startDate ? format(startDate as Date, "PPP") : "Pick a date"}
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
                  {endDate ? format(endDate as Date, "PPP") : "Pick a date"}
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

          <Button onClick={resetFilters} variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
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
                {chartData.length > 0 ? (
                  <PerformanceChart data={chartData} />
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p>No performance data available for the selected period.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
export default Performance;