"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, LogIn, UserPlus, Bell, HelpCircle, Phone, Plus } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-lexend">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <span className="text-xl font-bold text-gray-900 font-lexend">SOCIALTREND.</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-lexend">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Member Level</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Help</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Customer Service</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Video Section */}
        <div className="relative h-[70vh] bg-black">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src="/homepage/herovideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-bold font-lexend mb-4">We are Socialtrend.</h1>
            <p className="text-xl font-lexend mb-6">Award-winning creative & performance marketing agency.</p>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-lexend">
              Launch Campaign
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Brands Section */}
        <div className="py-16 px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-lexend mb-8">Brands that trust us.</h2>
            <div className="flex items-center justify-center gap-12 opacity-60">
              <span className="text-lg font-semibold font-lexend">APASSENGER</span>
              <span className="text-lg font-semibold font-lexend">Premier Inn</span>
              <span className="text-lg font-semibold font-lexend">UNI QLO</span>
              <span className="text-lg font-semibold font-lexend">ACAI</span>
            </div>
          </div>
        </div>

        {/* We are Socialtrend Section */}
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/homepage/phone-hands.jpg"
                alt="Phone in hands"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-6">We are Socialtrend. Award-winning creative & performance marketing agency.</h2>
              <h3 className="text-xl font-semibold text-gray-900 font-lexend mb-4">We blend creative and performance</h3>
              <p className="text-gray-600 font-lexend mb-6 leading-relaxed">
                Our team of experts combines creative storytelling with data-driven performance marketing to deliver exceptional results for your brand. We understand the balance between artistic vision and measurable outcomes.
              </p>
              <Button className="bg-black text-white px-8 py-3 font-lexend">
                See Our Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Driven Agency Section */}
        <div className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-8">A results driven agency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-lexend">Best Direct Response Campaign</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-lexend">Highest ROI Achievement</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-lexend">Creative Excellence Award</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-lexend">Performance Marketing Leader</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-lexend">Client Satisfaction 100%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-lexend">Innovation in Digital Marketing</span>
                </div>
              </div>
            </div>
            <Button className="bg-black text-white px-8 py-3 font-lexend mt-8">
              Learn More
              <Plus className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white font-lexend mb-12 text-center">Our full-service offering...</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Creative Card */}
              <Card className="bg-gray-800 border-gray-700 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-lexend mb-4">Creative</h3>
                  <ul className="text-white font-lexend space-y-2 mb-6">
                    <li>• Brand Strategy</li>
                    <li>• Visual Design</li>
                    <li>• Content Creation</li>
                    <li>• Campaign Development</li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-lexend">
                    Initiate Campaign
                  </Button>
                </div>
              </Card>

              {/* Influencer Card */}
              <Card className="bg-gray-800 border-gray-700 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📢</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-lexend mb-4">Influencer</h3>
                  <ul className="text-white font-lexend space-y-2 mb-6">
                    <li>• Influencer Outreach</li>
                    <li>• Campaign Management</li>
                    <li>• Content Collaboration</li>
                    <li>• Performance Tracking</li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-lexend">
                    Initiate Campaign
                  </Button>
                </div>
              </Card>

              {/* Social Card */}
              <Card className="bg-gray-800 border-gray-700 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-lexend mb-4">Social</h3>
                  <ul className="text-white font-lexend space-y-2 mb-6">
                    <li>• Social Media Strategy</li>
                    <li>• Community Management</li>
                    <li>• Paid Social Ads</li>
                    <li>• Analytics & Reporting</li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-lexend">
                    Initiate Campaign
                  </Button>
                </div>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black font-lexend">
                View all services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="py-16 px-6 bg-yellow-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-6">Certificate of Incorporation</h2>
            <p className="text-gray-600 font-lexend mb-8 max-w-2xl mx-auto">
              This document verifies that Socialtrend is a registered private limited company, 
              operating under the laws and regulations of the jurisdiction.
            </p>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-lexend">
              View Document
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Make a Difference Section */}
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-blue-600 p-12 rounded-lg">
              <h2 className="text-3xl font-bold text-white font-lexend mb-6">We are here to make a difference</h2>
              <Button className="bg-white text-blue-600 px-8 py-3 font-lexend">
                Launch Campaign
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div>
              <Image
                src="/homepage/phone-social.jpg"
                alt="Phone with social media"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <span className="text-xl font-bold font-lexend">SOCIALTREND.</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-lexend mb-4">Our Services</h3>
                <ul className="space-y-2 font-lexend">
                  <li><Link href="/services" className="text-gray-300 hover:text-white">Social</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-white">Paid</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-white">Creative</Link></li>
                  <li><Link href="/services" className="text-gray-300 hover:text-white">Influencer</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-lexend mb-4">Company</h3>
                <ul className="space-y-2 font-lexend">
                  <li><Link href="/services" className="text-gray-300 hover:text-white">Services</Link></li>
                  <li><Link href="/campaign" className="text-gray-300 hover:text-white">Start Campaign</Link></li>
                  <li><Link href="/account" className="text-gray-300 hover:text-white">Account</Link></li>
                  <li><Link href="#" className="text-gray-300 hover:text-white">Certification</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-4 px-6">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="text-xs font-lexend">Home</span>
            </Link>
            <Link href="/services" className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏠</span>
              </div>
              <span className="text-xs font-lexend">Services</span>
            </Link>
            <Link href="/campaign" className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📅</span>
              </div>
              <span className="text-xs font-lexend">Campaign</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🕒</span>
              </div>
              <span className="text-xs font-lexend">History</span>
            </Link>
            <Link href="/account" className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👤</span>
              </div>
              <span className="text-xs font-lexend">Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Account Balance",
      value: "Rs 61,076",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    },
    {
      label: "Number of Campaigns",
      value: "8/30",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    },
    {
      label: "Today's Commission",
      value: "Rs 0",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    },
    {
      label: "Withdrawal Amount",
      value: "Rs 0",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    }
  ];

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Video Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 h-64">
          <div className="absolute inset-0 bg-black/20">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop"
              alt="Campaign preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Play className="w-6 h-6 text-white mr-2" />
              <span className="text-white">Play Video</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className={`p-4 ${stat.bgColor} border-2`}>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium font-lexend">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.textColor} font-lexend`}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Launch Campaign Button */}
        <div className="pt-4">
          <Button
            className="w-full h-14 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center gap-3 font-lexend"
          >
            <ArrowRight className="w-6 h-6" />
            Launch Campaign
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
