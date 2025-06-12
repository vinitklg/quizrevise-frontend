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
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
var RATING_EMOJIS = [
    { value: 1, emoji: "😠", label: "Very Poor" },
    { value: 2, emoji: "😕", label: "Poor" },
    { value: 3, emoji: "😐", label: "Average" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😄", label: "Excellent" },
];
export default function PostQuizFeedback(_a) {
    var _this = this;
    var quizId = _a.quizId, onClose = _a.onClose, onSubmit = _a.onSubmit;
    var _b = useState(null), rating = _b[0], setRating = _b[1];
    var _c = useState(""), comments = _c[0], setComments = _c[1];
    var _d = useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = useState(false), mounted = _e[0], setMounted = _e[1];
    var toast = useToast().toast;
    useEffect(function () {
        setMounted(true);
        return function () { return setMounted(false); };
    }, []);
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!rating) {
                        toast({
                            title: "Rating Required",
                            description: "Please select a rating before submitting.",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, apiRequest("POST", "/api/quiz-feedback", {
                            quizId: quizId,
                            rating: rating,
                            comments: comments.trim() || null,
                        })];
                case 2:
                    _a.sent();
                    toast({
                        title: "Feedback Submitted",
                        description: "Thank you for your feedback!",
                    });
                    onSubmit();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to submit feedback:", error_1);
                    toast({
                        title: "Submission Failed",
                        description: "Please try again later.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var modalContent = (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">How did you find this quiz?</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rate your experience:
            </p>
            <div className="flex justify-between gap-2">
              {RATING_EMOJIS.map(function (item) { return (<button key={item.value} onClick={function () { return setRating(item.value); }} className={"flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ".concat(rating === item.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-gray-200 dark:border-gray-700")}>
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-xs text-center font-medium">
                    {item.label}
                  </span>
                </button>); })}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tell us what you liked or what can be improved (optional):
            </label>
            <Textarea id="comments" placeholder="Your feedback helps us improve..." value={comments} onChange={function (e) { return setComments(e.target.value); }} rows={3} className="resize-none"/>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={!rating || isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
    if (!mounted)
        return null;
    return createPortal(modalContent, document.body);
}
