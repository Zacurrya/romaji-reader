"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans text-gray-900">


      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 pt-32 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-50/80 to-purple-50/50 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="relative z-10 max-w-5xl space-y-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-gray-900 leading-[1.1]">
              Type Romaji. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300 italic">Learn Japanese.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              The intuitive bridge between sounds and meaning. <br />
              Translate sentences and master JLPT N5 grammar with ease.
            </p>
          </motion.div>

          {/* Visual Showcase (Mockup) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-white/50 p-8 flex flex-col items-center gap-6"
          >
            <div className="flex gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex gap-2 opacity-50">
                <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-mono text-gray-500">ni</span>
                <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-mono text-gray-500">ho</span>
                <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-mono text-gray-500">n</span>
              </div>
              <div className="text-5xl font-serif font-bold text-gray-900">日本</div>
              <div className="h-px w-12 bg-gray-200 my-2"></div>
              <div className="text-sm text-gray-400 font-medium tracking-widest uppercase">Japan</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/translator" className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-full hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-4 ring-gray-100">
              Start Translating
            </Link>
            <Link href="/n5-quiz" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
              Test Skills (N5)
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid / Social Proof (Simplified) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-12 w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left opacity-70"
        >
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900">Context-Aware Analysis</h3>
            <p className="text-sm text-gray-500">Our engine understands sentence context to provide the most accurate Kanji conversions.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900">Interactive Learning</h3>
            <p className="text-sm text-gray-500">Don't just translate. Learn the particles, grammar, and nuance as you type.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900">JLPT Focused</h3>
            <p className="text-sm text-gray-500">Curated quizzes and sentence patterns aligned with JLPT N5 standards.</p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
