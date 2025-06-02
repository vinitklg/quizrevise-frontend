import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">About QuizRevise</h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
            Our mission is to transform education through scientifically-backed learning methods.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white dark:bg-gray-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Story</h3>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                QuizRevise was founded by a group of educators and technologists who wanted to solve a fundamental problem in education: students forget what they learn. After extensive research into memory and cognitive science, we developed our spaced repetition platform specifically designed for Indian students following CBSE, ICSE, and ISC curricula.
              </p>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Our team combines expertise in pedagogy, cognitive psychology, and artificial intelligence to create a learning experience that helps students truly master their subjects and retain knowledge for the long term.
              </p>
            </div>
            
            <div>
              <img
                className="h-auto w-full rounded-lg shadow"
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
                alt="Modern classroom with students learning together"
              />
            </div>
          </div>
        </div>
      </div>

      {/* The Science */}
      <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="order-last md:order-first">
              <img
                className="h-auto w-full rounded-lg shadow"
                src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
                alt="Education concept with notebook and coffee"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">The Science Behind Our Platform</h3>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Our spaced repetition system is based on the scientifically-proven Ebbinghaus forgetting curve. By reviewing material at specific intervals (1, 5, 15, 30, 60, 120, and 180 days), we strengthen neural connections just before memories begin to fade.
              </p>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                The AI-generated questions adapt to each student's learning level and progress, creating a personalized learning experience that addresses individual strengths and weaknesses. This adaptive approach ensures that students are always challenged at the appropriate level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values and Mission */}
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Our Values</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Education for everyone</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
              We believe in making quality education accessible, personalized, and effective.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">Accessibility</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      We strive to make quality education accessible to all students regardless of their background or financial status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">Innovation</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      We continuously innovate to create the most effective learning tools by combining the latest research with cutting-edge technology.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">Personalization</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      We believe every student learns differently, which is why our platform adapts to individual learning styles and needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your learning?</span>
            <span className="block">Join QuizRevise today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Experience the power of AI and spaced repetition to boost your grades and knowledge retention.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup">
                <Button variant="secondary" size="lg">
                  Sign up now
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="bg-primary-600 text-white border-primary-500 hover:bg-primary-700">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
