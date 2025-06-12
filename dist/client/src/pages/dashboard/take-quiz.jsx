var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import PostQuizFeedback from "@/components/PostQuizFeedback";
export default function TakeQuiz() {
    var _this = this;
    var params = useParams();
    var _a = useLocation(), setLocation = _a[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var scheduleId = parseInt(params.scheduleId || "0");
    var _b = useState(0), currentQuestionIndex = _b[0], setCurrentQuestionIndex = _b[1];
    var _c = useState({}), answers = _c[0], setAnswers = _c[1];
    var _d = useState(1800), timeLeft = _d[0], setTimeLeft = _d[1]; // 30 minutes
    var _e = useState(false), isCompleted = _e[0], setIsCompleted = _e[1];
    var _f = useState(false), showResults = _f[0], setShowResults = _f[1];
    var _g = useState(null), quizResults = _g[0], setQuizResults = _g[1];
    var _h = useState(false), showFeedbackPopup = _h[0], setShowFeedbackPopup = _h[1];
    // Fetch quiz schedule and questions
    var _j = useQuery({
        queryKey: ["/api/quiz-schedule/".concat(scheduleId)],
        enabled: !!scheduleId,
    }), schedule = _j.data, isLoading = _j.isLoading;
    // Submit quiz mutation
    var submitQuizMutation = useMutation({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var score = _b.score;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/quizzes/".concat(scheduleId, "/complete"), { score: score })];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/quizzes/today"] });
            setIsCompleted(true);
            setShowResults(true);
        },
        onError: function () {
            toast({
                title: "Error",
                description: "Failed to submit quiz. Please try again.",
                variant: "destructive",
            });
        },
    });
    // Timer effect
    useEffect(function () {
        if (timeLeft > 0 && !isCompleted) {
            var timer_1 = setTimeout(function () { return setTimeLeft(timeLeft - 1); }, 1000);
            return function () { return clearTimeout(timer_1); };
        }
        else if (timeLeft === 0) {
            handleSubmitQuiz();
        }
    }, [timeLeft, isCompleted]);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins, ":").concat(secs.toString().padStart(2, '0'));
    };
    var handleAnswerChange = function (questionId, answer) {
        setAnswers(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[questionId] = answer, _a)));
        });
    };
    var calculateScore = function () {
        if (!(schedule === null || schedule === void 0 ? void 0 : schedule.quizSet.questions))
            return 0;
        var correct = 0;
        schedule.quizSet.questions.forEach(function (question) {
            if (answers[question.id] === question.correctAnswer) {
                correct++;
            }
        });
        return Math.round((correct / schedule.quizSet.questions.length) * 100);
    };
    var handleSubmitQuiz = function () {
        var score = calculateScore();
        // Calculate detailed results
        var results = (schedule === null || schedule === void 0 ? void 0 : schedule.quizSet.questions.map(function (question) {
            var userAnswer = answers[question.id];
            var isCorrect = userAnswer === question.correctAnswer;
            return {
                question: question.question,
                userAnswer: userAnswer || "Not answered",
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect,
                explanation: question.explanation || "No explanation available",
                options: question.options || []
            };
        })) || [];
        setQuizResults({
            score: score,
            totalQuestions: (schedule === null || schedule === void 0 ? void 0 : schedule.quizSet.questions.length) || 0,
            correctAnswers: results.filter(function (r) { return r.isCorrect; }).length,
            results: results
        });
        submitQuizMutation.mutate({ score: score });
    };
    var handleNextQuestion = function () {
        if (schedule && currentQuestionIndex < schedule.quizSet.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    var handlePreviousQuestion = function () {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    if (isLoading) {
        return (<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
        </div>
      </div>);
    }
    if (!schedule) {
        return (<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Not Found</h2>
            <Button onClick={function () { return setLocation("/dashboard/today"); }}>
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Today's Quizzes
            </Button>
          </div>
        </div>
      </div>);
    }
    if (isCompleted && showResults && quizResults) {
        return (<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Results Header */}
            <Card className="mb-6">
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quizResults.score}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Final Score</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{quizResults.correctAnswers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{quizResults.totalQuestions - quizResults.correctAnswers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
                  </div>
                </div>
                <Button onClick={function () {
                console.log("Back button clicked, showing feedback popup");
                setShowFeedbackPopup(true);
            }} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Today's Quizzes
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detailed Results</h3>
              {quizResults.results.map(function (result, index) { return (<Card key={index} className={"border-l-4 ".concat(result.isCorrect ? 'border-l-green-500' : 'border-l-red-500')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        Question {index + 1}
                        {result.isCorrect ? (<CheckCircle className="h-5 w-5 text-green-500 ml-2"/>) : (<div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center ml-2">
                            <span className="text-white text-xs">✕</span>
                          </div>)}
                      </CardTitle>
                      <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(result.isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400')}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="font-medium text-gray-900 dark:text-white">{result.question}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Answer:</p>
                        <p className={"p-2 rounded ".concat(result.isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400')}>
                          {result.userAnswer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Answer:</p>
                        <p className="p-2 rounded bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {result.correctAnswer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{result.explanation}</p>
                    </div>
                  </CardContent>
                </Card>); })}
            </div>
          </div>
        </div>
      </div>);
    }
    var currentQuestion = schedule.quizSet.questions[currentQuestionIndex];
    var progress = ((currentQuestionIndex + 1) / schedule.quizSet.questions.length) * 100;
    return (<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {schedule.quiz.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Quiz Set #{schedule.quizSet.setNumber}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-orange-600 dark:text-orange-400">
                    <Clock className="h-4 w-4 mr-2"/>
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {schedule.quizSet.questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2"/>
              </div>

              {/* Question Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Display diagram if available */}
                                       
                      
                  {/* MCQ Questions - Show for any question that has options */}
                  {currentQuestion.questionType !== "true-false" && currentQuestion.options && (<RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={function (value) { return handleAnswerChange(currentQuestion.id, value); }}>
                      {(function () {
                if (typeof currentQuestion.options === 'object' && !Array.isArray(currentQuestion.options)) {
                    // Handle MCQ questions with object format - only show A, B, C, D options
                    var validOptions_1 = ['A', 'B', 'C', 'D'];
                    return Object.entries(currentQuestion.options)
                        .filter(function (_a) {
                        var key = _a[0];
                        return validOptions_1.includes(key);
                    })
                        .map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return (<div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem value={key} id={"option-".concat(key)}/>
                                <Label htmlFor={"option-".concat(key)} className="cursor-pointer">
                                  {key}. {value}
                                </Label>
                              </div>);
                    });
                }
                else {
                    // Handle regular MCQ questions with array format
                    var options = Array.isArray(currentQuestion.options)
                        ? currentQuestion.options
                        : [];
                    return options.map(function (option, index) {
                        var optionText = typeof option === 'string' ? option : "".concat(String.fromCharCode(65 + index), ". ").concat(option);
                        var optionLetter = optionText.charAt(0);
                        return (<div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={optionLetter} id={"option-".concat(index)}/>
                                <Label htmlFor={"option-".concat(index)} className="cursor-pointer">
                                  {optionText}
                                </Label>
                              </div>);
                    });
                }
            })()}
                    </RadioGroup>)}

                  {/* Fill in the Blanks */}
                  {currentQuestion.questionType === "fill-in-blanks" && (<div className="space-y-3">
                      <Input placeholder="Type your answer here..." value={answers[currentQuestion.id] || ""} onChange={function (e) { return handleAnswerChange(currentQuestion.id, e.target.value); }} className="text-lg p-4"/>
                    </div>)}

                  {/* Assertion and Reasoning */}
                  {currentQuestion.questionType === "assertion-reasoning" && (<RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={function (value) { return handleAnswerChange(currentQuestion.id, value); }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A" id="assertion-a"/>
                        <Label htmlFor="assertion-a" className="cursor-pointer">
                          A. Both Assertion and Reason are correct and Reason is the correct explanation for Assertion.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="B" id="assertion-b"/>
                        <Label htmlFor="assertion-b" className="cursor-pointer">
                          B. Both Assertion and Reason are correct but Reason is not the correct explanation for Assertion.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="C" id="assertion-c"/>
                        <Label htmlFor="assertion-c" className="cursor-pointer">
                          C. Assertion is correct but Reason is incorrect.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="D" id="assertion-d"/>
                        <Label htmlFor="assertion-d" className="cursor-pointer">
                          D. Assertion is incorrect but Reason is correct.
                        </Label>
                      </div>
                    </RadioGroup>)}

                  {/* True/False Questions */}
                  {currentQuestion.questionType === "true-false" && (<RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={function (value) { return handleAnswerChange(currentQuestion.id, value); }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="true"/>
                        <Label htmlFor="true" className="cursor-pointer">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="false"/>
                        <Label htmlFor="false" className="cursor-pointer">False</Label>
                      </div>
                    </RadioGroup>)}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>
                
                {currentQuestionIndex === schedule.quizSet.questions.length - 1 ? (<Button onClick={handleSubmitQuiz} disabled={submitQuizMutation.isPending}>
                    {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
                  </Button>) : (<Button onClick={handleNextQuestion}>
                    Next
                  </Button>)}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Post-Quiz Feedback Popup */}
      {showFeedbackPopup && schedule && (<PostQuizFeedback quizId={schedule.quizId} onClose={function () { return setShowFeedbackPopup(false); }} onSubmit={function () {
                setShowFeedbackPopup(false);
                setLocation("/dashboard/today");
            }}/>)}
    </div>);
}
