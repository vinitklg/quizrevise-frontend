import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PostQuizFeedbackProps {
  quizId: number;
  onClose: () => void;
  onSubmit: () => void;
}

const RATING_EMOJIS = [
  { value: 1, emoji: "😠", label: "Very Poor" },
  { value: 2, emoji: "😕", label: "Poor" },
  { value: 3, emoji: "😐", label: "Average" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Excellent" },
];

export default function PostQuizFeedback({ quizId, onClose, onSubmit }: PostQuizFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/quiz-feedback", {
        quizId,
        rating,
        comments: comments.trim() || null,
      });

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      onSubmit();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">How did you find this quiz?</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
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
              {RATING_EMOJIS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setRating(item.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    rating === item.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-xs text-center font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tell us what you liked or what can be improved (optional):
            </label>
            <Textarea
              id="comments"
              placeholder="Your feedback helps us improve..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}