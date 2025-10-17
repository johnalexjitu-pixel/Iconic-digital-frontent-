"use client";

import Link from 'next/link';
import Image from 'next/image';

interface HomepageFooterProps {
  activePage?: 'home' | 'services' | 'campaign' | 'history' | 'account' | 'about' | 'certification';
}

export function HomepageFooter({ activePage = 'home' }: HomepageFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white text-gray-900 py-2 px-4 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activePage === 'home' ? 'bg-red-500' : 'bg-gray-200'
          }`}>
            <Image 
              src="/bottomicon/icons8-home.gif" 
              alt="Home" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </div>
          <span className={`text-xs font-lexend font-medium ${
            activePage === 'home' ? 'text-red-500' : 'text-gray-600'
          }`}>Home</span>
        </Link>
        
        <Link href="/services" className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activePage === 'services' ? 'bg-red-500' : 'bg-gray-200'
          }`}>
            <Image 
              src="/bottomicon/icons8-services.gif" 
              alt="Services" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </div>
          <span className={`text-xs font-lexend font-medium ${
            activePage === 'services' ? 'text-red-500' : 'text-gray-600'
          }`}>Services</span>
        </Link>
        
        <Link href="/campaign" className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activePage === 'campaign' ? 'bg-red-500' : 'bg-gray-200'
          }`}>
            <Image 
              src="/bottomicon/icons8-campaign-64.png" 
              alt="Campaign" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </div>
          <span className={`text-xs font-lexend font-medium ${
            activePage === 'campaign' ? 'text-red-500' : 'text-gray-600'
          }`}>Campaign</span>
        </Link>
        
        <Link href="/history" className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activePage === 'history' ? 'bg-red-500' : 'bg-gray-200'
          }`}>
            <Image 
              src="/bottomicon/icons8-history-50.png" 
              alt="History" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </div>
          <span className={`text-xs font-lexend font-medium ${
            activePage === 'history' ? 'text-red-500' : 'text-gray-600'
          }`}>History</span>
        </Link>
        
        <Link href="/account" className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activePage === 'account' ? 'bg-red-500' : 'bg-gray-200'
          }`}>
            <Image 
              src="/bottomicon/icons8-profile-64.png" 
              alt="Account" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </div>
          <span className={`text-xs font-lexend font-medium ${
            activePage === 'account' ? 'text-red-500' : 'text-gray-600'
          }`}>Account</span>
        </Link>
      </div>
    </div>
  );
}
