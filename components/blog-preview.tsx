import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const featuredPosts = [
  {
    id: "strength-training-basics",
    title: "The Fundamentals of Strength Training",
    excerpt:
      "Discover the core principles of effective strength training and how to build a solid foundation for your fitness journey.",
    category: "Training",
    imageUrl: "/ironEditGym.png",
  },
  {
    id: "nutrition-for-muscle-growth",
    title: "Nutrition Strategies for Optimal Muscle Growth",
    excerpt:
      "Learn the science-backed nutrition principles that maximize muscle growth and recovery for better training results.",
    category: "Nutrition",
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "mindset-transformation",
    title: "The Mental Side of Physical Transformation",
    excerpt:
      "Explore how developing the right mindset is often the missing piece in achieving lasting physical transformation.",
    category: "Mindset",
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
];

export default function BlogPreview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
            Latest from Our Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and strategies to help you transform your body and
            empower your mind.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                  <div className="text-indigo-600 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center bg-white hover:bg-gray-50 text-indigo-600 font-medium py-3 px-6 rounded-full border border-gray-300 transition-colors"
          >
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
