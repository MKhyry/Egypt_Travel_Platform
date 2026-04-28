'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { placesAPI, tripsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';

const CATEGORIES = ['historical', 'nature', 'beach', 'adventure', 'cultural'];
const CITIES = ['Cairo', 'Giza', 'Luxor', 'Aswan', 'Alexandria', 'Sharm El Sheikh', 'Hurghada', 'Farafra', 'Siwa'];

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { trips, fetchTrips } = useTripStore();

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('rating');

  // Add to trip modal state
  const [modalPlace, setModalPlace] = useState<any>(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    placesAPI.getAll({ city: city || undefined, category: category || undefined })
      .then((res) => {
        let data = res.data.data;
        if (sort === 'rating') data = data.sort((a: any, b: any) => b.rating - a.rating);
        if (sort === 'duration') data = data.sort((a: any, b: any) => a.visitDuration - b.visitDuration);
        setPlaces(data);
      })
      .catch(() => setPlaces([]))
      .finally(() => setIsLoading(false));
  }, [city, category, sort]);

  const handleAddToTrip = async () => {
    if (!selectedTripId) return;
    setAddLoading(true);
    try {
      await tripsAPI.addPlace(selectedTripId, { placeId: modalPlace._id, day: selectedDay });
      setAddSuccess(`Added to your trip!`);
      setTimeout(() => { setModalPlace(null); setAddSuccess(''); }, 1500);
    } catch (err: any) {
      setAddSuccess(err?.response?.data?.message || 'Failed to add');
    } finally {
      setAddLoading(false);
    }
  };

  const openModal = (place: any) => {
    if (!user) { router.push('/login'); return; }
    setModalPlace(place);
    setSelectedTripId(trips[0]?._id || '');
    setSelectedDay(1);
    setAddSuccess('');
  };

  return (
    <MainLayout>

      {/* ── Add to Trip Modal ── */}
      {modalPlace && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">Add to Trip</h3>
                <p className="text-sm text-on-surface-variant mt-1">{modalPlace.name}</p>
              </div>
              <button onClick={() => setModalPlace(null)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-4xl text-outline-variant">luggage</span>
                <p className="font-body-md text-on-surface-variant mt-3 mb-6">You have no trips yet. Create one first.</p>
                <Link href="/my-trip" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all">
                  Create a Trip
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Select Trip</label>
                    <select
                      value={selectedTripId}
                      onChange={(e) => setSelectedTripId(e.target.value)}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                    >
                      {trips.map((t: any) => (
                        <option key={t._id} value={t._id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Day</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(Number(e.target.value))}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                        <option key={d} value={d}>Day {d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {addSuccess && (
                  <p className={`text-sm mb-4 font-body-md ${addSuccess.includes('Added') ? 'text-secondary' : 'text-error'}`}>
                    {addSuccess}
                  </p>
                )}

                <button
                  onClick={handleAddToTrip}
                  disabled={addLoading}
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-60 font-label-caps tracking-widest uppercase"
                >
                  {addLoading ? 'Adding...' : 'Confirm'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <header className="relative bg-surface-container-lowest pt-stack-lg pb-stack-md px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d1c5b4 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em] mb-4 block">Destination Spotlight</span>
          <h1 className="font-h1 text-h1 text-on-surface mb-4 max-w-3xl">
            {city ? `Discover ${city}` : 'Explore All of Egypt'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            From ancient pharaohs to vibrant contemporary culture — find the perfect places for your journey.
          </p>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <main className="max-w-7xl mx-auto px-8 py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter items-start">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 space-y-stack-md bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-high sticky top-28">

            {/* City Pills */}
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface mb-4 border-b border-outline-variant pb-2">City</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCity('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${city === '' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  All
                </button>
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${city === c ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface mb-4 border-b border-outline-variant pb-2">Category</h3>
              <div className="space-y-3">
                {['', ...CATEGORIES].map((cat) => (
                  <label key={cat || 'all'} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} className="text-primary focus:ring-primary h-5 w-5" />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors capitalize">
                      {cat || 'All'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setCity(''); setCategory(''); }}
              className="w-full border border-outline-variant text-on-surface-variant py-2 rounded-lg text-sm font-label-caps tracking-widest uppercase hover:bg-surface-container transition-colors"
            >
              Reset Filters
            </button>
          </aside>

          {/* ── Listings ── */}
          <div className="lg:col-span-3 space-y-gutter">
            {/* Sort Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-surface-container-low p-4 rounded-xl gap-4">
              <p className="font-body-md text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">{places.length} places</span>
                {city && <span> in <span className="font-bold text-on-surface">{city}</span></span>}
              </p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">sort</span>
                <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Sort:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-none text-primary font-bold focus:ring-0 cursor-pointer focus:outline-none">
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Shortest Visit</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high animate-pulse">
                    <div className="h-64 bg-surface-container-high" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-surface-container-high rounded w-3/4" />
                      <div className="h-4 bg-surface-container-high rounded w-full" />
                      <div className="h-10 bg-surface-container-high rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
                <p className="font-h3 text-h3 text-on-surface-variant mt-4">No places found</p>
                <p className="font-body-md text-on-surface-variant mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {places.map((place) => (
                  <article key={place._id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-surface-container-high flex flex-col group hover:shadow-md transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <img src={place.images?.[0] || 'https://placehold.co/400x300?text=No+Image'} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-sm font-bold text-on-surface">{place.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-inverse-surface/80 text-inverse-on-surface text-xs px-3 py-1 rounded-full font-label-caps tracking-widest">
                        ~{place.visitDuration}h visit
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="font-h3 text-h3 text-on-surface">{place.name}</h2>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {place.city}
                            <span className="ml-2 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">{place.category}</span>
                          </p>
                        </div>
                      </div>
                      <p className="font-body-md text-on-surface-variant mb-6 flex-grow text-sm line-clamp-2">{place.description}</p>
                      <div className="flex items-center gap-gutter">
                        {/* Add to Trip */}
                        <button
                          onClick={() => openModal(place)}
                          className="flex-grow bg-primary text-on-primary font-bold py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition-all text-sm"
                        >
                          Add to Trip
                        </button>
                        {/* View Details */}
                        <Link
                          href={`/place/${place._id}`}
                          className="p-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary-container transition-colors"
                        >
                          <span className="material-symbols-outlined block">visibility</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}