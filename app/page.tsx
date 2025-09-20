'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 py-24 bg-background">
        <h1 className="text-5xl font-bold mb-6">Welcome to Anuecthing</h1>
        <p className="text-lg mb-10 max-w-xl text-center">
          Organize your campaigns and events with ease. Anuecthing helps you manage schedules, track progress, and collaborate effortlessly.
        </p>
        <Link
          href="/campaign-calendar"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition font-semibold"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-0 w-full">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" />
                <h4 className="text-xl font-bold">AnueCthing</h4>
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
            <p>&copy; 2024 AnueCthing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
