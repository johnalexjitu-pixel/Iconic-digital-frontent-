"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Gift } from "lucide-react";

interface GoldenEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEggSelect: (eggNumber: number) => void;
  taskTitle: string;
  commission: number;
  estimatedNegativeAmount?: number;
}

export default function GoldenEggModal({ 
  isOpen, 
  onClose, 
  onEggSelect, 
  taskTitle, 
  commission,
  estimatedNegativeAmount = 0
}: GoldenEggModalProps) {
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animatingEggs, setAnimatingEggs] = useState<boolean[]>([]);
  const [showCross, setShowCross] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedEgg(null);
      setShowResult(false);
      setAnimatingEggs([false, false, false]);
      setShowCross(true);
      
      // Auto-hide cross sign after 3 seconds
      const timer = setTimeout(() => {
        setShowCross(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleEggClick = (eggNumber: number) => {
    if (selectedEgg !== null) return; // Prevent multiple selections
    
    setSelectedEgg(eggNumber);
    
    // Start animation for all eggs
    setAnimatingEggs([true, true, true]);
    
    // Show result after animation
    setTimeout(() => {
      setShowResult(true);
    }, 1000);
  };

  const handleConfirm = () => {
    if (selectedEgg !== null) {
      onEggSelect(selectedEgg);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Calculate final commission using CustomerTask negative scenario
  const finalCommission = commission + estimatedNegativeAmount;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Full screen black background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Close button - auto-hide after 3 seconds */}
      {showCross && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 transition-opacity duration-500"
        >
          <X className="w-6 h-6" />
        </Button>
      )}

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 max-w-md w-full mx-4 p-6 relative overflow-hidden z-20">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🥚 Golden Egg Task!</h2>
          <p className="text-gray-600 mb-1">{taskTitle}</p>
          <p className="text-sm text-gray-500">Choose one egg to reveal your reward!</p>
        </div>

        {/* Eggs Container */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3].map((eggNumber) => (
            <div
              key={eggNumber}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedEgg === eggNumber 
                  ? 'scale-110' 
                  : selectedEgg !== null 
                    ? 'opacity-50 scale-95' 
                    : 'hover:scale-105'
              }`}
              onClick={() => handleEggClick(eggNumber)}
            >
              {/* Egg */}
              <div className={`w-20 h-24 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full relative shadow-lg ${
                animatingEggs[eggNumber - 1] ? 'animate-bounce' : ''
              }`}>
                {/* Egg pattern */}
                <div className="absolute inset-2 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-600 rounded-full opacity-40"></div>
                <div className="absolute top-6 right-4 w-1 h-1 bg-yellow-600 rounded-full opacity-30"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-yellow-600 rounded-full opacity-50"></div>
                
                {/* Sparkles animation */}
                {selectedEgg === eggNumber && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-yellow-600 animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Egg number */}
              <div className="text-center mt-2">
                <span className="text-sm font-semibold text-gray-600">Egg {eggNumber}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        {showResult && (
          <div className="text-center mb-6 animate-fade-in">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 mr-2 text-green-600" />
                <span className="text-lg font-bold text-green-800">
                  Congratulations!
                </span>
              </div>
              <p className="text-green-700 mb-1">
                You selected Egg {selectedEgg}
              </p>
              <p className="text-2xl font-bold text-green-800">
                BDT {Math.abs(finalCommission).toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                You have won an exclusive reward!
              </p>
              {estimatedNegativeAmount !== 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Base: {commission} + Negative: {estimatedNegativeAmount} = {finalCommission}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              window.open('https://wa.me/8801750577439', '_blank');
              handleConfirm(); // Complete task when clicking Customer Support
            }}
            className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Customer Support
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.open('/account', '_blank');
              handleConfirm(); // Complete task when clicking Make Deposit
            }}
            className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
          >
            Make Deposit
          </Button>
          {showResult && (
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              Claim Reward
            </Button>
          )}
        </div>

        {/* Background decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-orange-200 rounded-full opacity-30 animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-2 w-4 h-4 bg-yellow-300 rounded-full opacity-25 animate-pulse delay-150"></div>
      </Card>
    </div>
  );
}
