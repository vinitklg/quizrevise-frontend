import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Sparkles } from "lucide-react";

interface Subject {
  id: number;
  name: string;
  gradeLevel: number;
  board: string;
}

interface Chapter {
  id: number;
  name: string;
  description?: string;
}

const createQuizSchema = z.object({
  subjectId: z.string({
    required_error: "Please select a subject",
  }),
  chapterId: z.string({
    required_error: "Please select a chapter",
  }),
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  topic: z.string().optional(),
  questionTypes: z.array(z.string()).optional(),
  bloomTaxonomy: z.array(z.string()).optional(),
  difficultyLevels: z.array(z.string()).optional(),
  numberOfQuestions: z.number().optional(),
});

type CreateQuizFormValues = z.infer<typeof createQuizSchema>;

const CreateQuiz = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Query for subjects based on user's grade and board
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects", { board: user?.board, grade: user?.grade }],
  });

  // Query for chapters based on selected subject
  const { data: chapters, isLoading: isLoadingChapters } = useQuery<Chapter[]>({
    queryKey: ["/api/subjects", selectedSubjectId, "chapters"],
    enabled: !!selectedSubjectId,
  });

  const form = useForm<CreateQuizFormValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      topic: "",
      questionTypes: [],
      bloomTaxonomy: [],
      difficultyLevels: [],
      numberOfQuestions: 10,
    },
  });

  const onSubmit = async (data: CreateQuizFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert string IDs to numbers
      const formattedData = {
        subjectId: parseInt(data.subjectId),
        chapterId: parseInt(data.chapterId),
        title: data.title,
        topic: data.topic || data.title,
        questionTypes: data.questionTypes && data.questionTypes.length ? data.questionTypes : ["mcq"],
        bloomTaxonomy: data.bloomTaxonomy && data.bloomTaxonomy.length ? data.bloomTaxonomy : ["knowledge", "comprehension"],
        difficultyLevels: data.difficultyLevels && data.difficultyLevels.length ? data.difficultyLevels : ["standard"],
        numberOfQuestions: data.numberOfQuestions || 10,
      };

      const response = await apiRequest("POST", "/api/quizzes", formattedData);
      const responseData = await response.json();
      
      toast({
        title: "Quiz created successfully!",
        description: "Your quiz has been created and scheduled for spaced repetition.",
      });
      
      // Navigate to take the quiz
      navigate(`/dashboard/take-quiz/${responseData.id}`);
    } catch (error) {
      let errorMessage = "Failed to create quiz. Please try again.";
      
      // Check if it's a subscription limit error
      if (error instanceof Error && error.message.includes("Quiz limit reached")) {
        errorMessage = `You've reached your quiz limit for the ${user?.subscriptionTier} plan. Please upgrade to create more quizzes.`;
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

  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value);
    form.setValue("subjectId", value);
    form.setValue("chapterId", ""); // Reset chapter when subject changes
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create Quiz</h1>
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz Details</CardTitle>
                      <CardDescription>Create a new quiz for spaced repetition learning</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quiz Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., Newton's Laws of Motion" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="subjectId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <Select 
                                    onValueChange={(value) => handleSubjectChange(value)}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {isLoadingSubjects ? (
                                        <SelectItem value="loading" disabled>Loading subjects...</SelectItem>
                                      ) : subjects && subjects.length > 0 ? (
                                        subjects.map((subject) => (
                                          <SelectItem key={subject.id} value={subject.id.toString()}>
                                            {subject.name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="none" disabled>No subjects available</SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="chapterId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Chapter</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!selectedSubjectId}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a chapter" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {isLoadingChapters ? (
                                        <SelectItem value="loading" disabled>Loading chapters...</SelectItem>
                                      ) : chapters && chapters.length > 0 ? (
                                        chapters.map((chapter) => (
                                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                                            {chapter.name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="none" disabled>
                                          {selectedSubjectId ? "No chapters available" : "Select a subject first"}
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>How it works</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Brain className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">AI-Generated Questions</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Our AI will create 8 sets of questions tailored to your selected chapter.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Spaced Repetition</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              You'll be prompted to review the material at scientifically proven intervals (days 0, 1, 5, 15, 30, 60, 120, 180).
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Optimized for Retention</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              This method has been proven to increase knowledge retention by up to 80% compared to traditional studying.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateQuiz;
