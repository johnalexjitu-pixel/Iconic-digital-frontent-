"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, LogIn, UserPlus, Bell, HelpCircle, Phone, Plus, User, Menu, Crown, Headphones, LogOut } from "lucide-react";
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
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

  // Always show homepage for everyone
  return (
    <div className="min-h-screen bg-white">
        <HomepageHeader user={user} />

        {/* Hero Video Section */}
        <div className="relative bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Video 1 */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16]">
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src="/homepage/herovideo.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-4 left-4">
                  <span className="text-white font-bold text-lg font-lexend">GBNI</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white text-sm font-lexend">doing everything</span>
                </div>
              </div>

              {/* Video 2 */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16]">
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src="/homepage/herovideo.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-4 left-4">
                  <span className="text-white font-bold text-lg font-lexend">TYLE</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white text-sm font-lexend">Train, workout, same, same</span>
                </div>
              </div>

              {/* Video 3 */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16]">
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src="/homepage/herovideo.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-4 left-4">
                  <span className="text-white font-bold text-lg font-lexend">MEDAL</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white text-sm font-lexend">to get that medal and it just becomes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brands Section */}
        <div className="py-16 px-6 bg-white overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-lexend mb-8">Brands that trust us.</h2>
            <div className="relative">
              <div className="flex animate-scroll gap-12 items-center">
                <Image src="/homepage/UNIQLO_logo-C0xzmNex.png" alt="UNIQLO" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/arla-logo-black-and-white-CByUCCSa.png" alt="Arla" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/corston_logo_black-b-5-RcG5.png" alt="Corston" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Easyjet-Holidays-Ciyzil3W.png" alt="EasyJet Holidays" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Lumene-Logo-Bo_hRYRn.png" alt="Lumene" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Passenger-Logo-Rectangle-Outline-Box-V2-Black-CAfMuM_n.png" alt="Passenger" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Premier-Inn-D26Ark0T.png" alt="Premier Inn" width={120} height={60} className="opacity-60 flex-shrink-0" />
                {/* Duplicate for seamless loop */}
                <Image src="/homepage/UNIQLO_logo-C0xzmNex.png" alt="UNIQLO" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/arla-logo-black-and-white-CByUCCSa.png" alt="Arla" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/corston_logo_black-b-5-RcG5.png" alt="Corston" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Easyjet-Holidays-Ciyzil3W.png" alt="EasyJet Holidays" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Lumene-Logo-Bo_hRYRn.png" alt="Lumene" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Passenger-Logo-Rectangle-Outline-Box-V2-Black-CAfMuM_n.png" alt="Passenger" width={120} height={60} className="opacity-60 flex-shrink-0" />
                <Image src="/homepage/Premier-Inn-D26Ark0T.png" alt="Premier Inn" width={120} height={60} className="opacity-60 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* We are Socialtrend Section */}
        <div className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 font-lexend mb-16 text-center">We are Iconic Digital. Award-winning creative & performance marketing agency.</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Image
                  src="/homepage/group_of_people-CZccBVdx.webp"
                  alt="Phone in hands"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 font-lexend mb-6">We blend creative and performance</h3>
                <div className="space-y-4 text-gray-600 font-lexend leading-relaxed">
                  <p>There aren't many creative agencies that understand performance and performance agencies that understand creative.</p>
                  <p>This is where we're different.</p>
                  <p>Whether we're helping to grow your Social communities, deliver performance-driven Paid Media, produce social-first Creative or Influencer campaigns - we craft strategies based on your brand, business and goals all backed by data and insight.</p>
                </div>
                <Button className="bg-black text-white px-8 py-3 font-lexend mt-8">
                  See Our Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Driven Agency Section */}
        <div className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-6">A results driven agency</h2>
                <div className="space-y-4 text-gray-600 font-lexend leading-relaxed mb-8">
                  <p>We know awards aren't the be all and end all.</p>
                  <p>But we're proud of what we've achieved and the quality of work our team produces for our clients.</p>
                  <p>We've won awards across all of our departments, with some key highlights including:</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-lexend">First Large Social Agency (2023, 2024)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-lexend">First Direct Response Campaign</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-lexend">First Integrated Paid Media Campaign</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-lexend">First Use of Facebook & Instagram Ads</span>
                  </div>
                </div>
                <Button className="bg-black text-white px-8 py-3 font-lexend mt-8">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div>
                <Image
                  src="/homepage/blog_mecca-1-DP2_-W20.webp"
                  alt="Phone with social media"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-20 px-6 bg-red-600">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-white font-lexend">Our full-service offering...</h2>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 font-lexend">
                View all services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Influencer Card */}
              <Card className="bg-black border-gray-700 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📢</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-lexend mb-4">Influencer</h3>
                  <p className="text-white font-lexend mb-6 text-sm">We deliver brand awareness and direct-response Influencer & Creator campaigns.</p>
                  <ul className="text-white font-lexend space-y-2 mb-6 text-sm">
                    <li>• End-to-end Campaign Management</li>
                    <li>• Brand Awareness and Direct Response Objectives</li>
                    <li>• Content Creators for UGC Content</li>
                    <li>• Reports & Analysis</li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-lexend">
                    Initiate Campaign
                  </Button>
                </div>
              </Card>

              {/* Social Card */}
              <Card className="bg-black border-gray-700 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-lexend mb-4">Social</h3>
                  <p className="text-white font-lexend mb-6 text-sm">We grow cult-like social communities with platform-specific social strategies.</p>
                  <ul className="text-white font-lexend space-y-2 mb-6 text-sm">
                    <li>• Social Strategy</li>
                    <li>• Channel and Community Management</li>
                    <li>• Social-first Content Creation</li>
                    <li>• Social Listening & Insights</li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-lexend">
                    Initiate Campaign
                  </Button>
                </div>
              </Card>

              {/* Paid Card */}
              <Card className="bg-black border-gray-700 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-lexend mb-4">Paid</h3>
                  <p className="text-white font-lexend mb-6 text-sm">We deliver performance-driven Paid Social and Paid Search campaigns.</p>
                  <ul className="text-white font-lexend space-y-2 mb-6 text-sm">
                    <li>• Paid Social & Paid Search</li>
                    <li>• Full-Funnel Media Strategy</li>
                    <li>• Planning, Buying, Creative, Analytics, Testing and more</li>
                    <li>• Feed Optimisation & Shopping</li>
                  </ul>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-lexend">
                    Initiate Campaign
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="py-20 px-6 bg-yellow-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">📄</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-lexend">Certificate of Incorporation</h2>
            </div>
            <p className="text-gray-600 font-lexend mb-8 max-w-3xl mx-auto leading-relaxed">
              View our official Certificate of Incorporation issued by Companies House. This document verifies our status as a registered private limited company in accordance with the Companies Act 2006.
            </p>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-lexend">
              View Document
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Make a Difference Section */}
        <div className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/homepage/group_of_people-CZccBVdx.webp')"}}>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-blue-600 p-12 rounded-lg">
              <h2 className="text-3xl font-bold text-white font-lexend mb-6">We are here to make a difference</h2>
              <Button className="bg-white text-blue-600 px-8 py-3 font-lexend">
                Launch Campaign
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div>
              <Image
                src="/homepage/blog_mecca-1-DP2_-W20.webp"
                alt="Phone with social media"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <span className="text-xl font-bold font-lexend">ICONIC DIGITAL</span>
                </div>
                <p className="text-gray-400 font-lexend text-sm">©2024 Iconic Digital. All rights reserved.</p>
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
              <div>
                <h3 className="text-lg font-semibold font-lexend mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">f</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">i</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">in</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">t</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <HomepageFooter activePage="home" />
      </div>
    );

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
    <AppLayout user={user || undefined}>
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
