'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { packagesAPI } from '@/lib/api';

export default function TripsPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState('all');
  const [tier, setTier] = useState('all');
  const [region, setRegion] = useState('all');

  const fetchPackages = () => {
    setIsLoading(true);
    const params: Record<string, string> = {};
    if (duration !== 'all') params.duration = duration;
    if (tier !== 'all') params.tier = tier;
    if (region !== 'all') params.region = region;

    packagesAPI.getAll(params)
      .then((res) => setPackages(res.data.data))
      .catch(() => setPackages([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const resetFilters = () => {
    setDuration('all');
    setTier('all');
    setRegion('all');
  };

  return (
    <MainLayout>
      {/* ── Hero Header ── */}
      <section className="max-w-7xl mx-auto px-8 pt-stack-lg pb-stack-md">
        <span className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em] mb-4 block">Exclusive Collections</span>
        <h1 className="font-h1 text-h1 text-on-surface mb-6">Curated Journeys</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Meticulously crafted travel packages designed to immerse you in the timeless grandeur of Egypt.
        </p>
      </section>

      {/* ── Filters ── */}
      <section className="max-w-7xl mx-auto px-8 mb-stack-md">
        <div className="bg-surface-container-low p-6 rounded-lg flex flex-col md:flex-row gap-gutter items-end shadow-sm">
          <div className="w-full md:w-1/4">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary-container font-body-md text-on-surface cursor-pointer focus:outline-none">
              <option value="all">All Durations</option>
              <option value="short">3–5 days</option>
              <option value="medium">6–9 days</option>
              <option value="long">10+ days</option>
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Budget Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary-container font-body-md text-on-surface cursor-pointer focus:outline-none">
              <option value="all">All Tiers</option>
              <option value="Luxury">Luxury</option>
              <option value="Boutique">Boutique</option>
              <option value="Essential">Essential</option>
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary-container font-body-md text-on-surface cursor-pointer focus:outline-none">
              <option value="all">All Regions</option>
              <option value="Cairo">Cairo</option>
              <option value="Luxor">Luxor</option>
              <option value="Aswan">Aswan</option>
              <option value="Red Sea">Red Sea</option>
              <option value="Alexandria">Alexandria</option>
            </select>
          </div>
          <div className="w-full md:w-1/4 flex gap-3">
            <button onClick={fetchPackages} className="flex-1 bg-secondary text-on-secondary py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary/90 transition-colors">
              Apply
            </button>
            <button onClick={resetFilters} className="px-4 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container transition-colors">
              Reset
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-on-surface-variant font-body-md">
          Showing <span className="font-bold text-on-surface">{packages.length}</span> packages
        </p>
      </section>

      {/* ── Package Grid ── */}
      <section className="max-w-7xl mx-auto px-8 pb-stack-lg">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-surface-container-high" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-full" />
                  <div className="h-10 bg-surface-container-high rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant">search_off</span>
            <p className="font-h3 text-h3 text-on-surface-variant mt-4">No packages match your filters</p>
            <button onClick={resetFilters} className="mt-6 bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg._id} className="group bg-surface-container-lowest overflow-hidden hover:-translate-y-1 transition-transform duration-300 rounded-xl" style={{ boxShadow: '0 10px 30px -10px rgba(50,100,125,0.15)' }}>
                <div className="relative h-64 overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-primary-container/90 text-on-primary-container px-3 py-1 font-label-caps text-label-caps rounded-sm">
                    {pkg.duration}
                  </div>
                  <div className="absolute top-4 right-4 bg-inverse-surface/80 text-inverse-on-surface px-3 py-1 font-label-caps text-[10px] rounded-full uppercase">
                    {pkg.tier}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-h3 text-h3 mb-2 text-on-surface">{pkg.title}</h3>
                  <p className="text-secondary text-sm font-medium mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {pkg.cities}
                  </p>
                  <p className="font-body-md text-on-surface-variant text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="flex gap-3 mb-6 text-on-surface-variant">
                    {pkg.icons?.slice(0, 3).map((icon: string) => (
                      <span key={icon} className="material-symbols-outlined text-lg">{icon}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                    <div>
                      <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider block">From</span>
                      <span className="font-h3 text-h3 text-primary">${pkg.price.toLocaleString()}</span>
                    </div>
                    <Link href={`/trips/${pkg._id}`} className="bg-tertiary-container text-white px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary transition-colors active:scale-95">
                      View Trip
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </MainLayout>
  );
}
