"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell } from "lucide-react";
import BlogPreview from "@/components/blog-preview";
import { SessionControl } from "@audentic/react";
import { SocialIcon } from "react-social-icons";

export default function Home() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      parallaxRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Voice agent widget settings
  const widgetSettings = {
    showBackgroundCard: false,
    title: "Start Your Journey",
    backgroundColor: "#f1f5fd",
    textColor: "#192857",
    width: "200",
    height: "100",
    buttonText: "Start Your Journey",
    primaryColor: "#6366f1",
    buttonTextColor: "#FFFFFF",
    borderRadius: "12",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-powder-blue to-gray-200 text-gray-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div ref={parallaxRef} className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-indigo-300 to-indigo-500"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.2,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
              THE IRON EDIT
            </h1>
            <p className="text-xl mt-2 text-gray-600">
              Forged in Steel. Designed for Everyone.
            </p>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="#about"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#method"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Method
            </Link>
            <Link
              href="#transformation"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Transformation
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <section className="min-h-[80vh] flex flex-col justify-center mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2"
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Transform Your Body.{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
                  Empower Your Mind.
                </span>
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl">
                Welcome to The Iron Edit. With over 30 years of experience in
                the Steel industry, Ajay has forged a unique approach to
                physical transformation that builds strength, resilience, and
                confidence for all.
              </p>

              <motion.div
                className="bg-transparent p-8 rounded-2xl mb-12 border border-indigo-100 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="italic text-xl text-gray-700">
                  "From the furnace of adversity comes the strongest steel. Your
                  transformation journey is no different."
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link
                  href="#contact"
                  className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white py-4 px-8 rounded-full font-bold text-center flex items-center justify-center group transition-all duration-300"
                >
                  START YOUR JOURNEY
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#method"
                  className="bg-gray-600/10 hover:bg-gray-600/20 backdrop-blur-sm text-gray-700 py-4 px-8 rounded-full font-bold text-center border border-gray-300 transition-all duration-300"
                >
                  EXPLORE THE METHOD
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="md:w-1/2 flex justify-center items-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative aspect-square max-w-[500px] rounded-xl overflow-hidden border-2 border-indigo-400 shadow-2xl bg-white/70 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-indigo-400/50">
                <Image
                  src="/ironEdit2.png"
                  alt="Iron Edit"
                  width={600}
                  height={600}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Alloy Method Section */}
        <section id="method" className="py-20 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
                THE ALLOY METHOD™
              </span>
            </h2>
            <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-gray-600">
              Just as steel becomes stronger through the right combination of
              elements, Ajay's adaptive Alloy Method fuses three powerful
              components to forge lasting transformation:
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  title: "PERSONALIZED NUTRITION",
                  description:
                    "Precision-engineered meal plans calibrated to your individual needs and goals.",
                  icon: "🍽️",
                  delay: 0.2,
                },
                {
                  title: "ADAPTIVE TRAINING",
                  description:
                    "Scientifically designed programs that build strength and endurance for every body type.",
                  icon: "💪",
                  delay: 0.4,
                },
                {
                  title: "MINDSET COACHING",
                  description:
                    "Supportive guidance that develops resilience and sustainable habits for long-term success.",
                  icon: "🧠",
                  delay: 0.6,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-8 rounded-2xl border border-indigo-100 backdrop-blur-sm hover:border-indigo-300 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  whileHover={{ y: -10 }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 group-hover:from-indigo-400 group-hover:to-indigo-600 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Transformation Expert Section */}
        <section id="transformation" className="py-20 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
                THE TRANSFORMATION EXPERT
              </span>
            </h2>

            <div className="flex flex-col md:flex-row gap-12 items-center">
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-xl mb-6 text-gray-700">
                  Once trapped in a cycle of smoking, drinking, and poor
                  nutrition, Ajay faced tuberculosis and debilitating back pain.
                  In 2015, everything changed. Through disciplined nutrition and
                  training, he transformed his health, shedding 25kg and forging
                  a new path.
                </p>
                <p className="text-xl mb-6 text-gray-700">
                  Now a certified fitness coach, Ajay has guided over 700
                  individuals of all ages and genders through their own
                  transformations, applying the same principles that
                  revolutionized his life.
                </p>
                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
                  The Iron Edit isn't just a fitness program. It's a complete
                  reforging of body and mind for everyone.
                </p>
              </motion.div>

              <motion.div
                className="w-full md:w-1/2 glass-card p-4 rounded-2xl border border-indigo-100 backdrop-blur-sm overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                  <Image
                    src="/mama.png"
                    alt="Ajay's Transformation"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Blog Preview Section */}
        <BlogPreview />

        {/* About Me Section */}
        <section id="about" className="py-20 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            {/* Image column */}
            <motion.div
              className="w-full md:w-1/2 glass-card p-4 rounded-2xl border border-indigo-100 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative aspect-square max-w-[700px] mx-auto rounded-xl overflow-hidden">
                <Image
                  src="/mama-about.jpeg"
                  alt="Ajay Pal Singh"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </motion.div>

            {/* Content column */}
            <motion.div
              className="w-full md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
                I'M AJAY.
              </h2>

              <div className="space-y-6 text-gray-700 text-lg">
                <p>
                  I am Ajay Pal Singh—with over 32 years of dynamic experience
                  in the steel industry, a certified Nutrition and Fitness
                  Coach, and someone who believes age is just another set to
                  lift through. You could say I'm well-versed in heavy
                  lifting—whether it's steel or a pair of dumbbells!
                </p>

                <p>
                  In my professional life, I've managed mega projects, turned
                  around operations, and led teams from boardrooms to factory
                  floors. I've trained hundreds on business, cultural
                  transformation, and building strong, resilient teams. And yes,
                  I've done this while also transforming myself from an
                  "unhealthy workaholic" to a marathon-running, gym-loving
                  coach. I've learned that sometimes the toughest projects are
                  the ones we take on for ourselves.
                </p>

                <p>
                  This space is where I combine my corporate wisdom, fitness
                  passion, and a lifetime of lessons learned (usually the hard
                  way!). Whether you're here to chat about health, get some
                  fitness coaching, or explore ways to make your team stronger,
                  I'm here to help. So, stick around—it might be the start of
                  something powerful!
                </p>
              </div>

              <motion.div
                className="pt-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="#contact"
                  className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-medium py-4 px-8 rounded-full uppercase tracking-wide text-center transition-all duration-300 flex items-center"
                >
                  WANNA HEAR MORE? <ArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 mb-16">
          <motion.div
            className="glass-card p-12 rounded-3xl border border-indigo-100 backdrop-blur-sm text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Dumbbell className="w-16 h-16 mx-auto mb-6 text-indigo-500" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 break-words leading-tight">
                READY FOR YOUR TRANSFORMATION?
              </h2>
              <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
                Whether you're starting from scratch or looking to enhance your
                current fitness journey, The Alloy Method can help you become
                the strongest version of yourself.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white py-4 px-8 rounded-full font-bold text-center block"
                  >
                    START YOUR JOURNEY
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href="https://www.instagram.com/ajayraksh/?hl=en"
                    className="bg-gray-600/10 hover:bg-gray-600/20 backdrop-blur-sm text-gray-700 py-4 px-8 rounded-full font-bold text-center block border border-gray-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FOLLOW OUR COMMUNITY
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-indigo-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Icons Left */}
            <div className="flex justify-left md:justify-left gap-6 mb-8 md:mb-0">
              <SocialIcon
                url="https://www.instagram.com/ajayraksh/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: 40, width: 40 }}
                label="Instagram"
              />
              <SocialIcon
                url="https://www.linkedin.com/in/ajay-pal-singh-6613087/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: 40, width: 40 }}
                label="LinkedIn"
              />
              <SocialIcon
                network="email"
                url="/contact"
                style={{ height: 40, width: 40 }}
                label="Contact"
              />
            </div>
            <div className="w-full text-center">
              <p className="text-gray-600">
                © 2025 The Iron Edit by Ajay Pal Singh. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Voice Agent */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 50,
        }}
      >
        <SessionControl
          agentId="86428eac-3eeb-4d06-8115-15703b785266"
          widgetConfiguration={widgetSettings}
        />
      </div>
    </div>
  );
}
