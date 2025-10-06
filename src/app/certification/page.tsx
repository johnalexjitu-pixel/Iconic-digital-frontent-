"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Shield, CheckCircle } from "lucide-react";

export default function CertificationPage() {
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

  const certifications = [
    {
      title: "Certificate of Incorporation",
      description: "Official document verifying our status as a registered private limited company",
      type: "Legal Document",
      icon: <FileText className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Companies House Registration",
      description: "Registered in accordance with the Companies Act 2006",
      type: "Government Registration",
      icon: <Shield className="w-8 h-8 text-green-500" />
    },
    {
      title: "Industry Certifications",
      description: "Professional certifications in digital marketing and advertising",
      type: "Professional",
      icon: <CheckCircle className="w-8 h-8 text-purple-500" />
    }
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
            Our Certifications & Legal Documents
          </h1>
          <p className="text-xl text-gray-600 font-lexend max-w-3xl mx-auto">
            View our official certificates and legal documents that verify our status as a 
            registered and certified digital marketing agency.
          </p>
        </div>

        {/* Certificate Download Section */}
        <div className="mb-16">
          <Card className="p-8 bg-yellow-50 border-yellow-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📄</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-lexend">Certificate of Incorporation</h2>
              </div>
              <p className="text-gray-600 font-lexend mb-8 max-w-3xl mx-auto leading-relaxed">
                View our official Certificate of Incorporation issued by Companies House. This document 
                verifies our status as a registered private limited company in accordance with the 
                Companies Act 2006.
              </p>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-lexend"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/iconic-digital-certificate-of-incorporation.pdf';
                  link.download = 'Iconic-Digital-Certificate-of-Incorporation.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Certificate
              </Button>
            </div>
          </Card>
        </div>

        {/* Certifications Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-lexend text-center mb-12">
            Our Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {cert.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-lexend mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-gray-600 font-lexend mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                  <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-lexend">
                    {cert.type}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust & Compliance Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-lexend mb-6">
                Trust & Compliance
              </h2>
              <div className="space-y-4 text-gray-600 font-lexend leading-relaxed">
                <p>
                  As a registered company, we maintain the highest standards of compliance and 
                  transparency in all our business operations.
                </p>
                <p>
                  Our legal status and certifications ensure that our clients can trust us with 
                  their digital marketing needs, knowing we operate within the framework of 
                  established business regulations.
                </p>
                <div className="space-y-2 mt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-lexend">Fully Registered Company</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-lexend">Companies House Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-lexend">Professional Standards</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/homepage/blog_mecca-1-DP2_-W20.webp"
                alt="Trust & Compliance"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold font-lexend mb-4">Ready to Work With a Trusted Partner?</h2>
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
                <li><Link href="/certification" className="text-gray-300 hover:text-white">Certification</Link></li>
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

      <HomepageFooter activePage="certification" />
    </div>
  );
}

