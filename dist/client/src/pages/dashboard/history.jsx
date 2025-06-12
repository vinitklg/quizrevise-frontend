import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/Sidebar";
import QuizCard from "@/components/dashboard/QuizCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Filter } from "lucide-react";
var History = function () {
    var _a = useState(""), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = useState("all"), statusFilter = _b[0], setStatusFilter = _b[1];
    var _c = useState("all"), subjectFilter = _c[0], setSubjectFilter = _c[1];
    var _d = useQuery({
        queryKey: ["/api/quizzes"],
    }), quizzes = _d.data, isLoading = _d.isLoading;
    var subjects = useQuery({
        queryKey: ["/api/subjects"],
    }).data;
    // Filter quizzes based on search term and filters
    var filteredQuizzes = quizzes === null || quizzes === void 0 ? void 0 : quizzes.filter(function (quiz) {
        var matchesSearch = searchTerm === "" ||
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.chapter.name.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesStatus = statusFilter === "all" || quiz.status === statusFilter;
        var matchesSubject = subjectFilter === "all" || quiz.subjectId.toString() === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
    });
    // Generate performance data
    var performanceData = (quizzes === null || quizzes === void 0 ? void 0 : quizzes.flatMap(function (quiz) {
        return quiz.schedules
            .filter(function (schedule) { return schedule.completedDate && schedule.score !== null; })
            .map(function (schedule) {
            var _a;
            return ({
                date: schedule.completedDate,
                score: schedule.score,
                quizSet: ((_a = quiz.quizSets.find(function (set) { return set.id === schedule.quizSetId; })) === null || _a === void 0 ? void 0 : _a.setNumber) || 0
            });
        });
    })) || [];
    return (<div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">History & Progress</h1>
              
              <Tabs defaultValue="quizzes" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quizzes" className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                      <Input placeholder="Search quizzes..." className="pl-10" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2"/>
                            <span>Status</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="w-[160px]">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2"/>
                            <span>Subject</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {subjects === null || subjects === void 0 ? void 0 : subjects.map(function (subject) { return (<SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>); })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {isLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map(function (i) { return (<div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>); })}
                    </div>) : filteredQuizzes && filteredQuizzes.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredQuizzes.map(function (quiz) {
                var completedSets = quiz.schedules.filter(function (s) { return s.status === "completed"; }).length;
                var totalSets = quiz.schedules.length;
                var nextSchedule = quiz.schedules.find(function (s) { return s.status === "pending"; });
                return (<QuizCard key={quiz.id} id={quiz.id} title={quiz.title} subjectName={quiz.subject.name} chapterName={quiz.chapter.name} createdAt={quiz.createdAt} completedSets={completedSets} totalSets={totalSets} nextQuizDate={nextSchedule === null || nextSchedule === void 0 ? void 0 : nextSchedule.scheduledDate} status={quiz.status}/>);
            })}
                    </div>) : (<div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"/>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No quizzes found</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                        {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
                ? "No quizzes match your search criteria. Try adjusting your filters."
                : "You haven't created any quizzes yet. Start your learning journey by creating your first quiz."}
                      </p>
                      {!(searchTerm || statusFilter !== "all" || subjectFilter !== "all") && (<Button onClick={function () { return window.location.href = "/dashboard/create-quiz"; }}>
                          Create your first quiz
                        </Button>)}
                    </div>)}
                </TabsContent>
                
                <TabsContent value="performance">
                  {performanceData.length > 0 ? (<PerformanceChart data={performanceData} title="Quiz Performance History"/>) : (<div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"/>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No performance data yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                        Complete quizzes to see your performance data and track your progress over time.
                      </p>
                      <Button onClick={function () { return window.location.href = "/dashboard/today"; }}>
                        Take today's quizzes
                      </Button>
                    </div>)}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>);
};
export default History;
