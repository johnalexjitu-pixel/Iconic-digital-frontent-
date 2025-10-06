"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Award, Trophy, Star, Target, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const awards = [
    {
      title: "First Large Social Agency (2023, 2024)",
      description: "Recognized as the leading social media agency for two consecutive years",
      icon: <Trophy className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "First Direct Response Campaign",
      description: "Award-winning campaign that delivered exceptional conversion rates",
      icon: <Target className="w-8 h-8 text-blue-500" />
    },
    {
      title: "First Integrated Paid Media Campaign",
      description: "Innovative approach combining multiple media channels for maximum impact",
      icon: <TrendingUp className="w-8 h-8 text-green-500" />
    },
    {
      title: "First Use of Facebook & Instagram Ads",
      description: "Pioneering work in social media advertising that set industry standards",
      icon: <Star className="w-8 h-8 text-purple-500" />
    }
  ];

  const stats = [
    { number: "13+", label: "Years Experience" },
    { number: "56+", label: "Industry Awards" },
    { number: "200+", label: "Successful Campaigns" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 font-lexend mb-6">
            A Results Driven Agency
          </h1>
          <p className="text-xl text-gray-600 font-lexend max-w-3xl mx-auto">
            We know awards aren't the be all and end all. But we're proud of what we've achieved 
            and the quality of work our team produces for our clients.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-red-50 border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2 font-lexend">{stat.number}</div>
              <div className="text-gray-600 font-lexend">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Awards Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-lexend text-center mb-12">
            Our Award-Winning Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {award.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-lexend mb-3">
                      {award.title}
                    </h3>
                    <p className="text-gray-600 font-lexend leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-lexend text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 font-lexend mb-6">
                We blend creative and performance
              </h3>
              <div className="space-y-4 text-gray-600 font-lexend leading-relaxed">
                <p>
                  There aren't many creative agencies that understand performance and performance 
                  agencies that understand creative. This is where we're different.
                </p>
                <p>
                  Whether we're helping to grow your Social communities, deliver performance-driven 
                  Paid Media, produce social-first Creative or Influencer campaigns - we craft 
                  strategies based on your brand, business and goals all backed by data and insight.
                </p>
              </div>
            </div>
            <div>
              <Image
                src="/homepage/group_of_people-CZccBVdx.webp"
                alt="Our Team"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold font-lexend mb-4">Ready to Work With Us?</h2>
          <p className="text-xl font-lexend mb-8">Let's discuss how we can help your business achieve amazing growth</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/campaign')}
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3"
            >
              Start Your Campaign
            </Button>
            <Button 
              onClick={() => router.push('/services')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3"
            >
              View Our Services
            </Button>
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
                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
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

      <HomepageFooter activePage="about" />
    </div>
  );
}

