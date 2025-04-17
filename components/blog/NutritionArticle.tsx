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

export default function NutritionArticle({ post }: { post: PostProps }) {
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
                  Building muscle requires more than just lifting weights—it
                  demands a strategic approach to nutrition that supports
                  recovery, growth, and performance. This article explores
                  science-backed nutrition principles to maximize your
                  muscle-building potential.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Caloric Surplus: The Foundation of Growth
                </h2>
                <p>
                  To build new muscle tissue, your body needs energy beyond what
                  it requires for basic functions and daily activities. This
                  extra energy comes from consuming more calories than you
                  burn—a state known as a caloric surplus.
                </p>
                <p>
                  For most people, a modest surplus of 250–500 calories above
                  maintenance is ideal for maximizing muscle growth while
                  minimizing fat gain. Larger surpluses may accelerate muscle
                  gain slightly but often come with significant fat
                  accumulation.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Protein: The Building Blocks
                </h2>
                <p>
                  Protein provides the amino acids necessary for muscle repair
                  and growth. Research consistently shows that strength-training
                  individuals benefit from higher protein intakes than the
                  general population.
                </p>
                <p>
                  Aim for 1.6–2.2g of protein per kilogram of bodyweight, spread
                  across 4–5 meals throughout the day. This approach maximizes
                  muscle protein synthesis and provides a steady stream of amino
                  acids to your muscles.
                </p>
                <p>Quality protein sources include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Lean meats (chicken, turkey, lean beef)</li>
                  <li>Fish and seafood</li>
                  <li>Eggs</li>
                  <li>Dairy (Greek yogurt, cottage cheese, whey protein)</li>
                  <li>
                    Plant-based options (tofu, tempeh, legumes, protein powders)
                  </li>
                </ul>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Carbohydrates: Fuel for Performance
                      </h3>
                      <p>
                        Carbohydrates are your muscles' preferred energy source
                        during high-intensity training. They also play a crucial
                        role in recovery by replenishing muscle glycogen stores
                        and creating an anabolic environment through insulin
                        release.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Fats: Hormonal Support
                      </h3>
                      <p>
                        Dietary fats play a crucial role in hormone production,
                        including testosterone and growth hormone, which are
                        essential for muscle growth. They also provide energy,
                        support cell membrane health, and aid in vitamin
                        absorption.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Carbohydrates: Fuel for Performance
                </h2>
                <p>
                  For muscle growth, prioritize carbohydrates around your
                  training:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Pre-workout:</strong> 25–40g of easily digestible
                    carbs 1–2 hours before training
                  </li>
                  <li>
                    <strong>Post-workout:</strong> 40–80g of fast-digesting
                    carbs within 30–60 minutes after training
                  </li>
                  <li>
                    <strong>Daily intake:</strong> 4–7g per kilogram of
                    bodyweight, depending on training volume and individual
                    response
                  </li>
                </ul>
                <p>
                  Focus on quality carbohydrate sources like rice, potatoes,
                  oats, fruits, and whole grains for sustained energy and
                  micronutrients.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Fats: Hormonal Support
                </h2>
                <p>
                  Aim for 0.5–1g of fat per kilogram of bodyweight, with an
                  emphasis on healthy sources:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Avocados</li>
                  <li>Nuts and seeds</li>
                  <li>Olive oil</li>
                  <li>Fatty fish (salmon, mackerel)</li>
                  <li>Egg yolks</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Meal Timing and Frequency
                </h2>
                <p>
                  While total daily intake is most important, strategic meal
                  timing can optimize muscle growth:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Eat every 3–4 hours</strong> to maintain elevated
                    muscle protein synthesis
                  </li>
                  <li>
                    <strong>Consume protein before bed</strong> to support
                    overnight recovery (casein protein is ideal)
                  </li>
                  <li>
                    <strong>Prioritize post-workout nutrition</strong> with
                    protein and carbohydrates
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Hydration: The Overlooked Factor
                </h2>
                <p>
                  Proper hydration is essential for optimal performance and
                  recovery. Even mild dehydration can impair strength, power,
                  and endurance. Aim for at least 3–4 liters of water daily,
                  with additional fluids during training.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Supplements Worth Considering
                </h2>
                <p>
                  While whole foods should form the foundation of your nutrition
                  plan, certain supplements can provide additional benefits:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Whey Protein:</strong> Convenient source of
                    high-quality protein
                  </li>
                  <li>
                    <strong>Creatine Monohydrate:</strong> Well-researched
                    supplement that improves strength, power, and muscle growth
                  </li>
                  <li>
                    <strong>Vitamin D:</strong> Important for hormone production
                    and overall health
                  </li>
                  <li>
                    <strong>Omega-3 Fatty Acids:</strong> Support recovery and
                    reduce inflammation
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Adjusting for Individual Response
                </h2>
                <p>
                  Nutrition is highly individual. Monitor your progress by
                  tracking body measurements, strength gains, and energy levels.
                  Make adjustments based on your results:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If gaining too much fat, reduce your caloric surplus</li>
                  <li>
                    If not gaining muscle, increase calories or adjust
                    macronutrient ratios
                  </li>
                  <li>
                    If recovery is poor, evaluate carbohydrate intake and
                    overall calories
                  </li>
                </ul>

                <div className="mt-8 mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-3">
                    Conclusion
                  </h2>
                  <p className="text-gray-800">
                    Effective nutrition for muscle growth combines adequate
                    calories, optimal macronutrient ratios, strategic timing,
                    and consistency. By implementing these science-backed
                    strategies and adjusting based on your individual response,
                    you'll create the ideal environment for your body to build
                    and maintain muscle mass.
                  </p>
                </div>

                <p>
                  Remember that nutrition is just one piece of the puzzle—it
                  works in conjunction with proper training, adequate sleep, and
                  stress management to produce optimal results.
                </p>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
