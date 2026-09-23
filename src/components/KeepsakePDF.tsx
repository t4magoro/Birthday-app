import React from 'react';
import { INITIAL_COUPONS } from './LoveCoupons';
import { CONFIG } from '../config';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  wishes: string[];
  redeemedIds: number[];
}

export const KeepsakePDF = ({ wishes, redeemedIds }: Props) => {
  const selectedCoupons = INITIAL_COUPONS.filter(c => redeemedIds.includes(c.id));

  return (
    // The WebkitPrintColorAdjust rule forces the browser to print the pink background colors
    <div className="w-full min-h-screen bg-white text-gray-800 p-12 font-serif" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <div className="border-8 border-pink-200 rounded-3xl p-12 h-full relative bg-pink-50/30">
        <Heart className="absolute -top-6 -left-6 w-12 h-12 text-pink-400 fill-pink-200" />
        <Heart className="absolute -bottom-6 -right-6 w-12 h-12 text-pink-400 fill-pink-200" />
        <Heart className="absolute -top-6 -right-6 w-12 h-12 text-pink-400 fill-pink-200" />
        <Heart className="absolute -bottom-6 -left-6 w-12 h-12 text-pink-400 fill-pink-200" />
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-pink-500 mb-4 tracking-wide flex items-center justify-center gap-4">
            <Sparkles className="text-yellow-400 w-10 h-10" />
            Birthday Keepsake
            <Sparkles className="text-yellow-400 w-10 h-10" />
          </h1>
          <p className="text-2xl text-gray-600 italic">Officially issued to {CONFIG.HER_NAME}</p>
        </div>

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-3xl font-bold text-pink-400 mb-6 border-b-2 border-pink-200 pb-2">
              Claimed Birthday Vouchers
            </h2>
            {selectedCoupons.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {selectedCoupons.map(coupon => {
                  const Icon = coupon.icon;
                  return (
                    <div key={coupon.id} className="border-4 border-dashed border-pink-300 p-6 rounded-2xl bg-white relative shadow-sm">
                      <Icon className="w-8 h-8 text-pink-500 mb-2" />
                      <h3 className="text-xl font-bold text-gray-800">{coupon.title}</h3>
                      <p className="text-gray-600 mt-2">{coupon.desc}</p>
                      <CheckCircle2 className="absolute top-4 right-4 text-green-500 w-8 h-8" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No vouchers were claimed.</p>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-pink-400 mb-6 border-b-2 border-pink-200 pb-2">
              Wishes Sent to the Universe
            </h2>
            {wishes.length > 0 ? (
              <ul className="space-y-4">
                {wishes.map((wish, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xl text-gray-700 bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-200 flex-shrink-0 mt-1" />
                    <span>{wish}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No wishes were made.</p>
            )}
          </section>
        </div>

        <div className="mt-20 text-center">
          <p className="text-pink-400 font-bold text-xl">Signed with love. Happy Birthday!</p>
        </div>
      </div>
    </div>
  );
};