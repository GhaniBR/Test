import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Play,
  Users,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Star,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Navbar from "./Navbar";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Test Generation",
      description:
        "Automatically generate comprehensive test suites using advanced AI algorithms that understand your application flow.",
      icon: <Zap className="w-8 h-8" />,
    },
    {
      title: "Visual Test Validation",
      description:
        "Detect visual regressions and UI changes with pixel-perfect accuracy across all devices and browsers.",
      icon: <CheckCircle className="w-8 h-8" />,
    },
    {
      title: "Real-time Analytics",
      description:
        "Get instant insights into test performance, coverage metrics, and failure patterns with detailed reporting.",
      icon: <BarChart3 className="w-8 h-8" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "QA Lead at TechCorp",
      content:
        "This platform reduced our testing time by 70% while improving coverage. The AI insights are game-changing.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "DevOps Engineer",
      content:
        "Seamless integration with our CI/CD pipeline. The automated test generation is incredibly accurate.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      content:
        "Finally, a testing solution that scales with our rapid development cycles. Highly recommend!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1c25]">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#312e2e] animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm text-purple-200 mb-8">
              <Zap className="w-4 h-4 mr-2" />
              New: AI-powered visual regression testing
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Test Smarter,
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ship Faster
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-driven testing platform that automatically
              generates, executes, and maintains your test suites. Reduce manual
              testing by 90% while improving coverage and reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl">
                Start Free Trial
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </button>
              <button className="flex items-center text-white border border-white/30 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  90%
                </div>
                <div className="text-white/80">Faster Testing</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">
                  10K+
                </div>
                <div className="text-white/80">Tests Generated Daily</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  99.9%
                </div>
                <div className="text-white/80">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#f3bd68] mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-white/80">
              Everything you need for comprehensive test automation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border transition-all cursor-pointer ${
                    activeFeature === index
                      ? "bg-white/10 border-purple-400 shadow-lg"
                      : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        activeFeature === index
                          ? "bg-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/80">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
                <div className="bg-slate-800 rounded-lg p-6 font-mono text-sm">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="ml-4 text-white/60">
                      test-automation.js
                    </span>
                  </div>
                  <div className="text-green-400">
                    <div>✓ Login flow test - PASSED</div>
                    <div>✓ Cart functionality - PASSED</div>
                    <div>✓ Payment process - PASSED</div>
                    <div>✓ Visual regression - PASSED</div>
                    <div className="text-purple-400 mt-2">
                      → Generated 47 additional test cases
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Seamless Integration
            </h2>
            <p className="text-xl text-white/80">
              Works with your existing development workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {["GitHub", "GitLab", "Jenkins", "Docker", "Kubernetes", "AWS"].map(
              (tool, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mx-auto mb-3 flex items-center justify-center text-white font-bold">
                    {tool[0]}
                  </div>
                  <div className="text-white/80 text-sm">{tool}</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Testing?
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Join thousands of teams who've revolutionized their QA process with
            AI-powered testing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl">
              Start Your Free Trial
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              Schedule a Demo →
            </button>
          </div>

          <div className="mt-12 text-white/60 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}
