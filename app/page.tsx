'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative bg-background text-foreground flex flex-col min-h-screen overflow-hidden">
      {/* Decorative scattered blurred background images */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/dg1.png"
          alt=""
          aria-hidden="true"
          className="absolute left-[-10%] top-16 w-80 md:w-96 opacity-25 blur-3xl transform rotate-12 scale-110"
        />
        <img
          src="/dg2.png"
          alt=""
          aria-hidden="true"
          className="absolute right-[-8%] top-32 w-72 md:w-[480px] opacity-30 blur-3xl transform -rotate-6 scale-105"
        />
        <img
          src="/dg3.png"
          alt=""
          aria-hidden="true"
          className="absolute left-1/3 bottom-[-4%] w-96 md:w-[600px] opacity-20 blur-3xl transform -translate-x-1/4 rotate-3"
        />

        {/* subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/10" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 py-24 bg-background z-10">
        {/* Background images specifically for hero section */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/dg1.png"
            alt=""
            aria-hidden="true"
            className="absolute left-[-10%] top-10 w-80 md:w-96 opacity-40 blur-2xl transform rotate-12 scale-110"
          />
          <img
            src="/dg2.png"
            alt=""
            aria-hidden="true"
            className="absolute right-[-8%] top-20 w-72 md:w-[480px] opacity-35 blur-2xl transform -rotate-6 scale-105"
          />
          <img
            src="/dg3.png"
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 bottom-10 w-96 md:w-[600px] opacity-30 blur-2xl transform -translate-x-1/2 rotate-3"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-6">Welcome to Marketinc</h1>
          <p className="text-lg mb-10 max-w-xl text-center">
            Organize your campaigns and events with ease. Marketinc helps you manage schedules, track progress, and collaborate effortlessly.
          </p>
          <Link
            href="/campaign-calendar"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition font-semibold"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-0 w-full relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-xl font-bold">Marketinc</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Social media marketing tools designed for small teams who need enterprise features without the enterprise price.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/campaign-calendar" className="hover:text-white transition-colors">Campaign Calendar</Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">Support</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Marketinc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
