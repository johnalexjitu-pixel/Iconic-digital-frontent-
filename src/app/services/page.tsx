"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Target, 
  BarChart3, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Zap,
  ArrowLeft
} from "lucide-react";
import { apiClient } from '@/lib/api-client';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  const services = [
    {
      id: 1,
      title: "Social",
      description: "We grow cult-like social communities with platform-specific social strategies",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      features: ["Social Strategy", "Channel and Community Management", "Social-first Content Creation", "Social Listening & Insights"],
      price: "Performance-based",
      duration: "Flexible",
      level: "All Levels"
    },
    {
      id: 2,
      title: "Paid",
      description: "We deliver performance-driven Paid Social and Paid Search campaigns",
      icon: <Target className="w-8 h-8 text-green-600" />,
      features: ["Paid Social & Paid Search", "Full-Funnel Media Strategy", "Planning, Buying, Creative, Analytics, Testing and more", "Feed Optimisation & Shopping"],
      price: "Performance-based",
      duration: "Flexible",
      level: "Silver+"
    },
    {
      id: 3,
      title: "Creative",
      description: "Delivering outstanding Creative across Video, Design and Motion",
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      features: ["Organic & Paid Social Video", "UGC to High-Production", "Creative Strategy, Art Direction & Campaigns", "Motion Design, Animation and Graphics"],
      price: "Performance-based",
      duration: "Flexible",
      level: "All Levels"
    },
    {
      id: 4,
      title: "Influencer",
      description: "We deliver brand awareness and direct-response Influencer & Creator campaigns",
      icon: <Shield className="w-8 h-8 text-red-600" />,
      features: ["End-to-end Campaign Management", "Brand Awareness and Direct-Response Objectives", "Content Creators for UGC Content", "Wrap Reports and Analysis"],
      price: "Performance-based",
      duration: "Flexible",
      level: "Gold+"
    }
  ];

  const handleSelectService = (serviceId: number) => {
    if (!user) {
      router.push('/auth/login');
    } else {
      router.push('/campaign');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user} />
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Our Services</h1>
          <p className="text-gray-600">Join our team and work on exciting digital marketing campaigns</p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Service Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-teal-100 text-teal-800">
                    {service.level}
                  </Badge>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">{service.duration}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectService(service.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Initiate Campaign!
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Our Work – What's New? Section */}
        <div className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-lexend text-center mb-12">Our Work – What's New?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* The Hot Tub and Swim Spa Company */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/our-work/the-hot-tub-and-swim-spa-company-768x471.webp"
                    alt="The Hot Tub and Swim Spa Company"
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                  
                  {/* Text Overlay - Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold font-lexend mb-2">the hot tub and swim spa company</h3>
                      <Image
                        src="/our-work/logo-min-1-removebg-preview.webp"
                        alt="Hot Tub Icon"
                        width={80}
                        height={80}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* Hover Effect - Yellow Animation */}
                  <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 transition-all duration-300 delay-300 transform translate-y-full group-hover:translate-y-0"></div>
                  
                  {/* View More Option */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                    <Button 
                      onClick={() => router.push('/case-studies/hot-tub-company')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3"
                    >
                      View More
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/case-studies/hot-tub-company')}
                  className="w-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-lexend"
                >
                  Read more
                </Button>
              </div>

              {/* Shred-on-Site */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/our-work/Shred-on-Site-1-768x483.jpg"
                    alt="Shred-on-Site"
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                  
                  {/* Text Overlay - Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold font-lexend mb-2">Shred on Site</h3>
                      <Image
                        src="/our-work/shred-on-site-logo-final-0.webp"
                        alt="Shred on Site Icon"
                        width={80}
                        height={80}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* Hover Effect - Yellow Animation */}
                  <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 transition-all duration-300 delay-300 transform translate-y-full group-hover:translate-y-0"></div>
                  
                  {/* View More Option */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                    <Button 
                      onClick={() => router.push('/case-studies/shred-on-site')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3"
                    >
                      View More
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/case-studies/shred-on-site')}
                  className="w-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-lexend"
                >
                  Read more
                </Button>
              </div>

              {/* Mademoiselle Desserts */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/our-work/mademoiselle-desserts-768x471.webp"
                    alt="Mademoiselle Desserts"
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                  
                  {/* Text Overlay - Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold font-lexend mb-2">mademoiselle DESSERTS</h3>
                      <Image
                        src="/our-work/download-removebg-preview.webp"
                        alt="Mademoiselle Desserts Logo"
                        width={80}
                        height={80}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* Hover Effect - Yellow Animation */}
                  <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 transition-all duration-300 delay-300 transform translate-y-full group-hover:translate-y-0"></div>
                  
                  {/* View More Option */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                    <Button 
                      onClick={() => router.push('/case-studies/mademoiselle-desserts')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3"
                    >
                      View More
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/case-studies/mademoiselle-desserts')}
                  className="w-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-lexend"
                >
                  Read more
                </Button>
              </div>

              {/* IBM */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/our-work/Rectangle-39-768x770.png"
                    alt="IBM"
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                  
                  {/* Text Overlay - Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold font-lexend mb-2">IBM</h3>
                      <Image
                        src="/our-work/IBM_logo.png"
                        alt="IBM Logo"
                        width={80}
                        height={80}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* Hover Effect - Yellow Animation */}
                  <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 transition-all duration-300 delay-300 transform translate-y-full group-hover:translate-y-0"></div>
                  
                  {/* View More Option */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                    <Button 
                      onClick={() => router.push('/case-studies/ibm')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3"
                    >
                      View More
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/case-studies/ibm')}
                  className="w-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-lexend"
                >
                  Read more
                </Button>
              </div>
            </div>
          </div>
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