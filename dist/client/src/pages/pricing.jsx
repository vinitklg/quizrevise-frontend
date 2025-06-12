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
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
var Pricing = function () {
    var _a = useState(true), isAnnual = _a[0], setIsAnnual = _a[1];
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, user = _b.user;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var pricingPlans = [
        {
            name: "Free",
            price: 0,
            description: "Get started with the basics of spaced repetition learning.",
            features: [
                "1 quiz per subject per week",
                "2 daily doubt queries",
                "MCQs only",
                "Basic reports",
            ],
            notIncluded: ["No scheduling"],
            buttonText: "Sign up for free"
        },
        {
            name: "Standard",
            price: 999,
            description: "A perfect balance of features for most students.",
            features: [
                "1 quiz per subject per day",
                "Unlimited doubt queries",
                "All subjects",
                "Detailed reports",
                "Scheduling",
                "24/7 support",
                "Early feature access"
            ],
            highlight: true,
            buttonText: "Get started"
        },
        {
            name: "Premium",
            price: 1999,
            description: "Advanced features for serious students aiming for top ranks.",
            features: [
                "3 quizzes per subject per day",
                "15-minute daily doubt solving",
                "All question types",
                "Advanced Bloom's Taxonomy",
                "Comprehensive analytics",
                "API support",
                "Everything in Standard plan"
            ],
            buttonText: "Get Premium"
        }
    ];
    var handleSubscribe = function (tier) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isAuthenticated) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, apiRequest("POST", "/api/subscription", { tier: tier.toLowerCase() })];
                case 2:
                    _a.sent();
                    toast({
                        title: "Subscription updated!",
                        description: "You are now on the ".concat(tier, " plan."),
                        variant: "default",
                    });
                    // Invalidate user data to refresh subscription status
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: "Error updating subscription",
                        description: "Please try again later.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-base font-semibold text-primary uppercase tracking-wide">Pricing</h1>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Plans for every student
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
            Choose the plan that fits your learning needs and budget.
          </p>
        </div>

        {/* Toggle between monthly and annual pricing */}
        <div className="relative mt-6 flex justify-center">
          <div className="relative self-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex sm:mt-8">
            <button type="button" onClick={function () { return setIsAnnual(false); }} className={"relative ".concat(!isAnnual ? "bg-white dark:bg-gray-900" : "", " border-gray-200 rounded-md py-2 w-1/2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8")}>
              Monthly
            </button>
            <button type="button" onClick={function () { return setIsAnnual(true); }} className={"relative ".concat(isAnnual ? "bg-white dark:bg-gray-900" : "", " border-gray-200 rounded-md py-2 w-1/2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8")}>
              Annual
            </button>
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Save 15%
          </div>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {pricingPlans.map(function (plan) {
            var _a, _b, _c;
            return (<div key={plan.name} className={"border ".concat(plan.highlight
                    ? "border-primary dark:border-primary"
                    : "border-gray-200 dark:border-gray-700", " rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700")}>
              <div className="p-6 relative">
                {plan.highlight && (<div className="absolute top-0 right-0 -mt-3 mr-6 inline-flex rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
                    Popular
                  </div>)}
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">/year</span>
                </p>
                
                {isAuthenticated ? (<Button onClick={function () { return handleSubscribe(plan.name); }} className={"mt-8 block w-full ".concat(plan.highlight
                        ? "bg-primary hover:bg-primary-600"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300")} disabled={((_a = user === null || user === void 0 ? void 0 : user.subscriptionTier) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === plan.name.toLowerCase()}>
                    {((_b = user === null || user === void 0 ? void 0 : user.subscriptionTier) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === plan.name.toLowerCase()
                        ? "Current plan"
                        : plan.buttonText}
                  </Button>) : (<Link href="/signup">
                    <Button className={"mt-8 block w-full ".concat(plan.highlight
                        ? "bg-primary hover:bg-primary-600"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300")}>
                      {plan.buttonText}
                    </Button>
                  </Link>)}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map(function (feature) { return (<li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500"/>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>); })}
                  {(_c = plan.notIncluded) === null || _c === void 0 ? void 0 : _c.map(function (feature) { return (<li key={feature} className="flex space-x-3">
                      <X className="flex-shrink-0 h-5 w-5 text-gray-400"/>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>); })}
                </ul>
              </div>
            </div>);
        })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
            {[
            {
                q: "Can I change my plan later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
            },
            {
                q: "How does the spaced repetition system work?",
                a: "Our system automatically schedules review quizzes at scientifically proven intervals (days 1, 5, 15, 30, 60, 120, and 180) to maximize your retention of the material."
            },
            {
                q: "Are the AI-generated quizzes accurate?",
                a: "Yes, our AI-generated quizzes are based on the CBSE, ICSE, and ISC curricula and are designed to test your understanding at different levels of Bloom's Taxonomy."
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, UPI, and net banking."
            },
            {
                q: "Can I get a refund if I'm not satisfied?",
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our premium services."
            }
        ].map(function (faq, index) { return (<div key={index} className="pt-6 pb-8">
                <dt className="text-lg">
                  <p className="font-medium text-gray-900 dark:text-white">{faq.q}</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">{faq.a}</dd>
              </div>); })}
          </div>
        </div>
      </div>
    </div>);
};
export default Pricing;
