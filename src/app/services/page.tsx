"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/AppLayout";
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
  Zap
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
      title: "Social Media Marketing",
      description: "Boost your brand's social media presence with our expert team",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      features: ["Content Creation", "Post Scheduling", "Engagement Management", "Analytics"],
      price: "Rs 5,000/month",
      duration: "1-3 months",
      level: "All Levels"
    },
    {
      id: 2,
      title: "Campaign Management",
      description: "Professional campaign management for maximum ROI",
      icon: <Target className="w-8 h-8 text-green-600" />,
      features: ["Strategy Planning", "Execution", "Monitoring", "Optimization"],
      price: "Rs 8,000/month",
      duration: "2-6 months",
      level: "Silver+"
    },
    {
      id: 3,
      title: "Analytics & Reporting",
      description: "Comprehensive analytics and detailed reporting",
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      features: ["Performance Tracking", "Custom Reports", "Insights", "Recommendations"],
      price: "Rs 3,000/month",
      duration: "Ongoing",
      level: "All Levels"
    },
    {
      id: 4,
      title: "Premium Support",
      description: "24/7 premium support for all your needs",
      icon: <Shield className="w-8 h-8 text-red-600" />,
      features: ["24/7 Support", "Priority Response", "Dedicated Manager", "Custom Solutions"],
      price: "Rs 10,000/month",
      duration: "Ongoing",
      level: "Gold+"
    }
  ];

  const handleSelectService = (serviceId: number) => {
    // In a real app, this would redirect to service booking or show a modal
    console.log('Selected service:', serviceId);
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
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Our Services</h1>
          <p className="text-gray-600">Choose from our range of professional marketing services</p>
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
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Select Service
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <Card className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Iconic Digital?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert Team</h4>
                <p className="text-sm text-gray-600 text-center">
                  Our experienced professionals deliver exceptional results
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-sm text-gray-600 text-center">
                  Track record of successful campaigns and satisfied clients
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600 text-center">
                  Quick turnaround times without compromising quality
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}