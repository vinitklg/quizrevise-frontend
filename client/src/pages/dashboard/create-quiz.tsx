import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, BookOpen, Sparkles } from "lucide-react";
import { Subject } from "@shared/schema";

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
  chapter: z
    .string({
      required_error: "Please enter a chapter",
    })
    .min(2, "Chapter must be at least 2 characters"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  topic: z.string().optional(),
  questionTypes: z.array(z.string()).optional(),
  bloomTaxonomy: z.array(z.string()).optional(),
  difficultyLevels: z.array(z.string()).optional(),
  numberOfQuestions: z.number().optional(),
  diagramSupport: z.boolean().optional(),
});

type CreateQuizFormValues = z.infer<typeof createQuizSchema>;

const CreateQuiz = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreationNotification, setShowCreationNotification] = useState(false);

  // Get user's subscribed subjects
  const userSubjects = user?.subscribedSubjects || [];

  // Fetch all subjects to match with user's subscribed subject codes
  const { data: allSubjects = [], isLoading: isLoadingSubjects } =
    useQuery<Subject[]>({
      queryKey: ["/api/subjects"],
      enabled: !!user,
    });

  // Filter subjects based on user's subscribed subject codes
  const subscribedSubjects = allSubjects.filter(subject => 
    userSubjects.includes(subject.code)
  );

  // Define board options
  const boardOptions = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "ISC", label: "ISC" },
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
      subject: subscribedSubjects[0]?.name || "",
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
        questionTypes:
          data.questionTypes && data.questionTypes.length
            ? data.questionTypes
            : ["mcq"],
        bloomTaxonomy:
          data.bloomTaxonomy && data.bloomTaxonomy.length
            ? data.bloomTaxonomy
            : ["knowledge", "comprehension"],
        difficultyLevels:
          data.difficultyLevels && data.difficultyLevels.length
            ? data.difficultyLevels
            : ["standard"],
        numberOfQuestions: data.numberOfQuestions || 10,
        diagramSupport: data.diagramSupport || false,
      };

      // Show prominent creation notification
      setShowCreationNotification(true);
      
      // Start the quiz creation process (don't wait for completion)
      apiRequest("POST", "/api/quizzes", formattedData).catch(error => {
        console.error("Quiz creation failed:", error);
        setShowCreationNotification(false);
      });

      // Reset form
      form.reset();

      // Navigate to today's quizzes after showing notification for 30 seconds
      setTimeout(() => {
        navigate(`/dashboard/today`);
      }, 30000);

      // Hide notification after 30 seconds (same time as navigation)
      setTimeout(() => {
        setShowCreationNotification(false);
      }, 30000);
      
    } catch (error) {
      let errorMessage = "Failed to start quiz creation. Please try again.";

      // Check if it's a subscription limit error
      if (
        error instanceof Error &&
        error.message.includes("Quiz limit reached")
      ) {
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create Quiz
        </h1>

        {/* Prominent Quiz Creation Notification */}
        {showCreationNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 mx-4 max-w-md w-full text-center">
              <div className="mb-6">
                <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Creating Your Quiz
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  AI is generating 8 sets of personalized questions for your spaced repetition learning journey.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  If similar questions exist, this will be instant. Otherwise, new questions will be generated in 1-2 minutes. Please refresh the page after completion.
                </p>
              </div>
              <button
                onClick={() => setShowCreationNotification(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Dismiss (continues in background)
              </button>
            </div>
          </div>
        )}

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz Details</CardTitle>
                      <CardDescription>
                        Create a new quiz for spaced repetition learning
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
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
                                  Specify the particular topic within the
                                  chapter you want to focus on
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
                                  <Input {...field} disabled />
                                  <FormDescription>
                                    Using board from your profile settings
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
                                  <Input {...field} disabled />
                                  <FormDescription>
                                    Using class/grade from your profile settings
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
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {user?.subscriptionTier === "free" ? (
                                        subscribedSubjects.length === 0 ? (
                                          <SelectItem
                                            value="no-subjects"
                                            disabled
                                          >
                                            No preferred subjects found. Update
                                            your profile.
                                          </SelectItem>
                                        ) : (
                                          subscribedSubjects.map((subject) => (
                                            <SelectItem
                                              key={subject.code}
                                              value={subject.name}
                                            >
                                              {subject.name}
                                            </SelectItem>
                                          ))
                                        )
                                      ) : isLoadingSubjects ? (
                                        <SelectItem value="loading" disabled>
                                          Loading subjects...
                                        </SelectItem>
                                      ) : subscribedSubjects.length === 0 ? (
                                        <SelectItem
                                          value="no-subjects"
                                          disabled
                                        >
                                          No subscribed subjects found.
                                        </SelectItem>
                                      ) : (
                                        subscribedSubjects.map((subject) => (
                                          <SelectItem
                                            key={subject.id}
                                            value={subject.name}
                                          >
                                            {subject.name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Showing preferred subjects (free tier) or
                                    subscribed subjects (paid plans) available
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
                                { id: "mcq", label: "Multiple Choice" },
                                {
                                  id: "assertion-reasoning",
                                  label: "Assertion & Reasoning",
                                },
                                { id: "true-false", label: "True/False" },
                              ].map((type) => (
                                <div
                                  key={type.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={type.id}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        form.getValues("questionTypes") || [];
                                      if (checked) {
                                        form.setValue("questionTypes", [
                                          ...current,
                                          type.id,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "questionTypes",
                                          current.filter((t) => t !== type.id),
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={type.id}
                                    className="text-sm font-normal"
                                  >
                                    {type.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">
                              Bloom's Taxonomy Levels
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: "knowledge", label: "Knowledge" },
                                { id: "comprehension", label: "Comprehension" },
                                { id: "application", label: "Application" },
                                { id: "analysis", label: "Analysis" },
                                { id: "synthesis", label: "Synthesis" },
                                { id: "evaluation", label: "Evaluation" },
                              ].map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={level.id}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        form.getValues("bloomTaxonomy") || [];
                                      if (checked) {
                                        form.setValue("bloomTaxonomy", [
                                          ...current,
                                          level.id,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "bloomTaxonomy",
                                          current.filter((t) => t !== level.id),
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={level.id}
                                    className="text-sm font-normal"
                                  >
                                    {level.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Diagram Support Section */}
                          <FormField
                            control={form.control}
                            name="diagramSupport"
                            render={({ field }) => (
                              <FormItem className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                <div>
                                  <h3 className="font-medium mb-2">📊 Diagram Support</h3>
                                  <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                                    Force diagram generation for visual concepts (Geometry, Physics, Chemistry, Biology)
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="diagramSupport"
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <label htmlFor="diagramSupport" className="text-sm font-normal">
                                      Force Diagram Generation
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">Difficulty Levels</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: "basic", label: "Basic" },
                                { id: "standard", label: "Standard" },
                                { id: "challenging", label: "Challenging" },
                                {
                                  id: "most-challenging",
                                  label: "Most Challenging",
                                },
                              ].map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={level.id}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        form.getValues("difficultyLevels") ||
                                        [];
                                      if (checked) {
                                        form.setValue("difficultyLevels", [
                                          ...current,
                                          level.id,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "difficultyLevels",
                                          current.filter((t) => t !== level.id),
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={level.id}
                                    className="text-sm font-normal"
                                  >
                                    {level.label}
                                  </label>
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
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
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
                            <h3 className="font-medium">
                              AI-Generated Questions
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Our AI creates 8 sets of questions in the background. 
                              Your quiz will be ready in 5-10 minutes and appear in "Today's Quizzes".
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Spaced Repetition</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              You'll be prompted to review the material at
                              scientifically proven intervals (days 0, 1, 5, 15,
                              30, 60, 120, 180).
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">
                              Optimized for Retention
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              This method has been proven to increase knowledge
                              retention by up to 80% compared to traditional
                              studying.
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
  );
};

export default CreateQuiz;
