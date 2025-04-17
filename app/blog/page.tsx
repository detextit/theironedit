import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const blogPosts = [
  {
    id: "strength-training-basics",
    title: "The Fundamentals of Strength Training",
    excerpt:
      "Discover the core principles of effective strength training and how to build a solid foundation for your fitness journey.",
    date: "April 15, 2025",
    category: "Training",
    imageUrl: "/ironEditGym.png",
    readTime: "6 min read",
  },
  {
    id: "nutrition-for-muscle-growth",
    title: "Nutrition Strategies for Optimal Muscle Growth",
    excerpt:
      "Learn the science-backed nutrition principles that maximize muscle growth and recovery for better training results.",
    date: "March 22, 2025",
    category: "Nutrition",
    imageUrl: "/placeholder.svg?height=600&width=800",
    readTime: "8 min read",
  },
  {
    id: "mindset-transformation",
    title: "The Mental Side of Physical Transformation",
    excerpt:
      "Explore how developing the right mindset is often the missing piece in achieving lasting physical transformation.",
    date: "February 10, 2025",
    category: "Mindset",
    imageUrl: "/placeholder.svg?height=600&width=800",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-powder-blue to-gray-200 text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
            The Iron Edit Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Insights, tips, and strategies to help you transform your body and
            empower your mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
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
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                  <div className="text-indigo-600 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform">
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
