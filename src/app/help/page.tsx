"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, ChevronUp, Send, Clock, MessageCircle } from "lucide-react";
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";

export default function HelpPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; level: string; avatar?: string } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const faqs = [
    {
      id: "agent-mode",
      question: "About Agent Mode",
      answer: "Platform users can invite others to become agents of the platform through the invitation code and also become your downline, as the upline you can extract 15% commission of your downline, the commission obtained will be directly reflected to upline's platform account. You can get 15% from first tier commission, 10% from second tier, and 5% from third tier. All agents/downlines on the platform have the same commissions and rewards, and developing a team does not affect the commissions and rewards of the agents/downlines."
    },
    {
      id: "withdrawal",
      question: "About Withdrawal",
      answer: `Before initiating a withdrawal request, please ensure that your bank details are correctly bound to the platform. Once completed, you may proceed by entering the desired withdrawal amount, clicking the 'Withdraw' button, and inputting your designated withdrawal password to confirm the transaction.

Please be advised that withdrawals are permitted only after every 3 sets of campaign tasks have been successfully completed.

For transactions exceeding BDT 100,000 in a single withdrawal, a 50% refundable security deposit is required. This measure is part of our first-time identity verification and anti-fraud protocol. The security deposit will be fully refunded within one hour upon successful verification.

Withdrawal Limits:
• Minimum withdrawal: BDT 100,000
• Maximum withdrawal: BDT 1,000,000 per transaction
• Large transactions (BDT 100,000+) require security deposit

Important Notes:

• The estimated arrival time for funds is typically 10 to 60 minutes after the withdrawal has been submitted.
• Once the withdrawal is initiated, the remaining account balance must not exceed BDT 100,000.
• Withdrawals are available Monday to Sunday from 10:00 AM to 10:00 PM.

We appreciate your attention to these details as they are in place to ensure a smooth and secure transaction experience.`
    },
    {
      id: "exclusive-campaign",
      question: "About Exclusive Campaign",
      answer: `Why have Exclusive Campaign? Merchants want to increase the exposure of their attractive products and also want to attract more agents to help increase the visibility of their products, which can help them to increase sales. Exclusive Campaign is a benefit that allows all members to earn more commission. Suppliers and merchants design it so that members and agents can earn higher commissions. This is rare to get and all members may only have the chance of getting 1 (Min) to 2 (Max) Exclusive Campaign in each round of campaign.`
    },
    {
      id: "campaign",
      question: "About Campaign",
      answer: `Campaigns that are not submitted after being received will remain in 'Pending' status. To complete a pending campaign, simply click the 'History' button. You can apply for withdrawal once the campaign is completed.

Note: If you are unable to complete all your campaigns within the given timeframe, please contact customer service to request a time extension. Failure to do so may result in a deduction of your credit score or account suspension by the system.`
    },
    {
      id: "lucky-golden-egg",
      question: "About Lucky Golden Egg",
      answer: `The Lucky Golden Egg is an extraordinary reward on the platform, bestowed upon members at random. These delightful prizes can include cash bonuses and campaign. If you find yourself in possession of a Lucky Golden Egg, it signifies that the Goddess of Fortune has graciously smiled upon you, inviting you to a world of unexpected treasures and joyous surprises!`
    },
    {
      id: "terms-conditions",
      question: "Terms and Conditions",
      answer: `Welcome to Iconic Digital. By using our services, you agree to the following terms:

1. All products in campaigns are subject to availability.
2. Cancellation or return policies vary by suppliers and merchants.
3. Payment information is secured using industry-standard encryption.
4. You must be at least 18 years old to participate in a campaign.
5. Prices are subject to change until the purchase is confirmed.
6. We respect your privacy and handle your data in accordance with our privacy policy.
7. By creating an account, you agree to receive occasional promotional emails from us.
8. You are responsible for providing accurate information during the campaign process.
9. Platform reserves the right to modify terms and conditions at any time.
10. Violation of terms may result in account suspension or termination.

Contact Information:
• Telegram: t.me/Iconicdigital_customerservice_BD
• Service Hours: 10:00 AM to 10:00 PM (Monday - Sunday)

For any questions or concerns regarding these terms, please contact our customer service team.`
    }
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user || undefined} />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-lexend">Help Center</h1>
        </div>

        {/* Introduction Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to the most common questions about Iconic Digital services. If you can't find what you're looking for, 
            please contact our customer support team.
          </p>
        </Card>

        {/* FAQ List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-6 mt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need More Help?</h3>
            <p className="text-gray-600 mb-4">
              Our customer service team is available to assist you.
            </p>
            <div className="mb-4">
              <p className="font-medium mb-2">Service Hours:</p>
              <p className="text-gray-600">Monday - Sunday: 10:00 AM to 10:00 PM</p>
            </div>
            <div className="mb-4">
              <p className="font-medium mb-2">Contact Information:</p>
              <div className="flex items-center justify-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Telegram: t.me/Iconicdigital_customerservice_BD</span>
              </div>
            </div>
            <Button
              onClick={() => window.open('https://t.me/Iconicdigital_customerservice_BD', '_blank')}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-all duration-300 hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
