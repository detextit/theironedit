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

export default function MindsetArticle({ post }: { post: PostProps }) {
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
                  Physical transformation begins in the mind. While training
                  programs and nutrition plans are essential, it's often the
                  mental aspects that determine long-term success. This article
                  explores how developing the right mindset can be the catalyst
                  for achieving lasting physical change.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Psychology of Transformation
                </h2>
                <p>
                  Physical transformation is as much a mental journey as it is a
                  physical one. Research in sports psychology consistently shows
                  that mental factors like motivation, self-belief, and
                  resilience significantly impact physical performance and
                  adherence to fitness programs.
                </p>
                <p>
                  Understanding the psychological principles that drive behavior
                  change can help you develop strategies to overcome obstacles
                  and maintain momentum throughout your fitness journey.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Identity-Based Habits
                      </h3>
                      <p>
                        One of the most powerful mindset shifts involves
                        changing how you view yourself. Instead of focusing
                        solely on outcome-based goals ("I want to lose 20
                        pounds"), consider identity-based habits ("I am someone
                        who exercises regularly").
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800">
                        Developing Mental Toughness
                      </h3>
                      <p>
                        Mental toughness—the ability to persist through
                        discomfort and adversity—is crucial for physical
                        transformation. It's what gets you to the gym on days
                        when motivation is low and helps you push through
                        challenging workouts.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Identity-Based Habits
                </h2>
                <p>
                  When you build habits around a new identity, behavior change
                  becomes more natural and sustainable. You're no longer trying
                  to force yourself to do something—you're simply acting in
                  alignment with who you believe yourself to be.
                </p>
                <p>
                  Ask yourself: "Who is the type of person who could achieve the
                  goals I want to achieve?" Then, prove to yourself that you are
                  that person through small, consistent actions.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Developing Mental Toughness
                </h2>
                <p>Strategies to build mental toughness include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Embracing discomfort:</strong> Deliberately seeking
                    out challenging situations in training
                  </li>
                  <li>
                    <strong>Visualization:</strong> Mentally rehearsing
                    successful performance and overcoming obstacles
                  </li>
                  <li>
                    <strong>Positive self-talk:</strong> Developing and
                    practicing empowering internal dialogue
                  </li>
                  <li>
                    <strong>Setting process goals:</strong> Focusing on actions
                    within your control rather than just outcomes
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Growth Mindset Advantage
                </h2>
                <p>
                  People with a growth mindset believe that abilities can be
                  developed through dedication and hard work. This view creates
                  a love of learning and resilience that is essential for great
                  accomplishment in any field, including fitness.
                </p>
                <p>To cultivate a growth mindset:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View challenges as opportunities to grow</li>
                  <li>Embrace failure as a learning experience</li>
                  <li>Focus on the process rather than just the outcome</li>
                  <li>Celebrate effort and persistence, not just results</li>
                  <li>Seek feedback and use it constructively</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Overcoming Mental Barriers
                </h2>
                <p>
                  Common mental barriers to physical transformation include:
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  All-or-Nothing Thinking
                </h3>
                <p>
                  The belief that you must follow your program perfectly or
                  you've failed. This mindset leads to giving up after small
                  setbacks.
                </p>
                <p>
                  <strong>Solution:</strong> Adopt the "never miss twice" rule.
                  If you miss a workout or meal, ensure you don't miss the next
                  one. Consistency, not perfection, drives results.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Immediate Gratification Bias
                </h3>
                <p>
                  The tendency to choose immediate rewards (comfort,
                  convenience) over long-term benefits (health, fitness).
                </p>
                <p>
                  <strong>Solution:</strong> Use "temptation bundling"—pair
                  activities you need to do with activities you want to do
                  (e.g., watching your favorite show only while on the
                  treadmill).
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Negative Self-Image
                </h3>
                <p>Limiting beliefs about what you're capable of achieving.</p>
                <p>
                  <strong>Solution:</strong> Challenge negative thoughts with
                  evidence of past successes, however small. Surround yourself
                  with supportive people who reinforce your potential.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  The Power of Habits and Systems
                </h2>
                <p>
                  Sustainable transformation comes from building systems rather
                  than relying on motivation. Motivation fluctuates, but
                  well-designed habits and systems provide consistency.
                </p>
                <p>To build effective systems:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Make it obvious:</strong> Set clear cues for your
                    desired behaviors (e.g., laying out workout clothes the
                    night before)
                  </li>
                  <li>
                    <strong>Make it attractive:</strong> Find ways to enjoy the
                    process (e.g., listening to podcasts during cardio)
                  </li>
                  <li>
                    <strong>Make it easy:</strong> Reduce friction for positive
                    behaviors (e.g., joining a gym close to home or work)
                  </li>
                  <li>
                    <strong>Make it satisfying:</strong> Create immediate
                    rewards for long-term behaviors (e.g., tracking workouts in
                    a journal)
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Mindfulness and Body Awareness
                </h2>
                <p>
                  Developing mindfulness—the ability to be fully present and
                  engaged in the moment—can significantly enhance your physical
                  transformation journey. Mindfulness improves exercise quality,
                  helps regulate eating behaviors, and reduces stress.
                </p>
                <p>Practice mindfulness by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Focusing on muscle contractions during strength training
                  </li>
                  <li>
                    Paying attention to hunger and fullness cues when eating
                  </li>
                  <li>
                    Using breathing techniques to manage stress and improve
                    recovery
                  </li>
                  <li>
                    Practicing gratitude for what your body can do, rather than
                    focusing only on how it looks
                  </li>
                </ul>

                <div className="mt-8 mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-3">
                    Conclusion
                  </h2>
                  <p className="text-gray-800">
                    The mind leads and the body follows. By developing a strong
                    mental foundation—embracing identity-based habits,
                    cultivating mental toughness, adopting a growth mindset,
                    overcoming common barriers, building effective systems, and
                    practicing mindfulness—you create the conditions for lasting
                    physical transformation.
                  </p>
                </div>

                <p>
                  Remember that transformation is a journey, not a destination.
                  The mental skills you develop along the way will serve you not
                  just in your fitness pursuits, but in all areas of life.
                </p>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
