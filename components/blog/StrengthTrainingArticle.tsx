import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type PostProps = {
  title: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
};

export default function StrengthTrainingArticle({ post }: { post: PostProps }) {
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
                <div className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
                  <p className="text-gray-800 italic">
                    In school, I was weak in Chemistry.
                    <br />
                    So, which subject did I spend the most time on?
                    <br />
                    Pretty obvious, right?
                    <br />
                    <br />
                    As we grow older, our bodies start getting weaker too.
                    <br />
                    So isn't it just logical to spend more time on fitness as we
                    age?
                  </p>
                </div>
                <p className="text-lg leading-relaxed text-gray-700">
                  Strength training is not just about lifting weights; it's a
                  sophisticated approach to building muscle, improving power,
                  and enhancing overall fitness. By focusing on the underlying
                  science and implementing systematic strategies, you can
                  maximize your results. In this guide, we break down the core
                  principles that will help you optimize your strength training
                  journey.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Science of Muscle Growth and Strength
                </h2>
                <p>
                  Muscle growth is not just a result of lifting weights—it's the
                  outcome of a complex biological process called hypertrophy.
                  When you lift heavy loads, microscopic tears form in your
                  muscle fibers. These tears, though tiny, initiate a cascade of
                  responses where your body repairs and adapts the muscles,
                  making them stronger and larger over time. This process occurs
                  during recovery and depends on several key factors, all of
                  which are essential for progressive muscle development.
                </p>

                <div className="mt-8 mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-3">
                    Key Focus Areas
                  </h2>
                  <p className="text-gray-800">
                    To achieve maximal gains, focus on progressive overload,
                    volume, and recovery.
                  </p>
                </div>

                <p>
                  To achieve maximal gains, it is important to focus on three
                  core variables:
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  1. Progressive Overload
                </h3>
                <p>
                  Progressive overload is the cornerstone of muscle adaptation.
                  This principle refers to the gradual increase in stress placed
                  on the body during training. It can be achieved by increasing
                  weight, repetitions, sets, or even training frequency over
                  time. The goal is to push your muscles beyond their current
                  capacity to stimulate growth.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">2. Volume</h3>
                <p>
                  Training volume is the total amount of work you do during a
                  workout, typically quantified as sets × reps × load. Research
                  has consistently shown that muscle hypertrophy is highly
                  correlated with higher training volume, especially when
                  intensity is matched. However, balancing volume and intensity
                  is key to avoiding overtraining.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">3. Recovery</h3>
                <p>
                  Your muscles don't grow in the gym; they grow during the
                  recovery process. Recovery is just as important as training
                  itself, as this is when the muscles repair and adapt. Aim to
                  give each muscle group at least 48 hours between sessions for
                  optimal recovery, and make sure you're prioritizing quality
                  sleep, hydration, and nutrition.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Compound vs. Isolation Exercises: The Importance of Movement
                  Selection
                </h2>
                <p>
                  Strength training can be divided into compound and isolation
                  exercises, each serving a specific purpose in a well-rounded
                  program.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Compound Exercises
                      </h3>
                      <p>
                        These exercises target multiple muscle groups and are
                        foundational to any strength training routine. Movements
                        like squats, deadlifts, bench presses, and rows engage
                        large muscle groups, allowing you to lift heavier
                        weights. This leads to greater total-body strength and
                        muscle mass, stimulating both the central nervous system
                        (CNS) and hormonal systems, which are crucial for
                        long-term growth.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Isolation Exercises
                      </h3>
                      <p>
                        Isolation exercises, such as bicep curls and tricep
                        extensions, focus on individual muscles. While they are
                        less effective for overall strength development, they
                        are excellent tools for addressing muscle imbalances,
                        working on weak points, and achieving aesthetic goals.
                        They can complement compound movements in a
                        well-structured program.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Designing Your Strength Training Split
                </h2>
                <p>
                  The way you structure your training week is critical for
                  maximizing results, and it should be aligned with your goals
                  and experience level. Here are some common training splits:
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  1. Full-Body Routine
                </h3>
                <p>
                  Training all major muscle groups in one session is ideal for
                  beginners or those training 2-3 times a week. Full-body
                  training promotes balance, frequency, and recovery, which are
                  essential for new lifters to build a solid foundation.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  2. Upper/Lower Split
                </h3>
                <p>
                  This method alternates between upper body and lower body days,
                  typically over 4 sessions per week. It allows for higher
                  volume per muscle group, making it suitable for intermediate
                  lifters aiming to specialize in specific movements.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  3. Push/Pull/Legs Split
                </h3>
                <p>
                  Often used by more advanced lifters, this approach divides
                  exercises into pushing (e.g., chest, shoulders, triceps),
                  pulling (e.g., back, biceps), and leg days. Training six days
                  a week is common with this split, as it maximizes training
                  volume and recovery time per muscle group.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Nutrition: Fueling Muscle Growth and Recovery
                </h2>
                <p>
                  Proper nutrition is just as important as the workout itself.
                  For optimal strength training outcomes, nutrition must be
                  aligned with your training demands.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Protein: The Building Blocks of Muscle
                      </h3>
                      <p>
                        Protein is essential for muscle recovery and growth. Aim
                        for 1.6–2.2 grams of protein per kilogram of body
                        weight, depending on your training intensity and goals.
                        This supports muscle repair and minimizes muscle
                        breakdown.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Carbohydrates: Energy for Performance
                      </h3>
                      <p>
                        Carbohydrates are the body's primary fuel source during
                        intense physical activity. Adequate carbohydrate intake
                        ensures you have the energy to perform at your best
                        during workouts and helps replenish glycogen stores
                        post-training, which is crucial for recovery.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Fats: Hormonal Health
                      </h3>
                      <p>
                        Fats are essential for hormone production, particularly
                        testosterone, which plays a vital role in muscle
                        development. Healthy fats should make up 20–35% of your
                        daily caloric intake, with sources like avocados, nuts,
                        olive oil, and fatty fish.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Caloric Intake: The Energy Equation
                      </h3>
                      <p>
                        To gain muscle, you need to consume more calories than
                        you burn (a caloric surplus), while for fat loss, a
                        slight caloric deficit is required. The key is to ensure
                        your surplus or deficit is moderate to avoid excessive
                        fat gain or loss of muscle mass.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Tracking Progress and Adapting Your Training
                </h2>
                <p>
                  Tracking progress is essential for continuous improvement in
                  strength training. Keep a log of weights, reps, and sets to
                  ensure you are gradually increasing the load. However,
                  progress is rarely linear—expect plateaus. This is where
                  understanding the importance of variation becomes crucial.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Adjusting Training Variables
                </h3>
                <p>
                  If you encounter a plateau, it's time to adjust variables such
                  as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Volume:</strong> Increase the number of sets or
                    reps.
                  </li>
                  <li>
                    <strong>Intensity:</strong> Push your muscles with heavier
                    weights.
                  </li>
                  <li>
                    <strong>Frequency:</strong> Consider adding more training
                    days per week.
                  </li>
                  <li>
                    <strong>Deload Weeks:</strong> Reduce training volume or
                    intensity temporarily to allow full recovery.
                  </li>
                </ul>
                <p>
                  These adjustments are necessary to continue progressing and
                  avoid stagnation.
                </p>

                <div className="mt-8 mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-3">
                    Conclusion
                  </h2>
                  <p className="text-gray-800">
                    Strength training is a long-term commitment that requires
                    dedication and a scientific approach. By understanding the
                    physiological mechanisms of muscle growth and applying
                    fundamental principles like progressive overload, volume,
                    and recovery, you can develop a sustainable training program
                    that delivers long-lasting results.
                  </p>
                </div>

                <p>
                  Remember, consistency is key. Stick to the basics, track your
                  progress, and don't be afraid to adjust based on your body's
                  response. With patience, persistence, and the right strategy,
                  you'll see your strength improve and your goals achieved.
                </p>

                <p>
                  By grounding your strength training program in science and
                  adopting a holistic approach that includes progressive
                  overload, nutrition, and recovery, you'll set yourself up for
                  lasting success.
                </p>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
