import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

// This would typically come from a CMS or database
const blogPosts = {
  "strength-training-basics": {
    title: "The Fundamentals of Strength Training",
    date: "April 15, 2025",
    category: "Training",
    readTime: "6 min read",
    imageUrl: "/ironEditGym.png",
    content: `
      <p class="lead">Strength training is more than just lifting weights—it's a systematic approach to building muscle, increasing power, and improving overall fitness. In this comprehensive guide, we'll explore the core principles that make strength training effective.</p>
      
      <h2>The Science Behind Muscle Growth</h2>
      
      <p>When you lift weights, you create microscopic tears in your muscle fibers. During recovery, your body repairs these tears, making the muscles stronger and larger than before. This process, known as hypertrophy, is the foundation of strength training.</p>
      
      <p>For optimal results, you need to understand three key variables:</p>
      
      <ul>
        <li><strong>Progressive Overload:</strong> Gradually increasing the weight, frequency, or number of repetitions to continually challenge your muscles.</li>
        <li><strong>Volume:</strong> The total amount of work performed (sets × reps × weight).</li>
        <li><strong>Recovery:</strong> Allowing adequate time between training sessions for muscles to repair and grow.</li>
      </ul>
      
      <h2>Compound vs. Isolation Exercises</h2>
      
      <p>Compound exercises like squats, deadlifts, bench presses, and rows should form the foundation of your strength training program. These movements engage multiple muscle groups simultaneously, allowing you to lift heavier weights and stimulate more muscle growth.</p>
      
      <p>Isolation exercises like bicep curls, tricep extensions, and lateral raises target specific muscles and are best used as complementary movements to address weak points or aesthetic goals.</p>
      
      <h2>Designing Your Training Split</h2>
      
      <p>How you organize your training throughout the week depends on your goals, experience level, and recovery capacity. Common approaches include:</p>
      
      <ul>
        <li><strong>Full-Body:</strong> Training all major muscle groups in each session, typically 2-3 times per week.</li>
        <li><strong>Upper/Lower:</strong> Alternating between upper body and lower body days, usually 4 sessions per week.</li>
        <li><strong>Push/Pull/Legs:</strong> Dividing training into pushing movements, pulling movements, and leg exercises, often 6 sessions per week.</li>
      </ul>
      
      <p>Beginners typically benefit most from full-body routines, while more advanced lifters may prefer splits that allow greater volume for each muscle group.</p>
      
      <h2>The Role of Nutrition in Strength Training</h2>
      
      <p>Your diet plays a crucial role in your strength training results. Key nutritional considerations include:</p>
      
      <ul>
        <li><strong>Protein:</strong> Aim for 1.6-2.2g per kg of bodyweight to support muscle repair and growth.</li>
        <li><strong>Carbohydrates:</strong> Provide energy for intense training sessions and help with recovery.</li>
        <li><strong>Fats:</strong> Support hormone production, including testosterone, which is essential for muscle growth.</li>
        <li><strong>Caloric Intake:</strong> Slightly above maintenance for muscle gain, slightly below for fat loss while preserving muscle.</li>
      </ul>
      
      <h2>Tracking Progress and Making Adjustments</h2>
      
      <p>Consistent progress requires systematic tracking and periodic adjustments to your program. Keep a training log to record weights, sets, and reps, and make small increases when you can complete your target repetitions with good form.</p>
      
      <p>Remember that progress isn't always linear. You'll experience plateaus that require changes to your training variables, such as adjusting volume, frequency, exercise selection, or even taking a deload week to allow for complete recovery.</p>
      
      <h2>Conclusion</h2>
      
      <p>Strength training is a journey that requires patience, consistency, and a willingness to learn. By understanding and applying these fundamental principles, you'll build a solid foundation for long-term progress and results.</p>
      
      <p>Remember, the most effective program is one that you can stick to consistently. Start with these basics, track your progress, and make adjustments based on your individual response and goals.</p>
    `,
  },
  "nutrition-for-muscle-growth": {
    title: "Nutrition Strategies for Optimal Muscle Growth",
    date: "March 22, 2025",
    category: "Nutrition",
    readTime: "8 min read",
    imageUrl: "/placeholder.svg?height=800&width=1200",
    content: `
      <p class="lead">Building muscle requires more than just lifting weights—it demands a strategic approach to nutrition that supports recovery, growth, and performance. This article explores the science-backed nutrition principles that can maximize your muscle-building potential.</p>
      
      <h2>Caloric Surplus: The Foundation of Growth</h2>
      
      <p>To build new muscle tissue, your body needs energy beyond what it requires for basic functions and daily activities. This extra energy comes from consuming more calories than you burn—a state known as a caloric surplus.</p>
      
      <p>For most people, a modest surplus of 250-500 calories above maintenance is ideal for maximizing muscle growth while minimizing fat gain. Larger surpluses may accelerate muscle gain slightly but often come with significant fat accumulation.</p>
      
      <h2>Protein: The Building Blocks</h2>
      
      <p>Protein provides the amino acids necessary for muscle repair and growth. Research consistently shows that strength-training individuals benefit from higher protein intakes than the general population.</p>
      
      <p>Aim for 1.6-2.2g of protein per kilogram of bodyweight, spread across 4-5 meals throughout the day. This approach maximizes muscle protein synthesis and provides a steady stream of amino acids to your muscles.</p>
      
      <p>Quality protein sources include:</p>
      
      <ul>
        <li>Lean meats (chicken, turkey, lean beef)</li>
        <li>Fish and seafood</li>
        <li>Eggs</li>
        <li>Dairy (Greek yogurt, cottage cheese, whey protein)</li>
        <li>Plant-based options (tofu, tempeh, legumes, protein powders)</li>
      </ul>
      
      <h2>Carbohydrates: Fuel for Performance</h2>
      
      <p>Carbohydrates are your muscles' preferred energy source during high-intensity training. They also play a crucial role in recovery by replenishing muscle glycogen stores and creating an anabolic environment through insulin release.</p>
      
      <p>For muscle growth, prioritize carbohydrates around your training:</p>
      
      <ul>
        <li><strong>Pre-workout:</strong> 25-40g of easily digestible carbs 1-2 hours before training</li>
        <li><strong>Post-workout:</strong> 40-80g of fast-digesting carbs within 30-60 minutes after training</li>
        <li><strong>Daily intake:</strong> 4-7g per kilogram of bodyweight, depending on training volume and individual response</li>
      </ul>
      
      <p>Focus on quality carbohydrate sources like rice, potatoes, oats, fruits, and whole grains for sustained energy and micronutrients.</p>
      
      <h2>Fats: Hormonal Support</h2>
      
      <p>Dietary fats play a crucial role in hormone production, including testosterone and growth hormone, which are essential for muscle growth. They also provide energy, support cell membrane health, and aid in vitamin absorption.</p>
      
      <p>Aim for 0.5-1g of fat per kilogram of bodyweight, with an emphasis on healthy sources:</p>
      
      <ul>
        <li>Avocados</li>
        <li>Nuts and seeds</li>
        <li>Olive oil</li>
        <li>Fatty fish (salmon, mackerel)</li>
        <li>Egg yolks</li>
      </ul>
      
      <h2>Meal Timing and Frequency</h2>
      
      <p>While total daily intake is most important, strategic meal timing can optimize muscle growth:</p>
      
      <ul>
        <li><strong>Eat every 3-4 hours</strong> to maintain elevated muscle protein synthesis</li>
        <li><strong>Consume protein before bed</strong> to support overnight recovery (casein protein is ideal)</li>
        <li><strong>Prioritize post-workout nutrition</strong> with protein and carbohydrates</li>
      </ul>
      
      <h2>Hydration: The Overlooked Factor</h2>
      
      <p>Proper hydration is essential for optimal performance and recovery. Even mild dehydration can impair strength, power, and endurance. Aim for at least 3-4 liters of water daily, with additional fluids during training.</p>
      
      <h2>Supplements Worth Considering</h2>
      
      <p>While whole foods should form the foundation of your nutrition plan, certain supplements can provide additional benefits:</p>
      
      <ul>
        <li><strong>Whey Protein:</strong> Convenient source of high-quality protein</li>
        <li><strong>Creatine Monohydrate:</strong> Well-researched supplement that improves strength, power, and muscle growth</li>
        <li><strong>Vitamin D:</strong> Important for hormone production and overall health</li>
        <li><strong>Omega-3 Fatty Acids:</strong> Support recovery and reduce inflammation</li>
      </ul>
      
      <h2>Adjusting for Individual Response</h2>
      
      <p>Nutrition is highly individual. Monitor your progress by tracking body measurements, strength gains, and energy levels. Make adjustments based on your results:</p>
      
      <ul>
        <li>If gaining too much fat, reduce your caloric surplus</li>
        <li>If not gaining muscle, increase calories or adjust macronutrient ratios</li>
        <li>If recovery is poor, evaluate carbohydrate intake and overall calories</li>
      </ul>
      
      <h2>Conclusion</h2>
      
      <p>Effective nutrition for muscle growth combines adequate calories, optimal macronutrient ratios, strategic timing, and consistency. By implementing these science-backed strategies and adjusting based on your individual response, you'll create the ideal environment for your body to build and maintain muscle mass.</p>
      
      <p>Remember that nutrition is just one piece of the puzzle—it works in conjunction with proper training, adequate sleep, and stress management to produce optimal results.</p>
    `,
  },
  "mindset-transformation": {
    title: "The Mental Side of Physical Transformation",
    date: "February 10, 2025",
    category: "Mindset",
    readTime: "5 min read",
    imageUrl: "/placeholder.svg?height=800&width=1200",
    content: `
      <p class="lead">Physical transformation begins in the mind. While training programs and nutrition plans are essential, it's often the mental aspects that determine long-term success. This article explores how developing the right mindset can be the catalyst for achieving lasting physical change.</p>
      
      <h2>The Psychology of Transformation</h2>
      
      <p>Physical transformation is as much a mental journey as it is a physical one. Research in sports psychology consistently shows that mental factors like motivation, self-belief, and resilience significantly impact physical performance and adherence to fitness programs.</p>
      
      <p>Understanding the psychological principles that drive behavior change can help you develop strategies to overcome obstacles and maintain momentum throughout your fitness journey.</p>
      
      <h2>Identity-Based Habits</h2>
      
      <p>One of the most powerful mindset shifts involves changing how you view yourself. Instead of focusing solely on outcome-based goals ("I want to lose 20 pounds"), consider identity-based habits ("I am someone who exercises regularly").</p>
      
      <p>When you build habits around a new identity, behavior change becomes more natural and sustainable. You're no longer trying to force yourself to do something—you're simply acting in alignment with who you believe yourself to be.</p>
      
      <p>Ask yourself: "Who is the type of person who could achieve the goals I want to achieve?" Then, prove to yourself that you are that person through small, consistent actions.</p>
      
      <h2>Developing Mental Toughness</h2>
      
      <p>Mental toughness—the ability to persist through discomfort and adversity—is crucial for physical transformation. It's what gets you to the gym on days when motivation is low and helps you push through challenging workouts.</p>
      
      <p>Strategies to build mental toughness include:</p>
      
      <ul>
        <li><strong>Embracing discomfort:</strong> Deliberately seeking out challenging situations in training</li>
        <li><strong>Visualization:</strong> Mentally rehearsing successful performance and overcoming obstacles</li>
        <li><strong>Positive self-talk:</strong> Developing and practicing empowering internal dialogue</li>
        <li><strong>Setting process goals:</strong> Focusing on actions within your control rather than just outcomes</li>
      </ul>
      
      <h2>The Growth Mindset Advantage</h2>
      
      <p>People with a growth mindset believe that abilities can be developed through dedication and hard work. This view creates a love of learning and resilience that is essential for great accomplishment in any field, including fitness.</p>
      
      <p>To cultivate a growth mindset:</p>
      
      <ul>
        <li>View challenges as opportunities to grow</li>
        <li>Embrace failure as a learning experience</li>
        <li>Focus on the process rather than just the outcome</li>
        <li>Celebrate effort and persistence, not just results</li>
        <li>Seek feedback and use it constructively</li>
      </ul>
      
      <h2>Overcoming Mental Barriers</h2>
      
      <p>Common mental barriers to physical transformation include:</p>
      
      <h3>1. All-or-Nothing Thinking</h3>
      
      <p>The belief that you must follow your program perfectly or you've failed. This mindset leads to giving up after small setbacks.</p>
      
      <p><strong>Solution:</strong> Adopt the "never miss twice" rule. If you miss a workout or meal, ensure you don't miss the next one. Consistency, not perfection, drives results.</p>
      
      <h3>2. Immediate Gratification Bias</h3>
      
      <p>The tendency to choose immediate rewards (comfort, convenience) over long-term benefits (health, fitness).</p>
      
      <p><strong>Solution:</strong> Use "temptation bundling"—pair activities you need to do with activities you want to do (e.g., watching your favorite show only while on the treadmill).</p>
      
      <h3>3. Negative Self-Image</h3>
      
      <p>Limiting beliefs about what you're capable of achieving.</p>
      
      <p><strong>Solution:</strong> Challenge negative thoughts with evidence of past successes, however small. Surround yourself with supportive people who reinforce your potential.</p>
      
      <h2>The Power of Habits and Systems</h2>
      
      <p>Sustainable transformation comes from building systems rather than relying on motivation. Motivation fluctuates, but well-designed habits and systems provide consistency.</p>
      
      <p>To build effective systems:</p>
      
      <ul>
        <li><strong>Make it obvious:</strong> Set clear cues for your desired behaviors (e.g., laying out workout clothes the night before)</li>
        <li><strong>Make it attractive:</strong> Find ways to enjoy the process (e.g., listening to podcasts during cardio)</li>
        <li><strong>Make it easy:</strong> Reduce friction for positive behaviors (e.g., joining a gym close to home or work)</li>
        <li><strong>Make it satisfying:</strong> Create immediate rewards for long-term behaviors (e.g., tracking workouts in a journal)</li>
      </ul>
      
      <h2>Mindfulness and Body Awareness</h2>
      
      <p>Developing mindfulness—the ability to be fully present and engaged in the moment—can significantly enhance your physical transformation journey. Mindfulness improves exercise quality, helps regulate eating behaviors, and reduces stress.</p>
      
      <p>Practice mindfulness by:</p>
      
      <ul>
        <li>Focusing on muscle contractions during strength training</li>
        <li>Paying attention to hunger and fullness cues when eating</li>
        <li>Using breathing techniques to manage stress and improve recovery</li>
        <li>Practicing gratitude for what your body can do, rather than focusing only on how it looks</li>
      </ul>
      
      <h2>Conclusion</h2>
      
      <p>The mind leads and the body follows. By developing a strong mental foundation—embracing identity-based habits, cultivating mental toughness, adopting a growth mindset, overcoming common barriers, building effective systems, and practicing mindfulness—you create the conditions for lasting physical transformation.</p>
      
      <p>Remember that transformation is a journey, not a destination. The mental skills you develop along the way will serve you not just in your fitness pursuits, but in all areas of life.</p>
    `,
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-powder-blue to-gray-200 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-powder-blue to-gray-200 text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full inline-flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {post.category}
              </span>
              <span className="text-gray-500 text-sm inline-flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {post.date}
              </span>
              <span className="text-gray-500 text-sm inline-flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {post.title}
            </h1>

            <div
              className="prose prose-lg max-w-none prose-indigo prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
