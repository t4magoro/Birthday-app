import React, { useState } from 'react';
import { Film, Coffee, Heart, Utensils, CheckCircle2, Gift } from 'lucide-react';
import { CONFIG } from '../config';
export const MAX_CHOICES = 2;

export const  INITIAL_COUPONS = CONFIG.INITIAL_COUPONS;

interface LoveCouponsProps {
  redeemedIds: number[];
  setRedeemedIds: (ids: number[]) => void;
}

export const LoveCoupons = ({ redeemedIds, setRedeemedIds }: LoveCouponsProps) => {
  const handleRedeem = (id: number) => {
    if (!redeemedIds.includes(id) && redeemedIds.length < MAX_CHOICES) {
      setRedeemedIds([...redeemedIds, id]);
    }
  };

  const hasReachedLimit = redeemedIds.length >= MAX_CHOICES;
  const remainingChoices = MAX_CHOICES - redeemedIds.length;

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-pink-500 mb-2 font-serif flex items-center justify-center gap-2">
          Birthday Vouchers <Gift className="w-6 h-6 text-pink-400" />
        </h2>
        <p className="text-gray-600 font-medium h-6 text-lg">
          {hasReachedLimit 
            ? "You've made your choices! I'll honor these anytime you want." 
            : `You can choose ${MAX_CHOICES} gifts. (${remainingChoices} left!)`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_COUPONS.map((coupon) => {
          const isThisRedeemed = redeemedIds.includes(coupon.id);
          const isLockedOut = hasReachedLimit && !isThisRedeemed;
          const Icon = coupon.icon;

          return (
            <button
              key={coupon.id}
              onClick={() => handleRedeem(coupon.id)}
              disabled={isLockedOut || isThisRedeemed} 
              className={`relative overflow-hidden w-full text-left transition-all duration-500 rounded-xl border-4 border-dashed p-6 
                ${isThisRedeemed ? 'bg-pink-50 border-pink-500 shadow-xl scale-105 z-10' 
                  : isLockedOut ? 'bg-gray-50 border-gray-200 opacity-50 grayscale scale-95 cursor-not-allowed' 
                  : 'bg-white border-pink-300 hover:border-pink-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-95'}`}
            >
              <Icon className={`absolute -right-6 -bottom-6 w-32 h-32 opacity-5 transition-transform duration-500 ${isThisRedeemed ? 'scale-110 text-pink-600 rotate-0' : isLockedOut ? 'scale-75' : 'rotate-12 text-pink-500'}`} />
              <div className="relative z-10 flex items-start gap-4">
                <div className={`p-3 rounded-full transition-colors duration-500 ${isThisRedeemed ? 'bg-pink-500 text-white shadow-md' : isLockedOut ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-500'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-1 font-serif transition-colors duration-500 ${isThisRedeemed ? 'text-pink-700' : isLockedOut ? 'text-gray-400' : 'text-gray-800'}`}>{coupon.title}</h3>
                  <p className={`text-sm transition-colors duration-500 ${isThisRedeemed ? 'text-pink-600 font-medium' : isLockedOut ? 'text-gray-400' : 'text-gray-600'}`}>{coupon.desc}</p>
                </div>
              </div>
              {isThisRedeemed && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-in zoom-in duration-500">
                  <div className="border-4 border-green-500 text-green-500 font-black text-2xl tracking-widest px-6 py-2 rounded-lg rotate-[-15deg] bg-white/90 backdrop-blur-sm shadow-md flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" /> CLAIMED
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};