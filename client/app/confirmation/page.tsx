'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SimpleFooter from '@/components/layout/SimpleFooter';

export default function ConfirmationPage() {
  const [show, setShow] = useState(false);
const [bookingRef] = useState(
  `KMT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
);
  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <main className="max-w-3xl mx-auto px-8 py-stack-lg text-center">

        {/* ── Success Animation ── */}
        <div className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase block mb-4">
            Booking Confirmed
          </span>
          <h1 className="font-h1 text-h1 text-on-surface mb-4">Your Journey Awaits</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md max-w-xl mx-auto">
            Your Egyptian adventure has been confirmed. A full itinerary has been sent to your email.
          </p>

          {/* Booking Reference */}
          <div className="bg-surface-container-low rounded-xl p-8 mb-stack-md border border-outline-variant/20 inline-block mx-auto w-full">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Booking Reference</p>
            <p className="font-h2 text-h2 text-primary tracking-widest">{bookingRef}</p>
          </div>

          {/* Trip Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg text-left">
            {[
              { icon: 'flight_takeoff', label: 'Departure', value: 'June 1, 2026', sub: 'Cairo International' },
              { icon: 'schedule', label: 'Duration', value: '7 Days', sub: '6 Nights' },
              { icon: 'group', label: 'Travelers', value: '2 Adults', sub: 'Private Tour' },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high">
                <span className="material-symbols-outlined text-primary text-2xl mb-3 block">{item.icon}</span>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">{item.label}</p>
                <p className="font-bold text-on-surface">{item.value}</p>
                <p className="text-sm text-on-surface-variant">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* What's Next */}
          <div className="bg-surface-container-low rounded-xl p-8 mb-stack-lg text-left border border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface mb-6">What Happens Next</h3>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Check your email for your full booking confirmation and itinerary PDF.' },
                { step: '2', text: 'Our concierge team will contact you within 24 hours to confirm your preferences.' },
                { step: '3', text: 'Receive your digital travel pack 7 days before departure.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {item.step}
                  </div>
                  <p className="font-body-md text-on-surface-variant pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/my-trip" className="bg-primary text-on-primary font-bold px-10 py-4 font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95">
              View My Trip
            </Link>
            <Link href="/explore" className="border border-outline-variant text-on-surface-variant px-10 py-4 font-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors">
              Explore More Places
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
