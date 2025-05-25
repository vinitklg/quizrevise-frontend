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
  board: z.string({
    required_error: "Please select a board",
  }),
  class: z.string({
    required_error: "Please select a class",
  }),
  subject: z.string({
    required_error: "Please select a subject",
  }),
  chapter: z.string({
    required_error: "Please enter a chapter",
  }).min(2, "Chapter must be at least 2 characters"),
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
  
  // Get user's subscribed subjects
  const subscribedSubjects = user?.subscribedSubjects || [];
  
  // Define board options
  const boardOptions = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "ISC", label: "ISC" }
  ];
  
  // Define class options (grades 6-12)
  const classOptions = [
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" },
  ];

  // Use profile data for default values
  const form = useForm<CreateQuizFormValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      board: user?.board || "CBSE",
      class: user?.grade?.toString() || "",
      subject: user?.preferredSubject?.split(",")[0]?.trim() || "",
      chapter: "",
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
      // Include all form data
      const formattedData = {
        board: data.board,
        class: data.class,
        subject: data.subject,
        chapter: data.chapter,
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

  // No longer need the handleSubjectChange function since we're using text inputs

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
                          
                          <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., Force and Acceleration" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Specify the particular topic within the chapter you want to focus on
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="board"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Board</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a board" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {boardOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Using board from your profile
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="class"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Class</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a class" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {classOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Using class from your profile
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {user?.subscriptionTier === "free" ? (
                                        // Free users can select any subject
                                        <>
                                          <SelectItem value="Physics">Physics</SelectItem>
                                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                                          <SelectItem value="Biology">Biology</SelectItem>
                                          <SelectItem value="English">English</SelectItem>
                                          <SelectItem value="History">History</SelectItem>
                                          <SelectItem value="Geography">Geography</SelectItem>
                                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        </>
                                      ) : (
                                        // Paid users can only select subjects they've subscribed to
                                        user?.subscribedSubjects && user.subscribedSubjects.length > 0 ? (
                                          user.subscribedSubjects.map((subject, index) => (
                                            <SelectItem key={index} value={subject}>
                                              {subject}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="none" disabled>
                                            No subscribed subjects. Please update your subscription.
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    {user?.subscriptionTier !== "free" 
                                      ? "Select from your subscribed subjects" 
                                      : "Select a subject"}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="chapter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Chapter</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g., Mechanics, Organic Chemistry" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter the chapter name
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">Question Types</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'mcq', label: 'Multiple Choice' },
                                { id: 'assertion-reasoning', label: 'Assertion & Reasoning' },
                                { id: 'fill-in-blanks', label: 'Fill in the Blanks' },
                                { id: 'true-false', label: 'True/False' }
                              ].map((type) => (
                                <div key={type.id} className="flex items-center space-x-2">
                                  <Checkbox id={type.id} 
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues('questionTypes') || [];
                                      if (checked) {
                                        form.setValue('questionTypes', [...current, type.id]);
                                      } else {
                                        form.setValue('questionTypes', current.filter(t => t !== type.id));
                                      }
                                    }}
                                  />
                                  <label htmlFor={type.id} className="text-sm font-normal">{type.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">Bloom's Taxonomy Levels</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'knowledge', label: 'Knowledge' },
                                { id: 'comprehension', label: 'Comprehension' },
                                { id: 'application', label: 'Application' },
                                { id: 'analysis', label: 'Analysis' },
                                { id: 'synthesis', label: 'Synthesis' },
                                { id: 'evaluation', label: 'Evaluation' }
                              ].map((level) => (
                                <div key={level.id} className="flex items-center space-x-2">
                                  <Checkbox id={level.id}
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues('bloomTaxonomy') || [];
                                      if (checked) {
                                        form.setValue('bloomTaxonomy', [...current, level.id]);
                                      } else {
                                        form.setValue('bloomTaxonomy', current.filter(t => t !== level.id));
                                      }
                                    }}
                                  />
                                  <label htmlFor={level.id} className="text-sm font-normal">{level.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">Difficulty Levels</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'basic', label: 'Basic' },
                                { id: 'standard', label: 'Standard' },
                                { id: 'challenging', label: 'Challenging' },
                                { id: 'most-challenging', label: 'Most Challenging' }
                              ].map((level) => (
                                <div key={level.id} className="flex items-center space-x-2">
                                  <Checkbox id={level.id}
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues('difficultyLevels') || [];
                                      if (checked) {
                                        form.setValue('difficultyLevels', [...current, level.id]);
                                      } else {
                                        form.setValue('difficultyLevels', current.filter(t => t !== level.id));
                                      }
                                    }}
                                  />
                                  <label htmlFor={level.id} className="text-sm font-normal">{level.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="numberOfQuestions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Questions</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min={5}
                                    max={50}
                                    placeholder="10" 
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Choose between 5 and 50 questions per quiz set
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
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
