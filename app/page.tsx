'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, BarChart3, Zap, ArrowRight, Play, ChevronDown, ChevronUp } from 'lucide-react';

export default function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex-1 pt-8 md:pt-12">
        <section className="bg-gradient-to-br from-background to-primary-50">
          <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <Zap size={16} />
                New: AI-powered content suggestions
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Plan smarter. 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600"> Publish faster.</span>
                <br />Grow together.
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl">
                Marketinc gives you a powerful place to plan campaigns, design assets, and publish — with built-in analytics to track your success.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/campaign-calendar"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-all transform hover:scale-105"
                >
                  Start free trial
                  <ArrowRight size={16} />
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                  <Play size={16} />
                  Watch demo
                </button>
              </div>
            </div>

            <div className="order-first md:order-last">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="text-sm text-slate-500 mb-3 flex items-center justify-between">
                  <span>Live demo • Campaign Calendar</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="h-72 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border overflow-hidden">
                  {/* Enhanced demo preview */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">Spring Launch Campaign</h3>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-center text-slate-500 font-medium p-1">{day}</div>
                      ))}
                      
                      {[...Array(35)].map((_, i) => (
                        <div key={i} className="aspect-square border rounded flex items-center justify-center text-xs">
                          {i === 10 && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          {i === 15 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                          {i === 18 && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                          {i === 22 && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                          {i > 0 && i < 32 ? i : ''}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Today's posts</span>
                        <span className="font-medium">3 scheduled</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          <span className="text-xs">Instagram story - Product reveal</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs">LinkedIn post - Behind the scenes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}  
        <section id="features" className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 rounded-2xl mx-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900">Everything you need to run social campaigns</h3>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Plan, create, review and publish content across multiple platforms — with analytics to prove the impact.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="font-semibold text-slate-900">Calendar & Scheduling</div>
              <div className="mt-2 text-sm text-slate-600">Visual planning with drag & drop, bulk scheduling, and automated posting workflows.</div>
              <div className="mt-3 text-xs text-blue-600 font-medium">+ Auto-posting</div>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-emerald-600" size={24} />
              </div>
              <div className="font-semibold text-slate-900">Asset Management</div>
              <div className="mt-2 text-sm text-slate-600">Store, tag, and reuse creative across campaigns with AI-powered content suggestions.</div>
              <div className="mt-3 text-xs text-emerald-600 font-medium">+ Smart tagging</div>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-orange-600" size={24} />
              </div>
              <div className="font-semibold text-slate-900">Analytics</div>
              <div className="mt-2 text-sm text-slate-600">Performance reports and audience insights to optimize results and maximize ROI.</div>
              <div className="mt-3 text-xs text-orange-600 font-medium">+ Predictive insights</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900">How it works</h3>
            <p className="mt-4 text-lg text-slate-600">Get started in minutes, not hours</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Plan Your Content</h4>
              <p className="text-slate-600">Use our calendar to plan posts across all platforms. Drag and drop to reschedule, bulk import from CSV.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Create & Schedule</h4>
              <p className="text-slate-600">Design beautiful content with our built-in editor. Schedule posts to go live automatically at optimal times.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Publish & Analyze</h4>
              <p className="text-slate-600">Content goes live automatically. Track performance with detailed analytics and optimize future campaigns.</p>
            </div>
          </div>
        </section>

        {/* Platform Integrations */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900">Publish everywhere your audience is</h3>
              <p className="mt-4 text-lg text-slate-600">Native integrations with all major social platforms</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              {[
                { name: 'Instagram', color: 'from-purple-500 to-pink-500' },
                { name: 'TikTok', color: 'from-black to-red-500' },
                { name: 'LinkedIn', color: 'from-blue-600 to-blue-700' },
                { name: 'Facebook', color: 'from-blue-500 to-blue-600' },
                { name: 'YouTube', color: 'from-red-500 to-red-600' },
              ].map((platform) => (
                <div key={platform.name} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {platform.name[0]}
                  </div>
                  <div className="font-medium text-slate-700">{platform.name}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-slate-600">Plus integrations with Slack, Zapier, Google Drive, and more</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900">Frequently asked questions</h3>
            <p className="mt-4 text-lg text-slate-600">Everything you need to know about Marketinc</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does the free trial work?",
                answer: "You get full access to all features with no time limit on our free starter plan. Upgrade anytime to access advanced features and remove limits."
              },
              {
                question: "Which social platforms are supported?",
                answer: "We support Instagram, Facebook, LinkedIn, TikTok, YouTube, and Twitter. More platforms are added regularly based on user feedback."
              },
              {
                question: "Can I schedule posts in advance?",
                answer: "Yes! Schedule posts days, weeks, or months in advance. Our system will automatically publish them at the scheduled time."
              },
              {
                question: "How secure is my data?",
                answer: "We use enterprise-grade security with end-to-end encryption and regular security audits. Your data is stored in secure, redundant data centers."
              },
              {
                question: "Can I import my existing content?",
                answer: "Yes! We support importing from CSV files, and we have migration tools for popular platforms like Hootsuite, Buffer, and Sprout Social."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-700 text-white p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your social media strategy?
            </h3>
            <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
              Start planning, creating, and publishing better content today. Get started for free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/campaign-calendar" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors"
              >
                Get started free
                <ArrowRight size={20} />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 rounded-lg text-white font-semibold text-lg hover:bg-white/10 transition-colors">
                <Play size={16} />
                Watch demo
              </button>
            </div>

            <p className="text-sm text-slate-300 mt-6">
              No credit card required • Start planning immediately
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-700 text-primary-50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Inline SVG logo (accessible) */}
              <svg
                className="w-8 h-8"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="marketincLogoTitle"
              >
                <title id="marketincLogoTitle">Marketinc</title>
                <defs>
                  <linearGradient id="mcGrad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#2563EB" />
                    <stop offset="1" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <rect width="48" height="48" rx="8" fill="url(#mcGrad)" />
                {/* simple mark suggesting an "M" / check shape */}
                <path d="M12 30 L20 18 L24 24 L28 18 L36 30" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="font-semibold">Marketinc</div>
                <div className="text-sm text-primary-100/90">Plan. Create. Publish.</div>
              </div>
            </div>
            <p className="text-sm text-primary-100/80">Built for small teams that want enterprise capabilities with simplicity.</p>
          </div>

          <div>
            <div className="font-semibold mb-3">Product</div>
            <ul className="text-sm space-y-2 text-primary-100/80">
              <li><Link href="/campaign-calendar" className="hover:text-white">Campaign Calendar</Link></li>
              <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">Company</div>
            <ul className="text-sm space-y-2 text-primary-100/80">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-600 py-4 text-center text-sm text-primary-100/70">
          &copy; {new Date().getFullYear()} Marketinc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
