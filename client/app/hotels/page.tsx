'use client';

import { useEffect, useState, Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { hotelsAPI } from '@/lib/api';

import SimpleFooter from '@/components/layout/SimpleFooter';

const CITIES = ['Cairo', 'Giza', 'Luxor', 'Aswan', 'Alexandria', 'Hurghada', 'Farafra'];
const STARS = [5, 4, 3, 2, 1];

function HotelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [stars, setStars] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    setIsLoading(true);
    hotelsAPI.getAll({
      city: city || undefined,
      stars: stars || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    })
      .then((res) => setHotels(res.data.data))
      .catch(() => setHotels([]))
      .finally(() => setIsLoading(false));
  }, [city, stars, maxPrice]);

  const selected =
    hotels.find((hotel) => hotel._id === selectedId) || hotels[0] || null;

  const handleHotelPreview = (hotel: any) => {
    setSelectedId(hotel._id);
  };

  const handleHotelOpen = (hotel: any) => {
    router.push(`/hotels/${hotel._id}`);
  };

  return (
    <MainLayout>
      <main className="flex h-[calc(100vh-84px)] overflow-hidden">

        {/* ── Left: Listings ── */}
        <section className="w-full lg:w-3/5 overflow-y-auto hide-scrollbar flex flex-col bg-surface-container-lowest">

          {/* Sticky Filters */}
          <div className="p-8 border-b border-outline-variant sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md z-10">
            <div className="mb-6">
              <h1 className="font-h1 text-h2 text-primary mb-1">
                {city ? `Sanctuaries in ${city}` : 'All Hotels'}
              </h1>
              <p className="font-body-md text-on-surface-variant italic">Refined luxury amidst the eternal sands.</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {/* City pills */}
              <button onClick={() => setCity('')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${city === '' ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>All</button>
              {CITIES.map((c) => (
                <button key={c} onClick={() => setCity(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${city === c ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>{c}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {/* Stars filter */}
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Stars:</span>
                {STARS.map((s) => (
                  <button key={s} onClick={() => setStars(stars === s ? null : s)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${stars === s ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>{s}</button>
                ))}
              </div>
              {/* Max price */}
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Max $</span>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="500" className="w-24 bg-transparent border-b border-outline-variant px-2 py-1 text-sm focus:outline-none focus:border-primary-container" />
              </div>
            </div>
          </div>

          {/* Hotel List */}
          <div className="flex flex-col divide-y divide-outline-variant/20">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-6 animate-pulse">
                  <div className="w-32 h-32 bg-surface-container-high rounded-xl flex-shrink-0" />
                  <div className="flex-grow space-y-3">
                    <div className="h-6 bg-surface-container-high rounded w-2/3" />
                    <div className="h-4 bg-surface-container-high rounded w-1/2" />
                    <div className="h-4 bg-surface-container-high rounded w-full" />
                  </div>
                </div>
              ))
            ) : hotels.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-5xl text-outline-variant">hotel</span>
                <p className="font-h3 text-h3 text-on-surface-variant mt-4">No hotels found</p>
              </div>
            ) : hotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => handleHotelOpen(hotel)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleHotelOpen(hotel);
                  }
                }}
                onMouseEnter={() => handleHotelPreview(hotel)}
                onFocus={() => handleHotelPreview(hotel)}
                role="button"
                tabIndex={0}
                className={`flex gap-4 p-6 cursor-pointer transition-all hover:bg-surface-container-low ${selected?._id === hotel._id ? 'bg-surface-container-low border-l-4 border-primary' : ''}`}
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={hotel.images?.[0] || 'https://placehold.co/128x128?text=Hotel'} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-h3 text-on-surface mb-1" style={{ fontSize: '20px' }}>{hotel.name}</h3>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {hotel.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary text-lg">${hotel.pricePerNight}</span>
                      <span className="text-on-surface-variant text-xs block">/night</span>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.amenities?.slice(0, 3).map((a: string) => (
                      <span key={a} className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{a}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-outline">
                      {selected?._id === hotel._id ? 'Previewing details' : 'Tap for preview'}
                    </span>
                    <Link
                      href={`/hotels/${hotel._id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-primary transition-colors"
                    >
                      View details
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Right: Detail Panel ── */}
        <section className="hidden lg:flex lg:w-2/5 flex-col overflow-y-auto hide-scrollbar bg-surface-container-low border-l border-outline-variant/30">
          {selected ? (
            <>
              <div className="h-72 relative overflow-hidden flex-shrink-0">
                <img src={selected.images?.[0] || 'https://placehold.co/600x300?text=Hotel'} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="font-h2">{selected.name}</h2>
                  <p className="font-body-md">{selected.city}, Egypt</p>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex">
                    {Array.from({ length: selected.stars }).map((_: any, i: number) => (
                      <span key={i} className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="font-h3 text-h3 text-primary">${selected.pricePerNight}</span>
                    <span className="text-on-surface-variant text-sm"> /night</span>
                  </div>
                </div>
                <p className="font-body-md text-on-surface-variant mb-6">{selected.description}</p>
                {selected.amenities?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-label-caps text-label-caps text-on-surface mb-3 border-b border-outline-variant pb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.amenities.map((a: string) => (
                        <span key={a} className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selected.nearbyPlaces?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-label-caps text-label-caps text-on-surface mb-3 border-b border-outline-variant pb-2">Nearby Places</h4>
                    <div className="space-y-2">
                      {selected.nearbyPlaces.map((p: any) => (
                        <div key={p._id} className="flex items-center gap-2 text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                          <span className="font-body-md text-sm">{p.name} — {p.city}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Link
                  href={`/hotels/${selected._id}`}
                  className="block w-full bg-primary text-on-primary text-center font-label-caps text-label-caps py-4 uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                >
                  View Full Details
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-outline-variant">hotel</span>
                <p className="font-body-md text-on-surface-variant mt-4">Select a hotel to view details</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
