"use client";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Users,
  DollarSign,
  Palette,
  Star,
  Camera,
  Megaphone,
  ArrowRight
} from "lucide-react";

export default function ServicesPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    avatar: "/placeholder-avatar.jpg"
  };

  const services = [
    {
      icon: Megaphone,
      title: "Social",
      description: "We grow cult-like social communities with platform-specific social strategies",
      features: [
        "Social Strategy",
        "Channel and Community Management",
        "Social-first Content Creation",
        "Social Listening & Insights"
      ],
      color: "bg-blue-500",
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      icon: DollarSign,
      title: "Paid",
      description: "We deliver performance-driven Paid Social and Paid Search campaigns",
      features: [
        "Paid Social & Paid Search",
        "Full-Funnel Media Strategy",
        "Planning, Buying, Creative, Analytics, Testing and more",
        "Feed Optimisation & Shopping"
      ],
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: Palette,
      title: "Creative",
      description: "Delivering outstanding Creative across Video, Design and Motion",
      features: [
        "Organic & Paid Social Video",
        "UGC to High-Production",
        "Creative Strategy, Art Direction & Campaigns",
        "Motion Design, Animation and Graphics"
      ],
      color: "bg-green-500",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      icon: Users,
      title: "Influencer",
      description: "We deliver brand awareness and direct-response Influencer & Creator campaigns",
      features: [
        "End-to-end Campaign Management",
        "Brand Awareness and Direct-Response Objectives",
        "Content Creators for UGC Content",
        "Wrap Reports and Analysis"
      ],
      color: "bg-purple-500",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      icon: Star,
      title: "Information",
      description: "Rules and Regulation for our campaign workers",
      features: [
        "Campaign Background & Rationale",
        "Expected Outcomes",
        "Challenges or Risks",
        "Legal or Ethical Considerations"
      ],
      color: "bg-gray-500",
      bgColor: "bg-gray-50 border-gray-200",
      isInfo: true
    }
  ];

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="bg-teal-500 text-white p-4 rounded-2xl">
              <Megaphone className="w-8 h-8" />
            </div>
            <div className="bg-black text-white p-4 rounded-2xl">
              <Video className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">How we help</h1>
          <p className="text-gray-600 text-sm">
            We specialise in Social, Paid, Creative, Influencer and Strategy and work with fast-growth brands and
            successful users around the globe.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Card key={index} className={`p-6 ${service.bgColor} border-2`}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${service.color} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      className={`w-full ${service.isInfo ? 'bg-gray-800 hover:bg-gray-900' : 'bg-yellow-400 hover:bg-yellow-500 text-black'} rounded-xl`}
                    >
                      {service.isInfo ? 'Read More' : 'Initiate Campaign'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Social Media Links */}
        <div className="pt-6">
          <p className="text-center text-sm text-gray-600 mb-4">Working Across</p>
          <div className="flex justify-center gap-4">
            {['Instagram', 'Facebook', 'Twitter', 'Pinterest', 'TikTok', 'LinkedIn'].map((platform) => (
              <div key={platform} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-600">{platform[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
