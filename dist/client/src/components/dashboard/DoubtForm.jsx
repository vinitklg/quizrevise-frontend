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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
var doubtSchema = z.object({
    question: z.string().min(10, "Question must be at least 10 characters"),
    subjectId: z.string().optional(),
});
var DoubtForm = function (_a) {
    var subjects = _a.subjects;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var user = useAuth().user;
    var form = useForm({
        resolver: zodResolver(doubtSchema),
        defaultValues: {
            question: "",
        },
    });
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var formattedData, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    formattedData = __assign(__assign({}, data), { subjectId: data.subjectId ? parseInt(data.subjectId) : undefined });
                    return [4 /*yield*/, apiRequest("POST", "/api/doubt-queries", formattedData)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Doubt submitted",
                        description: "Your question has been submitted and answered by our AI.",
                    });
                    // Reset form
                    form.reset();
                    // Invalidate doubts query to refetch the list
                    queryClient.invalidateQueries({ queryKey: ["/api/doubt-queries"] });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = "Failed to submit your doubt. Please try again.";
                    // Check if it's a subscription limit error
                    if (error_1 instanceof Error && error_1.message.includes("limit reached")) {
                        errorMessage = "You've reached your daily doubt query limit for the ".concat(user === null || user === void 0 ? void 0 : user.subscriptionTier, " plan. Please upgrade to continue.");
                    }
                    toast({
                        title: "Error",
                        description: errorMessage,
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
    return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="subjectId" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Subject (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map(function (subject) { return (<SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>); })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>);
        }}/>

        <FormField control={form.control} name="question" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Your question</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your question here..." className="min-h-32" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Question"}
        </Button>
      </form>
    </Form>);
};
export default DoubtForm;
