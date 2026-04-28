'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { hotelsAPI } from '@/lib/api';
import SimpleFooter from '@/components/layout/SimpleFooter';

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nights, setNights] = useState(3);

  useEffect(() => {
    hotelsAPI.getById(id as string)
      .then((res) => setHotel(res.data.data))
      .catch(() => router.push('/hotels'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-8 py-12 animate-pulse space-y-8">
        <div className="h-[600px] bg-surface-container-high rounded-xl" />
        <div className="h-12 bg-surface-container-high rounded w-1/2" />
      </div>
    </MainLayout>
  );

  if (!hotel) return null;

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps uppercase">
          <Link href="/hotels" className="hover:text-primary transition-colors">Hotels</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface-variant">{hotel.city}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface">{hotel.name}</span>
        </nav>

        {/* ── Gallery ── */}
        <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] mb-stack-md">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl shadow-sm">
            <img src={hotel.images?.[0] || 'https://placehold.co/800x600?text=Hotel'} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              <span className="text-xs font-bold text-on-surface">View All Photos</span>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-xl shadow-sm">
              <img src={hotel.images?.[i] || hotel.images?.[0] || 'https://placehold.co/400x300?text=Hotel'} alt={`${hotel.name} ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </section>

        {/* ── Main Content ── */}
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg border-b border-outline-variant pb-stack-md">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {Array.from({ length: hotel.stars }).map((_: any, i: number) => (
                      <span key={i} className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold">{hotel.rating}</span>
                  </div>
                </div>
                <h1 className="font-h1 text-h1 text-on-surface">{hotel.name}</h1>
                <p className="text-on-surface-variant flex items-center gap-1 mt-2 font-body-lg">
                  <span className="material-symbols-outlined">location_on</span>
                  {hotel.city}, Egypt
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant uppercase font-bold block">Starting from</span>
                <span className="font-h1 text-h1 text-primary">${hotel.pricePerNight}</span>
                <span className="text-on-surface-variant font-body-md"> / night</span>
              </div>
            </div>

            {/* Description */}
            <section className="mb-stack-lg">
              <h2 className="font-h2 text-h2 mb-stack-sm">About</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">{hotel.description}</p>
            </section>

            {/* Amenities */}
            <section className="mb-stack-lg">
              <h2 className="font-h2 text-h2 mb-stack-sm">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities?.map((a: string) => (
                  <div key={a} className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="font-body-md">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Nearby Places */}
            {hotel.nearbyPlaces?.length > 0 && (
              <section className="mb-stack-lg">
                <h2 className="font-h2 text-h2 mb-stack-sm">Nearby Attractions</h2>
                <div className="space-y-3">
                  {hotel.nearbyPlaces.map((p: any) => (
                    <Link key={p._id} href={`/place/${p._id}`} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-colors group">
                      <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">explore</span>
                      <div>
                        <p className="font-bold text-on-surface">{p.name}</p>
                        <p className="text-sm text-on-surface-variant capitalize">{p.category}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant ml-auto">chevron_right</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Booking Sidebar ── */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-8 sticky top-28" style={{ boxShadow: '0 10px 30px -10px rgba(50,100,125,0.15)' }}>
              <h3 className="font-h3 text-h3 text-on-surface mb-6">Reserve Your Stay</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Check In</label>
                  <input type="date" className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Check Out</label>
                  <input type="date" className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Nights: {nights}</label>
                  <input type="range" min={1} max={30} value={nights} onChange={(e) => setNights(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
              <div className="border-t border-outline-variant/30 pt-4 mb-6 space-y-2">
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>${hotel.pricePerNight} x {nights} nights</span>
                  <span>${hotel.pricePerNight * nights}</span>
                </div>
                <div className="flex justify-between font-bold text-on-surface text-lg">
                  <span>Total</span>
                  <span className="text-primary">${hotel.pricePerNight * nights}</span>
                </div>
              </div>
              <Link
                href="/booking"
                className="block w-full bg-tertiary-container text-white text-center font-label-caps text-label-caps py-4 uppercase tracking-widest hover:bg-tertiary transition-all active:scale-95 shadow-lg"
              >
                Book Now
              </Link>
              <Link
                href="/my-trip"
                className="block w-full text-center border border-secondary text-secondary font-label-caps text-label-caps py-3 uppercase tracking-widest hover:bg-secondary-container transition-all mt-3"
              >
                Add to My Trip
              </Link>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}