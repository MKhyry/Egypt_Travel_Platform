'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { searchAPI } from '@/lib/api';

type ResultItem = {
  _id: string;
  name?: string;
  title?: string;
  city?: string;
  type: 'place' | 'hotel' | 'package';
  images?: string[];
  image?: string;
  rating?: number;
  price?: number;
  pricePerNight?: number;
  stars?: number;
  duration?: string;
  tier?: string;
  category?: string;
  description?: string;
};

const typeLabels: Record<string, string> = {
  place: 'Places',
  hotel: 'Hotels',
  package: 'Packages',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<{ places: ResultItem[]; hotels: ResultItem[]; packages: ResultItem[] }>({
    places: [],
    hotels: [],
    packages: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'places' | 'hotels' | 'packages'>('all');

  useEffect(() => {
    if (!query) {
      setResults({ places: [], hotels: [], packages: [] });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    searchAPI
      .search(query)
      .then((res) => {
        setResults(res.data.data);
      })
      .catch(() => {
        setResults({ places: [], hotels: [], packages: [] });
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  const totalResults = results.places.length + results.hotels.length + results.packages.length;

  const filteredPlaces = activeTab === 'all' || activeTab === 'places' ? results.places : [];
  const filteredHotels = activeTab === 'all' || activeTab === 'hotels' ? results.hotels : [];
  const filteredPackages = activeTab === 'all' || activeTab === 'packages' ? results.packages : [];

  const renderPlace = (item: ResultItem) => (
    <Link key={item._id} href={`/place/${item._id}`} className="group block">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high hover:shadow-md transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img src={item.images?.[0] || 'https://placehold.co/400x300?text=No+Image'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {item.rating && (
            <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-sm font-bold text-on-surface">{item.rating}</span>
            </div>
          )}
          {item.category && (
            <div className="absolute bottom-3 left-3 bg-inverse-surface/80 text-inverse-on-surface text-xs px-3 py-1 rounded-full font-label-caps tracking-widest">
              {item.category}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-h3 text-h3 text-on-surface mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
          <p className="text-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-base">location_on</span>
            {item.city}
          </p>
          {item.description && <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">{item.description}</p>}
        </div>
      </div>
    </Link>
  );

  const renderHotel = (item: ResultItem) => (
    <Link key={item._id} href={`/hotels/${item._id}`} className="group block">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high hover:shadow-md transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img src={item.images?.[0] || 'https://placehold.co/400x300?text=No+Image'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {item.stars && (
            <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
              {[...Array(item.stars)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-h3 text-h3 text-on-surface mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
          <p className="text-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-base">location_on</span>
            {item.city}
          </p>
          {item.pricePerNight && (
            <p className="text-sm text-primary font-bold mt-2">${item.pricePerNight} / night</p>
          )}
        </div>
      </div>
    </Link>
  );

  const renderPackage = (item: ResultItem) => (
    <Link key={item._id} href={`/trips/${item._id}`} className="group block">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high hover:shadow-md transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img src={item.image || 'https://placehold.co/400x300?text=No+Image'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {item.tier && (
            <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
              {item.tier}
            </div>
          )}
          {item.duration && (
            <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full text-primary font-bold text-sm">
              {item.duration}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-h3 text-h3 text-on-surface mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
          {item.description && <p className="text-sm text-on-surface-variant line-clamp-2">{item.description}</p>}
          {item.price && (
            <p className="text-lg text-primary font-bold mt-2">${item.price.toLocaleString()}</p>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <MainLayout>
      <section className="bg-surface-container-lowest pt-stack-lg pb-stack-md px-8">
        <div className="max-w-7xl mx-auto">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em] mb-4 block">Search Results</span>
          <h1 className="font-h1 text-h1 text-on-surface mb-4">
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          {query && (
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Found <span className="font-bold text-on-surface">{totalResults}</span> result{totalResults !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-8 py-stack-lg">
        {query && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['all', 'places', 'hotels', 'packages'] as const).map((tab) => {
              const count =
                tab === 'all'
                  ? totalResults
                  : tab === 'places'
                  ? results.places.length
                  : tab === 'hotels'
                  ? results.hotels.length
                  : results.packages.length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {typeLabels[tab] || 'All'} ({count})
                </button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high animate-pulse">
                <div className="h-48 bg-surface-container-high" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
            <p className="font-h3 text-h3 text-on-surface-variant mt-4">No results found</p>
            <p className="font-body-md text-on-surface-variant mt-2">Try a different search term</p>
            <Link href="/explore" className="inline-block mt-6 bg-primary text-on-primary px-8 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all">
              Browse All Places
            </Link>
          </div>
        ) : (
          <div className="space-y-gutter">
            {filteredPlaces.length > 0 && (
              <div>
                {activeTab === 'all' && <h2 className="font-h2 text-h2 text-on-surface mb-6">Places ({results.places.length})</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {filteredPlaces.map(renderPlace)}
                </div>
              </div>
            )}
            {filteredHotels.length > 0 && (
              <div>
                {activeTab === 'all' && <h2 className="font-h2 text-h2 text-on-surface mb-6">Hotels ({results.hotels.length})</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {filteredHotels.map(renderHotel)}
                </div>
              </div>
            )}
            {filteredPackages.length > 0 && (
              <div>
                {activeTab === 'all' && <h2 className="font-h2 text-h2 text-on-surface mb-6">Packages ({results.packages.length})</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {filteredPackages.map(renderPackage)}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
