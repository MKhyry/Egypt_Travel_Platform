'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { packagesAPI } from '@/lib/api';

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    packagesAPI.getById(id as string)
      .then((res) => setPkg(res.data.data))
      .catch(() => router.push('/trips'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-surface-container-high rounded-xl" />
            <div className="h-8 bg-surface-container-high rounded w-1/2 mx-auto" />
            <div className="h-4 bg-surface-container-high rounded w-1/3 mx-auto" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!pkg) return null;

  const visibleDays = showAll ? pkg.itinerary : pkg.itinerary?.slice(0, 2) || [];

  return (
    <MainLayout>

      {/* ── Hero — Full Height ── */}
      <section className="relative h-[870px] w-full overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-24">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-1 text-primary-container">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-label-caps text-label-caps">{pkg.rating} ({pkg.reviews} REVIEWS)</span>
            </div>
            <span className="text-white/40">•</span>
            <span className="font-label-caps text-label-caps text-white">{pkg.duration.toUpperCase()}</span>
            <span className="text-white/40">•</span>
            <span className="bg-white/20 backdrop-blur text-white px-3 py-0.5 rounded-full font-label-caps text-[10px] uppercase">{pkg.tier}</span>
          </div>
          <h1 className="font-h1 text-h1 text-white max-w-3xl mb-6">{pkg.title}</h1>
          <p className="font-body-lg text-body-lg text-stone-200 max-w-2xl">{pkg.heroDescription || pkg.description}</p>
        </div>
      </section>

      {/* ── Sticky Summary Bar ── */}
      <div className="sticky top-[72px] z-40 bg-white shadow-sm border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Starting From</span>
            <span className="font-h3 text-h3 text-primary">${pkg.price.toLocaleString()}</span>
            <span className="font-body-md text-on-surface-variant">/ person</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/booking?packageId=${id}`} className="px-8 py-3 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-label-caps text-label-caps uppercase tracking-widest shadow-md">
              Book Trip
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">

        {/* ── Left: itinerary + accommodations ── */}
        <div className="w-full lg:flex-[70%] space-y-16">

          {/* Itinerary */}
          <section>
            <h2 className="font-h2 text-h2 mb-8">The Journey</h2>
            <div className="space-y-0">
              {visibleDays.map((day: any, i: number) => (
                <div key={i} className="relative pb-10 flex gap-6">
                  {/* Timeline vertical line */}
                  {i < visibleDays.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-outline-variant" />
                  )}
                  {/* Day circle */}
                  <div className="flex-shrink-0 z-10">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
                      {day.dayLabel}
                    </div>
                  </div>
                  {/* Card */}
                  <div className="flex-grow flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                    <div className="flex-1">
                      <h3 className="font-h3 text-h3 text-stone-900 mb-2">{day.title}</h3>
                      {day.city && (
                        <p className="font-body-md text-on-surface-variant text-sm mb-2">{day.city}</p>
                      )}
                      <p className="font-body-md text-on-surface-variant mb-4">{day.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-stone-500 text-sm">
                        {day.meals && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">restaurant</span>
                            {day.meals}
                          </span>
                        )}
                        {day.stay && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">hotel</span>
                            {day.stay}
                          </span>
                        )}
                      </div>
                    </div>
                    {day.image && (
                      <img
                        src={day.image}
                        alt={day.title}
                        className="w-40 h-28 object-cover rounded shadow-sm flex-shrink-0 self-start"
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Show more / collapse */}
              {pkg.itinerary && pkg.itinerary.length > 2 && (
                <div className="relative pb-10 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-bold text-sm">
                      ···
                    </div>
                  </div>
                  <div className="flex-1 py-4 border-b border-stone-100">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-secondary font-label-caps text-label-caps uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {showAll
                        ? 'Collapse Itinerary'
                        : `View Remaining ${pkg.itinerary.length - 2} Days`}
                      <span className="material-symbols-outlined">
                        {showAll ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Hotels / Accommodations */}
          {pkg.hotels?.length > 0 && (
            <section>
              <h2 className="font-h2 text-h2 mb-8">Luxury Accommodations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pkg.hotels.map((hotel: any) => (
                  <div key={hotel.name} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg mb-4 h-64">
                      <img
                        src={hotel.image || 'https://placehold.co/400x300?text=Hotel'}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h4 className="font-h3 text-on-surface" style={{ fontSize: '20px' }}>{hotel.name}</h4>
                    <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-widest mb-2 mt-1">{hotel.city}</p>
                    <p className="font-body-md text-on-surface-variant text-sm">{hotel.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right: map + included ── */}
        <div className="w-full lg:flex-[15%] space-y-8 lg:sticky lg:top-40 lg:self-start">

          {/* Route Map */}
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm border border-stone-200 p-2">
            <div className="relative w-full aspect-square bg-stone-200 rounded-lg overflow-hidden">
              <img
                src={pkg.routeMapImage || 'https://placehold.co/400x400?text=Map'}
                alt="Route Map"
                className="w-full h-full object-cover opacity-60 mix-blend-multiply"
              />
              {/* City labels */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                {pkg.regions?.map((region: string) => (
                  <div key={region} className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm self-start uppercase">
                    {region}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 text-center">
              <p className="font-label-caps text-[11px] text-stone-500 uppercase tracking-widest">{pkg.cities}</p>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8">
            <h3 className="font-h3 mb-6" style={{ fontSize: '22px' }}>What's Included</h3>
            <ul className="space-y-4">
              {pkg.includes?.map((item: string) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary-container text-xl flex-shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-body-md text-stone-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <hr className="my-8 border-stone-100" />
            {/* Customization CTA */}
            <div className="bg-stone-50 p-4 rounded-lg border border-dashed border-stone-200">
              <p className="font-label-caps text-[10px] text-stone-500 mb-2 uppercase">Need Customization?</p>
              <p className="font-body-md text-xs text-stone-600 mb-4">
                Extend your stay or add a private hot air balloon ride in Luxor.
              </p>
              <button className="w-full py-2 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 rounded hover:bg-primary/5 transition-colors">
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
}
