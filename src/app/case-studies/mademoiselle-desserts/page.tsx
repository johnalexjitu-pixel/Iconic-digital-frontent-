"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Star, Target, Award } from "lucide-react";

export default function MademoiselleDessertsCaseStudy() {
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
          <p className="text-gray-600">Loading case study...</p>
        </div>
      </div>
    );
  }

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
          Back to Services
        </Button>

        {/* Hero Section */}
        <div className="relative mb-12">
          <Image
            src="/our-work/mademoiselle-desserts-768x471.webp"
            alt="Mademoiselle Desserts"
            width={1200}
            height={600}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold font-lexend mb-4">Sweet success for Mademoiselle Desserts</h1>
              <p className="text-xl font-lexend">Creating irresistible digital experiences for luxury dessert brand</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center bg-red-50 border-red-200">
            <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-red-600 mb-2">0:1</h3>
            <p className="text-gray-600 font-lexend">Return on Investment</p>
          </Card>
          <Card className="p-6 text-center bg-blue-50 border-blue-200">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-blue-600 mb-2">0%</h3>
            <p className="text-gray-600 font-lexend">Increase in Reach</p>
          </Card>
          <Card className="p-6 text-center bg-green-50 border-green-200">
            <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-green-600 mb-2">0+</h3>
            <p className="text-gray-600 font-lexend">Social Media Followers</p>
          </Card>
          <Card className="p-6 text-center bg-purple-50 border-purple-200">
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-purple-600 mb-2">0+</h3>
            <p className="text-gray-600 font-lexend">Client Reviews</p>
          </Card>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-6">About Mademoiselle Desserts</h2>
            <p className="text-gray-600 font-lexend mb-6 leading-relaxed">
              Mademoiselle Desserts is a luxury dessert brand specializing in handcrafted, artisanal treats. 
              From elegant macarons to decadent cakes, they create beautiful and delicious desserts for special 
              occasions, corporate events, and retail customers. Their commitment to quality and presentation 
              has made them a favorite among dessert connoisseurs.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">The Challenge</h3>
                  <p className="text-gray-600 font-lexend">
                    To showcase the visual appeal and luxury positioning of Mademoiselle Desserts in the digital space. 
                    The brand needed to create an online presence that matched the elegance and sophistication of their 
                    products, while driving both online and offline sales through compelling visual storytelling.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/our-work/mademoiselle-desserts-768x471.webp"
              alt="Mademoiselle Desserts"
              width={600}
              height={400}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-6 text-center">The Solution</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 font-lexend mb-6 text-center">
              We developed a visually stunning digital marketing strategy that captured the essence of luxury and 
              craftsmanship. Our approach focused on high-quality visual content, influencer partnerships, and 
              social media engagement to showcase the brand's premium positioning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Visual Content</h3>
                <p className="text-gray-600 font-lexend text-sm">Professional photography and video content showcasing products</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
                <p className="text-gray-600 font-lexend text-sm">Instagram and Facebook strategies for visual storytelling</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Influencer Marketing</h3>
                <p className="text-gray-600 font-lexend text-sm">Partnerships with food bloggers and lifestyle influencers</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-xl text-gray-700 font-lexend italic mb-6">
              "Iconic Digital perfectly captured the essence of our brand. Their creative approach to visual 
              storytelling has helped us connect with customers who appreciate the artistry behind our desserts."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <Image
                src="/our-work/download-removebg-preview.webp"
                alt="Mademoiselle Desserts Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">Mademoiselle Desserts Team</p>
                <p className="text-gray-600">Creative Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold font-lexend mb-4">Ready to Get Similar Results?</h2>
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
                <Image 
                  src="/image-removebg-preview.png" 
                  alt="Iconic Digital Logo" 
                  width={120} 
                  height={40}
                  className="h-8 w-auto"
                />
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

      <HomepageFooter activePage="services" />
    </div>
  );
}

