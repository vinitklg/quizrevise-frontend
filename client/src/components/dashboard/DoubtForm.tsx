import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const doubtSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  subjectId: z.string().optional(),
});

type DoubtFormValues = z.infer<typeof doubtSchema>;

interface Subject {
  id: number;
  name: string;
}

interface DoubtFormProps {
  subjects: Subject[];
}

const DoubtForm = ({ subjects }: DoubtFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<DoubtFormValues>({
    resolver: zodResolver(doubtSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = async (data: DoubtFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert subjectId from string to number if present
      const formattedData = {
        ...data,
        subjectId: data.subjectId ? parseInt(data.subjectId) : undefined,
      };

      await apiRequest("POST", "/api/doubt-queries", formattedData);
      
      toast({
        title: "Doubt submitted",
        description: "Your question has been submitted and answered by our AI.",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate doubts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["/api/doubt-queries"] });
    } catch (error) {
      let errorMessage = "Failed to submit your doubt. Please try again.";
      
      // Check if it's a subscription limit error
      if (error instanceof Error && error.message.includes("limit reached")) {
        errorMessage = `You've reached your daily doubt query limit for the ${user?.subscriptionTier} plan. Please upgrade to continue.`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your question here..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Question"}
        </Button>
      </form>
    </Form>
  );
};

export default DoubtForm;
