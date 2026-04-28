'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import SimpleFooter from '@/components/layout/SimpleFooter';
import { placesAPI, tripsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';


export default function PlaceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { trips, fetchTrips } = useTripStore();

  const [place, setPlace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    placesAPI.getById(id as string)
      .then((res) => setPlace(res.data.data))
      .catch(() => router.push('/explore'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const openModal = () => {
    if (!user) { router.push('/login'); return; }
    setShowModal(true);
    setSelectedTripId(trips[0]?._id || '');
    setAddSuccess('');
  };

  const handleAddToTrip = async () => {
    if (!selectedTripId) return;
    setAddLoading(true);
    try {
      await tripsAPI.addPlace(selectedTripId, { placeId: place._id, day: selectedDay });
      setAddSuccess('Added to your trip!');
      setTimeout(() => { setShowModal(false); setAddSuccess(''); }, 1500);
    } catch (err: any) {
      setAddSuccess(err?.response?.data?.message || 'Failed to add');
    } finally {
      setAddLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-8 pt-12 animate-pulse space-y-8">
          <div className="h-[600px] bg-surface-container-high rounded-xl" />
          <div className="h-12 bg-surface-container-high rounded w-1/2" />
          <div className="h-6 bg-surface-container-high rounded w-1/3" />
        </div>
      </MainLayout>
    );
  }

  if (!place) return null;

  return (
    <MainLayout>

      {/* ── Add to Trip Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">Add to Trip</h3>
                <p className="text-sm text-on-surface-variant mt-1">{place.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-4xl text-outline-variant">luggage</span>
                <p className="font-body-md text-on-surface-variant mt-3 mb-6">No trips yet. Create one first.</p>
                <Link href="/my-trip" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg">
                  Create a Trip
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Select Trip</label>
                    <select value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container">
                      {trips.map((t: any) => <option key={t._id} value={t._id}>{t.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Day</label>
                    <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container">
                      {[1,2,3,4,5,6,7,8,9,10].map((d) => <option key={d} value={d}>Day {d}</option>)}
                    </select>
                  </div>
                </div>
                {addSuccess && (
                  <p className={`text-sm mb-4 font-body-md ${addSuccess.includes('Added') ? 'text-secondary' : 'text-error'}`}>
                    {addSuccess}
                  </p>
                )}
                <button onClick={handleAddToTrip} disabled={addLoading} className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-60 font-label-caps tracking-widest uppercase">
                  {addLoading ? 'Adding...' : 'Confirm'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-8 pt-12 pb-stack-lg">

        {/* ── Image Gallery ── */}
        <div className="grid grid-cols-12 gap-gutter h-[600px] mb-stack-md overflow-hidden rounded-xl">
          <div className="col-span-8 h-full relative group cursor-pointer overflow-hidden">
            <img
              src={place.images?.[0] || 'https://placehold.co/800x600?text=No+Image'}
              alt={place.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="col-span-4 grid grid-rows-2 gap-gutter h-full">
            {[1, 2].map((i) => (
              <div key={i} className="relative group cursor-pointer overflow-hidden rounded-lg">
                <img
                  src={place.images?.[i] || place.images?.[0] || 'https://placehold.co/400x300'}
                  alt={`${place.name} ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {i === 1 && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-label-caps border border-white px-4 py-2 rounded-full">View Photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Header Info & Actions ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-gutter mb-stack-lg border-b border-outline-variant pb-stack-md">
          <div>
            <div className="flex items-center space-x-2 mb-base">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps font-bold uppercase">
                {place.category}
              </span>
              <div className="flex items-center text-primary ml-4">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="ml-1 font-bold text-body-md">{place.rating}</span>
              </div>
            </div>
            <h1 className="font-h1 text-h1 text-on-surface mb-2">{place.name}</h1>
            <div className="flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined mr-1">location_on</span>
              <span className="font-body-lg">{place.city}, Egypt</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={openModal}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-caps flex items-center space-x-2 shadow-lg shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span>ADD TO TRIP</span>
            </button>
            <Link
              href="/explore"
              className="border border-secondary text-secondary px-6 py-4 rounded-xl font-label-caps flex items-center space-x-2 hover:bg-secondary-container/10 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>BACK</span>
            </Link>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-12 gap-12">

          {/* ── Left Column ── */}
          <div className="col-span-12 lg:col-span-8">

            {/* Description */}
            <section className="mb-stack-lg">
              <h2 className="font-h2 text-h2 mb-stack-sm">About This Place</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {place.description}
              </p>
            </section>

            {/* Practical Info */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
                <div className="flex items-center space-x-3 mb-stack-sm text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                  <span className="font-label-caps text-label-caps">VISIT DURATION</span>
                </div>
                <p className="font-body-md font-bold">~{place.visitDuration} hours</p>
                <p className="text-sm text-on-surface-variant mt-1">Recommended time</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
                <div className="flex items-center space-x-3 mb-stack-sm text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                  <span className="font-label-caps text-label-caps">LOCATION</span>
                </div>
                <p className="font-body-md font-bold">{place.city}</p>
                <p className="text-sm text-on-surface-variant mt-1">Egypt</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
                <div className="flex items-center space-x-3 mb-stack-sm text-primary">
                  <span className="material-symbols-outlined">category</span>
                  <span className="font-label-caps text-label-caps">CATEGORY</span>
                </div>
                <p className="font-body-md font-bold capitalize">{place.category}</p>
                <p className="text-sm text-on-surface-variant mt-1">Experience type</p>
              </div>
            </section>

            {/* Tips */}
            {place.tips?.length > 0 && (
              <section className="mb-stack-lg">
                <h2 className="font-h2 text-h2 mb-stack-sm">Traveler Tips</h2>
                <div className="space-y-4">
                  {place.tips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{i + 1}</span>
                      </div>
                      <p className="font-body-md text-on-surface-variant">{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="col-span-12 lg:col-span-4 space-y-gutter">

            {/* Location Map Placeholder */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30">
              <div className="h-48 bg-surface-container-high flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d1c5b4 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div className="text-center relative z-10">
                  <span className="material-symbols-outlined text-4xl text-primary">map</span>
                  <p className="font-label-caps text-on-surface-variant mt-2">
                    {place.location?.lat?.toFixed(4)}, {place.location?.lng?.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-h3 text-h3 text-on-surface mb-2">Location</h3>
                <p className="font-body-md text-on-surface-variant">{place.city}, Egypt</p>
              </div>
            </div>

            {/* Quick Add CTA */}
            <div className="bg-inverse-surface rounded-xl p-6 text-white">
              <h3 className="font-h3 text-h3 mb-2">Ready to visit?</h3>
              <p className="font-body-md text-inverse-on-surface/70 mb-6 text-sm">
                Add this place to your trip itinerary and start planning your perfect day.
              </p>
              <button
                onClick={openModal}
                className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95"
              >
                Add to My Trip
              </button>
            </div>

            {/* Back to Explore */}
            <Link
              href="/explore"
              className="flex items-center justify-center gap-2 w-full border border-outline-variant text-on-surface-variant py-3 rounded-xl hover:bg-surface-container transition-colors font-body-md"
            >
              <span className="material-symbols-outlined">explore</span>
              Discover More Places
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}