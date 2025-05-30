import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, X } from "lucide-react";

interface PostQuizFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: number;
  score: number;
  totalQuestions: number;
  subject: string;
  board: string;
  className: string;
}

export default function PostQuizFeedback({
  isOpen,
  onClose,
  quizId,
  score,
  totalQuestions,
  subject,
  board,
  className
}: PostQuizFeedbackProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const submitFeedback = useMutation({
    mutationFn: async (data: any) => {
      const result = await apiRequest("POST", "/api/quiz-feedback", data);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve the quiz experience.",
      });
      onClose();
      setRating(0);
      setFeedback("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. You can try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (rating === 0 && !feedback.trim()) {
      toast({
        title: "No feedback provided",
        description: "Please provide a rating or feedback comment.",
        variant: "destructive",
      });
      return;
    }

    submitFeedback.mutate({
      quizId,
      rating: rating > 0 ? rating : null,
      feedbackText: feedback.trim() || null,
      type: "quiz",
      board,
      class: className,
      subject,
      score,
      totalQuestions
    });
  };

  const handleSkip = () => {
    onClose();
    setRating(0);
    setFeedback("");
  };

  const scorePercentage = Math.round((score / totalQuestions) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Quiz Completed!
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Score Display */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {score}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600">
              {scorePercentage}% Score
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {subject} • {board} Class {className}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How was this quiz? (Optional)
            </label>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating 
                      ? "text-yellow-400 hover:text-yellow-500" 
                      : "text-gray-300 hover:text-gray-400"
                  }`}
                >
                  <Star className={`h-7 w-7 ${star <= rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any feedback about the questions? (Optional)
            </label>
            <Textarea
              placeholder="Share your thoughts about the quiz questions, difficulty, or any issues..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitFeedback.isPending}
              className="flex-1"
            >
              {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}