'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { tripsAPI, packagesAPI, bookingsAPI } from '@/lib/api';
import SimpleFooter from '@/components/layout/SimpleFooter';

const steps = ['Trip Details', 'Personal Info', 'Payment', 'Review', 'Confirmation'];

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const tripId = searchParams.get('tripId');
  const packageId = searchParams.get('packageId');

  const [step, setStep] = useState(0);
  const [trip, setTrip] = useState<any>(null);
  const [pkg, setPkg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    startDate: '',
    guests: 1,
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: '',
    notes: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  const flowType = tripId ? 'trip' : 'package';

  useEffect(() => {
    if (!tripId && !packageId) {
      router.push('/my-trip');
      return;
    }
    if (user) {
      setForm(prev => ({ ...prev, contactName: user.name || '', contactEmail: user.email || '' }));
    }
    setIsLoading(true);
    if (tripId) {
      tripsAPI.getById(tripId)
        .then((res) => setTrip(res.data.data))
        .catch(() => router.push('/my-trip'))
        .finally(() => setIsLoading(false));
    } else if (packageId) {
      packagesAPI.getById(packageId as string)
        .then((res) => setPkg(res.data.data))
        .catch(() => router.push('/trips'))
        .finally(() => setIsLoading(false));
    }
  }, [tripId, packageId, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 1 : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Calculate total price
  const totalPrice = trip
    ? (trip.hotels || []).reduce((sum: number, h: any) => sum + (h.hotel?.pricePerNight || 0) * h.nights, 0)
    : pkg ? pkg.price * form.guests : 0;

  const handleNext = async () => {
    if (step === 3) {
      setSubmitting(true);
      setValidationErrors([]);
      try {
        const bookingData: any = {
          startDate: form.startDate,
          guests: form.guests,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          notes: form.notes,
        };
        if (tripId) bookingData.tripId = tripId;
        if (packageId) bookingData.packageId = packageId;

        const res = await bookingsAPI.create(bookingData);
        setBookingId(res.data.data._id);
        setStep(4);
      } catch (error: any) {
        const data = error.response?.data;
        if (data?.errors) {
          setValidationErrors(data.errors);
        } else {
          setValidationErrors([data?.message || 'Booking failed']);
        }
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-8 py-20 text-center font-body-md text-on-surface-variant">
          Loading booking details...
        </div>
      </MainLayout>
    );
  }

  if (!trip && !pkg) return null;

  const displayName = trip ? trip.title : pkg?.title;
  const displayDuration = trip ? `${trip.totalDays} Days` : pkg?.duration;

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-8 py-stack-lg">

        {/* Progress Steps */}
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

          {/* Form */}
          <div className="lg:col-span-2">

            {/* Step0 — Trip Details */}
            {step === 0 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">Trip Details</h2>

                {/* Trip/Package Summary */}
                <div className="bg-surface-container rounded-lg p-6 mb-6">
                  <h3 className="font-h3 text-h3 text-on-surface mb-2">{displayName}</h3>
                  <p className="text-on-surface-variant font-body-md">{displayDuration}</p>
                  {trip && trip.places && (
                    <p className="text-sm text-on-surface-variant mt-2">
                      {trip.places.length} place{trip.places.length !== 1 ? 's' : ''} planned
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Number of Travelers</label>
                    <input
                      name="guests"
                      type="number"
                      min={1}
                      value={form.guests}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Special Requests</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Dietary requirements, accessibility needs, celebrations..."
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step1 — Personal Info */}
            {step === 1 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'contactName', label: 'Full Name', placeholder: 'John Doe', value: form.contactName },
                    { name: 'contactEmail', label: 'Email Address', placeholder: 'you@example.com', value: form.contactEmail },
                    { name: 'contactPhone', label: 'Phone Number', placeholder: '+20 100 000 0000', value: form.contactPhone },
                  ].map((f) => (
                    <div key={f.name} className={f.name === 'contactEmail' ? 'md:col-span-2' : ''}>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">{f.label}</label>
                      <input
                        name={f.name}
                        value={f.value}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step2 — Payment */}
            {step === 2 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">Payment Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Cardholder Name</label>
                    <input
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Card Number</label>
                    <input
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Expiry</label>
                      <input
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">CVV</label>
                      <input
                        name="cardCvv"
                        value={form.cardCvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step3 — Review & Confirm */}
            {step === 3 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                <h2 className="font-h2 text-h2 text-on-surface mb-6">Confirm Your Booking</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">{flowType === 'trip' ? 'Trip' : 'Package'}</span>
                    <span className="text-on-surface">{displayName}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Duration</span>
                    <span className="text-on-surface">{displayDuration}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Start Date</span>
                    <span className="text-on-surface">{form.startDate}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Travelers</span>
                    <span className="text-on-surface">{form.guests}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Contact</span>
                    <span className="text-on-surface">{form.contactName}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Payment</span>
                    <span className="text-on-surface">Credit Card</span>
                  </div>
                </div>
                {validationErrors.length > 0 && (
                  <div className="bg-error-container text-error px-4 py-3 rounded-lg mb-6">
                    <p className="font-bold text-sm mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm">
                      {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="border-t border-outline-variant pt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step4 — Success / Confirmation */}
            {step === 4 && (
              <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden">
                {/* Success header */}
                <div className="bg-primary-container/30 px-8 pt-10 pb-8 text-center">
                  <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="material-symbols-outlined text-4xl text-on-primary-container">check_circle</span>
                  </div>
                  <h2 className="font-h2 text-h2 text-on-surface mb-2">Booking Confirmed!</h2>
                  <p className="font-body-md text-on-surface-variant">
                    Confirmation details sent to <span className="text-on-surface font-semibold">{form.contactEmail}</span>
                  </p>
                </div>

                {/* Booking Summary */}
                <div className="px-8 py-8">
                  <div className="bg-surface-container rounded-xl p-6 text-left">
                    <h3 className="font-h3 text-h3 text-on-surface mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between font-body-md">
                        <span className="text-on-surface-variant">{flowType === 'trip' ? 'Trip' : 'Package'}</span>
                        <span className="text-on-surface font-semibold">{displayName}</span>
                      </div>
                      <div className="flex justify-between font-body-md">
                        <span className="text-on-surface-variant">Duration</span>
                        <span className="text-on-surface">{displayDuration}</span>
                      </div>
                      <div className="flex justify-between font-body-md">
                        <span className="text-on-surface-variant">Start Date</span>
                        <span className="text-on-surface">{form.startDate}</span>
                      </div>
                      <div className="flex justify-between font-body-md">
                        <span className="text-on-surface-variant">Travelers</span>
                        <span className="text-on-surface">{form.guests}</span>
                      </div>
                      {trip && trip.places && (
                        <div className="flex justify-between font-body-md">
                          <span className="text-on-surface-variant">Places Planned</span>
                          <span className="text-on-surface">{trip.places.length} place{trip.places.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {trip && trip.hotels?.map((h: any) => (
                        <div key={h._id} className="flex justify-between font-body-md">
                          <span className="text-on-surface-variant">{h.hotel?.name || 'Hotel'}</span>
                          <span className="text-on-surface">${(h.hotel?.pricePerNight || 0) * h.nights}</span>
                        </div>
                      ))}
                      {pkg && (
                        <div className="flex justify-between font-body-md">
                          <span className="text-on-surface-variant">Price per Person</span>
                          <span className="text-on-surface">${pkg.price.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-outline-variant pt-3 mt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Paid</span>
                          <span className="text-primary">${totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6 text-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                      Secure Booking
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">support_agent</span>
                      24/7 Support
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/my-trip"
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all inline-block text-center"
                  >
                    View My Trips
                  </Link>
                  <Link
                    href="/"
                    className="border border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors inline-block text-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-8">
                {step > 0 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="border border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <Link
                    href={tripId ? `/my-trip` : `/trips/${packageId}`}
                    className="border border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </Link>
                )}
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="bg-primary text-on-primary px-12 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                >
                  {step === 3 ? (submitting ? 'Processing...' : 'Confirm & Pay') : 'Continue'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {step < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-inverse-surface rounded-xl p-8 text-white sticky top-28">
                <h3 className="font-h3 text-h3 mb-6">Order Summary</h3>
                <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-inverse-on-surface/70">{flowType === 'trip' ? 'Trip' : 'Package'}</span>
                    <span>{displayName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-inverse-on-surface/70">Duration</span>
                    <span>{displayDuration}</span>
                  </div>
                  {pkg && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-inverse-on-surface/70">Price per Person</span>
                        <span>${pkg.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-inverse-on-surface/70">Travelers</span>
                        <span>x {form.guests}</span>
                      </div>
                    </>
                  )}
                  {trip && trip.hotels?.map((h: any) => (
                    <div key={h._id} className="flex justify-between text-sm">
                      <span className="text-inverse-on-surface/70">{h.hotel?.name || 'Hotel'}</span>
                      <span>${(h.hotel?.pricePerNight || 0) * h.nights}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-xl mb-2">
                  <span>Total</span>
                  <span className="text-primary-fixed">${totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-inverse-on-surface/50 text-xs">All taxes included. Free cancellation up to 48h before departure.</p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-xs">Secure Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                    <span className="text-xs">24/7 Support Included</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
