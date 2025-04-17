import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PostProps = {
  title: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
};

export default function BrainTrainingArticle({ post }: { post: PostProps }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <Card className="mb-8 overflow-hidden border-none shadow-xl rounded-xl">
            <div className="relative h-[400px] w-full">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">
                  {post.title}
                </h1>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Tag className="w-4 h-4" />
                    {post.category}
                  </Badge>
                  <span className="text-gray-200 text-sm inline-flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </span>
                  <span className="text-gray-200 text-sm inline-flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-8 bg-white">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-gray-700">
                  Understanding how our brains work can dramatically improve our
                  fitness journey. This article explores the fascinating divide
                  between our brain's two processing systems and how leveraging
                  this knowledge can transform abstract fitness goals into
                  achievable results.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Two Sides of Our Brain
                </h2>
                <p>
                  One part of our brain handles tangibles—things like numbers,
                  facts, and formulas. Let's call it the left brain. The other
                  part—the right brain—deals with intangibles: emotions,
                  relationships, feelings, instincts.
                </p>
                <p>
                  This division isn't just interesting neuroscience—it's the key
                  to understanding why some fitness goals succeed while others
                  fail before they even begin.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        The Left Brain
                      </h3>
                      <p>
                        Processes tangible information: numbers, facts,
                        measurements, schedules, and concrete data. This is the
                        part that excels at tracking workouts, counting
                        calories, and following structured plans.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        The Right Brain
                      </h3>
                      <p>
                        Handles intangible concepts: emotions, motivation,
                        willpower, and abstract goals. This is where vague
                        intentions like "getting fit" or "eating better"
                        live—often without clear direction.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Education Imbalance
                </h2>
                <p>
                  Now think about this: when a child first starts to speak,
                  everyone jumps in with their best coaching skills to teach
                  names, numbers, alphabets. Then comes sentence formation,
                  algebra, trigonometry, solid mechanics, the circulatory
                  system, the law of diminishing returns, the Battle of Buxar,
                  Excel sheets, budgets, gross margins... you get the idea.
                </p>
                <p>
                  From the start, almost all formal education is geared toward
                  training the left brain. Meanwhile, the right brain is left to
                  figure things out on its own—through life, experience, and
                  maybe a few therapy sessions later.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Why Vague Fitness Goals Fail
                </h2>
                <p>
                  The result? We become experts at handling tangible stuff, and
                  often struggle with the intangibles—like willpower,
                  consistency, or simply "wanting to get healthy."
                </p>
                <p>
                  That's why vague goals like "I'll start eating better
                  tomorrow" or "I want to get fit" often go nowhere. These
                  abstract intentions live in the right brain, which hasn't been
                  trained to execute plans the way our left brain has.
                </p>
                <p>
                  When we say "I'll exercise more," our brain doesn't have a
                  clear target to aim for. Without specifics, our highly-trained
                  left brain sits idle while our underdeveloped right brain
                  struggles to maintain motivation.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Power of Tangible Goals
                </h2>
                <p>
                  But here's the trick: the moment we translate those abstract
                  goals into tangibles—trackable workouts, measurable nutrition,
                  clear timelines—the brain suddenly knows what to do.
                </p>
                <p>
                  When "get fit" becomes "complete three 30-minute strength
                  training sessions per week," your left brain activates. It
                  understands schedules, numbers, and concrete actions.
                  Suddenly, your goal has shifted from an abstract wish to a
                  tangible plan.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Tools That Speak Your Brain's Language
                </h3>
                <p>
                  So don't underestimate the power of a smartwatch, a fitness
                  app, or a well-defined goal. They aren't just gadgets or
                  plans—they're tools that speak your brain's language.
                </p>
                <p>
                  These tools transform abstract concepts into concrete data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Fitness trackers:</strong> Convert "be more active"
                    into "10,000 steps today"
                  </li>
                  <li>
                    <strong>Workout apps:</strong> Transform "get stronger" into
                    "increased your squat by 10 pounds"
                  </li>
                  <li>
                    <strong>Meal planning:</strong> Change "eat better" into
                    "consumed 120g of protein today"
                  </li>
                  <li>
                    <strong>Progress photos:</strong> Turn invisible progress
                    into visible evidence
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Bridging the Brain Divide
                </h2>
                <p>
                  The most successful fitness journeys bridge the gap between
                  both sides of the brain:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Start with inspiration (right brain):</strong>{" "}
                    Connect with your deeper "why"
                  </li>
                  <li>
                    <strong>Create a specific plan (left brain):</strong> Define
                    exactly what you'll do and when
                  </li>
                  <li>
                    <strong>Track progress (left brain):</strong> Measure and
                    record your results
                  </li>
                  <li>
                    <strong>Celebrate achievements (right brain):</strong> Feel
                    the satisfaction of progress
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Making Your Goals Visible
                </h2>
                <p>
                  Make your goals visible. Turn "someday" into something your
                  brain can actually schedule. And if that feels hard to do
                  alone, get help. After all, we were all wired this way.
                </p>
                <p>Consider these strategies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Write down specific goals:</strong> "I will strength
                    train Monday, Wednesday, and Friday at 6pm for 45 minutes"
                  </li>
                  <li>
                    <strong>Use visual cues:</strong> Calendar reminders,
                    workout clothes laid out the night before
                  </li>
                  <li>
                    <strong>Create accountability:</strong> Training partners,
                    coaches, or scheduled classes
                  </li>
                  <li>
                    <strong>Track everything:</strong> Workouts completed,
                    weights lifted, measurements changed
                  </li>
                </ul>

                <div className="mt-8 mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-3">
                    Conclusion
                  </h2>
                  <p className="text-gray-800">
                    Understanding how your brain processes information is a
                    powerful tool in your fitness journey. By translating
                    abstract fitness goals into concrete, measurable actions,
                    you activate the part of your brain that's been trained to
                    execute plans effectively. Don't leave your fitness success
                    to vague intentions—give your brain the tangible targets it
                    needs to succeed.
                  </p>
                </div>

                <p>
                  Remember, this isn't about which side of the brain is
                  better—it's about using both parts effectively. When you
                  combine the emotional drive of your right brain with the
                  execution capabilities of your left brain, you create a
                  powerful system for lasting fitness success.
                </p>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
