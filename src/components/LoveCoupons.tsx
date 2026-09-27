import React from 'react';
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
        <h2 className="font-hand text-6xl text-ink squiggle inline-block px-2 mb-3">
          Birthday Vouchers
        </h2>
        <p className="font-hand text-2xl text-pink-500">
          {hasReachedLimit
            ? "You've made your choices! I'll honor these anytime you want ♡"
            : `Pilih ${MAX_CHOICES} hadiah ya (${remainingChoices} left!)`}
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
              className={`reveal relative w-full text-left rounded-2xl flex items-stretch transition-all duration-300
                ${isThisRedeemed ? 'btn-pop bg-pink-50'
                  : isLockedOut ? 'border-2 border-ink/15 bg-white opacity-50 grayscale cursor-not-allowed'
                  : 'btn-pop bg-white cursor-pointer'}`}
            >
              {/* ticket stub with the icon, torn off along the dashed line */}
              <div className="flex items-center justify-center px-4 border-r-2 border-dashed border-ink/25 shrink-0">
                <div className={`p-3 rounded-full transition-colors duration-300 ${isThisRedeemed ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-500'}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="p-4 pr-6">
                <h3 className="font-pop font-semibold text-lg leading-tight text-ink mb-1">{coupon.title}</h3>
                <p className="text-sm text-ink/70">{coupon.desc}</p>
              </div>

              {/* rubber stamp in the corner, so it never covers the title */}
              {isThisRedeemed && (
                <div className="absolute -top-3 -right-2 rotate-12 animate-in zoom-in pointer-events-none">
                  <div className="border-[3px] border-pink-600 text-pink-600 bg-white font-pop font-bold text-xs tracking-widest px-2 py-1 rounded-md">
                    CLAIMED ♥
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
