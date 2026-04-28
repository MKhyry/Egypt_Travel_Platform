'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import SimpleFooter from '@/components/layout/SimpleFooter';

const steps = ['Trip Details', 'Personal Info', 'Payment', 'Confirmation'];

export default function BookingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    nationality: '', passportNumber: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    specialRequests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    if (step === 2) router.push('/confirmation');
  };

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-8 py-stack-lg">

        {/* ── Progress Steps ── */}
        <div className="flex items-center justify-center mb-stack-lg gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${i <= step ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                </div>
                <span className={`text-xs mt-2 font-label-caps ${i <= step ? 'text-primary' : 'text-on-surface-variant'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-16 md:w-24 mx-2 mb-5 transition-all ${i < step ? 'bg-primary' : 'bg-outline-variant'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Form ── */}
          <div className="lg:col-span-2">

            {/* Step 0 — Trip Details */}
            {step === 0 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">Trip Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Number of Travelers</label>
                    <input name="travelers" type="number" defaultValue={2} min={1} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Travel Date</label>
                    <input type="date" className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Special Requests</label>
                    <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows={3} placeholder="Dietary requirements, accessibility needs, celebrations..." className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — Personal Info */}
            {step === 1 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'firstName', label: 'First Name', placeholder: 'Alexander' },
                    { name: 'lastName', label: 'Last Name', placeholder: 'Rostova' },
                    { name: 'email', label: 'Email Address', placeholder: 'you@example.com' },
                    { name: 'phone', label: 'Phone Number', placeholder: '+20 100 000 0000' },
                    { name: 'nationality', label: 'Nationality', placeholder: 'Egyptian' },
                    { name: 'passportNumber', label: 'Passport Number', placeholder: 'A12345678' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">{f.label}</label>
                      <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} placeholder={f.placeholder} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-2">Payment Details</h2>
                <p className="font-body-md text-on-surface-variant mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">lock</span>
                  Your payment information is encrypted and secure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Name on Card</label>
                    <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Alexander Rostova" className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Card Number</label>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Expiry Date</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM / YY" className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">CVV</label>
                    <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" maxLength={3} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="border border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors">
                  Back
                </button>
              ) : (
                <Link href="/my-trip" className="border border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors">
                  Cancel
                </Link>
              )}
              <button onClick={handleNext} className="bg-primary text-on-primary px-12 py-3 font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-lg">
                {step === 2 ? 'Confirm & Pay' : 'Continue'}
              </button>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-inverse-surface rounded-xl p-8 text-white sticky top-28">
              <h3 className="font-h3 text-h3 mb-6">Order Summary</h3>
              <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-inverse-on-surface/70">Trip Package</span>
                  <span>$1,890</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-inverse-on-surface/70">Hotel (3 nights)</span>
                  <span>$750</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-inverse-on-surface/70">Service Fee</span>
                  <span>$120</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl mb-2">
                <span>Total</span>
                <span className="text-primary-fixed">$2,760</span>
              </div>
              <p className="text-inverse-on-surface/50 text-xs">All taxes included. Free cancellation up to 48h before departure.</p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="text-xs">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  <span className="text-xs">24/7 Support Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}