import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import StrengthTrainingArticle from "@/components/blog/StrengthTrainingArticle";
import NutritionArticle from "@/components/blog/NutritionArticle";
import MindsetArticle from "@/components/blog/MindsetArticle";

// This would typically come from a CMS or database
const blogPosts = {
  "strength-training-basics": {
    title: "The Fundamentals of Strength Training",
    date: "April 15, 2025",
    category: "Training",
    readTime: "6 min read",
    imageUrl: "/strength.png",
  },
  "nutrition-for-muscle-growth": {
    title: "Nutrition Strategies for Optimal Muscle Growth",
    date: "March 22, 2025",
    category: "Nutrition",
    readTime: "8 min read",
    imageUrl: "/smoothie.png",
  },
  "mindset-transformation": {
    title: "The Mental Side of Physical Transformation",
    date: "February 10, 2025",
    category: "Mindset",
    readTime: "5 min read",
    imageUrl: "/mindset.png",
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

  // Render the strength training article component for that specific slug
  if (params.slug === "strength-training-basics") {
    return <StrengthTrainingArticle post={post} />;
  }

  // Render the nutrition article component for that specific slug
  if (params.slug === "nutrition-for-muscle-growth") {
    return <NutritionArticle post={post} />;
  }

  // Render the mindset article component for that specific slug
  if (params.slug === "mindset-transformation") {
    return <MindsetArticle post={post} />;
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
