'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';
import { tripsAPI, hotelsAPI } from '@/lib/api';

export default function MyTripPage() {
  const router = useRouter();
  const { user, isInitialzing } = useAuthStore();
  const { trips, activeTrip, fetchTrips, fetchTrip, createTrip, removePlace } = useTripStore();

  const [hotels, setHotels] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', startDate: '', endDate: '', notes: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialzing) return;
    if (!user) { router.push('/login'); return; }
    fetchTrips();
  }, [user, isInitialzing]);

  // Refresh trip data when navigating to this page (e.g., from booking confirmation)
  useEffect(() => {
    if (pathname === '/my-trip' && user && !isInitialzing) {
      fetchTrips();
      if (trips.length > 0) fetchTrip(trips[0]._id);
    }
  }, [pathname]);

  useEffect(() => {
    if (trips.length > 0 && !activeTrip) fetchTrip(trips[0]._id);
  }, [trips]);

  useEffect(() => {
    if (activeTrip) {
      hotelsAPI.getSuggestions(activeTrip._id)
        .then((res) => setHotels(res.data.data))
        .catch(() => setHotels([]));
    }
  }, [activeTrip]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);
    try {
      const newTrip = await createTrip(formData);
      await fetchTrip(newTrip._id);
      setShowCreateForm(false);
      setFormData({ title: '', startDate: '', endDate: '', notes: '' });
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || 'Failed to create trip');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRemovePlace = async (placeEntryId: string) => {
    if (!activeTrip) return;
    await removePlace(activeTrip._id, placeEntryId);
  };

  // Group places by day
  const placesByDay = activeTrip?.places?.reduce((acc: any, entry: any) => {
    const day = entry.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {}) || {};

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-8 py-stack-lg">

        {/* ── Trip Selector Header ── */}
        <section className="mb-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-end gap-gutter">
            <div className="space-y-2">
              <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">Private Journey</span>

              {activeTrip ? (
                <>
                  <h1 className="font-h1 text-h1 text-on-surface">{activeTrip.title}</h1>
                  <div className="flex items-center gap-4 text-outline font-body-lg">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      <span>{formatDate(activeTrip.startDate)} — {formatDate(activeTrip.endDate)}</span>
                    </div>
                    <span className="text-outline-variant">•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>{activeTrip.totalDays} Days</span>
                    </div>
                  </div>
                </>
              ) : (
                <h1 className="font-h1 text-h1 text-on-surface">My Trips</h1>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              {/* Trip Switcher */}
              {trips.length > 1 && (
                <select
                  onChange={(e) => fetchTrip(e.target.value)}
                  className="border border-outline-variant text-on-surface px-4 py-3 rounded-lg font-body-md focus:outline-none focus:border-primary-container bg-surface"
                >
                  {trips.map((t: any) => (
                    <option key={t._id} value={t._id}>{t.title}</option>
                  ))}
                </select>
              )}


              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-3 border border-secondary text-secondary font-medium rounded-lg hover:bg-secondary-container transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                New Trip
              </button>
            </div>
          </div>

          {/* Create Trip Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateTrip} className="mt-8 bg-surface-container-lowest border border-surface-container-high rounded-xl p-8 shadow-sm">
              <h3 className="font-h3 text-h3 text-on-surface mb-6">Create New Trip</h3>
              {createError && (
                <p className="text-sm text-error mb-4 bg-error-container px-4 py-2 rounded">{createError}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Trip Title</label>
                  <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="My Dream Egypt Tour" className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Notes (optional)</label>
                  <input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Any special notes..." className="w-full bg-surface-container-low border-b border-outline-variant px-3 py-3 font-body-md focus:outline-none focus:border-primary-container" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={createLoading} className="bg-primary text-on-primary font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-60">
                  {createLoading ? 'Creating...' : 'Create Trip'}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="border border-outline-variant text-on-surface-variant px-6 py-3 rounded-lg hover:bg-surface-container transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ── No Trips State ── */}
        {trips.length === 0 && !showCreateForm && (
          <div className="text-center py-24 border-2 border-dashed border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-6xl text-outline-variant">luggage</span>
            <h2 className="font-h2 text-h2 text-on-surface-variant mt-4 mb-2">No trips yet</h2>
            <p className="font-body-md text-on-surface-variant mb-8">Start planning your Egyptian adventure</p>
            <button onClick={() => setShowCreateForm(true)} className="bg-primary text-on-primary font-bold px-8 py-4 rounded-lg hover:bg-primary/90 transition-all">
              Create My First Trip
            </button>
          </div>
        )}

        {/* ── Trip Content ── */}
        {activeTrip && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

            {/* ── Itinerary (Left) ── */}
            <div className="lg:col-span-7 space-y-stack-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-h2 text-h2 text-on-surface">Itinerary</h2>
                <Link href="/explore" className="flex items-center gap-2 text-primary font-bold hover:underline">
                  <span className="material-symbols-outlined">add_circle</span>
                  Add Places
                </Link>
              </div>

              {/* Days */}
              {Object.keys(placesByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
                <div key={day} className="bg-surface-container-lowest p-gutter rounded-xl border-l-4 border-primary relative shadow-sm" style={{ boxShadow: '0 10px 30px -10px rgba(50,100,125,0.15)' }}>
                  <div className="absolute -left-3 top-6 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    DAY {day}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-h3 text-h3 text-on-surface">Day {day} — {placesByDay[day][0]?.place?.city || 'Egypt'}</h3>
                      <p className="text-outline font-body-md">{placesByDay[day].length} place{placesByDay[day].length > 1 ? 's' : ''} planned</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {placesByDay[day].map((entry: any) => (
                      <div key={entry._id} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-dim flex-shrink-0">
                          <img
                            src={entry.place?.images?.[0] || 'https://placehold.co/64x64?text=?'}
                            alt={entry.place?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-on-surface">{entry.place?.name}</p>
                          <p className="text-sm text-outline capitalize">{entry.place?.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/place/${entry.place?._id}`} className="text-secondary hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">visibility</span>
                          </Link>
                          <button onClick={() => handleRemovePlace(entry._id)} className="text-outline hover:text-error transition-colors">
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Empty Day Prompt */}
              {activeTrip.places.length === 0 && (
                <div className="border-2 border-dashed border-outline-variant p-gutter rounded-xl text-center space-y-2 group cursor-pointer hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-primary text-5xl">add_location_alt</span>
                  <p className="font-bold text-on-surface">Start adding places</p>
                  <p className="text-sm text-outline">Visit the Explore page to add places to your trip</p>
                  <Link href="/explore" className="inline-block mt-4 bg-primary text-on-primary font-bold px-6 py-2 rounded-lg text-sm hover:bg-primary/90 transition-all">
                    Explore Places
                  </Link>
                </div>
              )}
            </div>

            {/* ── Right Sidebar ── */}
            <div className="lg:col-span-5 space-y-stack-md">

              {/* Hotel Suggestions */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">hotel</span>
                    <h2 className="font-h3 text-h3 text-on-surface">Suggested Hotels</h2>
                  </div>
                  <Link
                    href="/hotels"
                    className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Browse All
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>

                {hotels.length === 0 ? (
                  <div className="bg-surface-container-low rounded-xl p-6 text-center border border-outline-variant/20">
                    <span className="material-symbols-outlined text-3xl text-outline-variant">hotel</span>
                    <p className="font-body-md text-on-surface-variant mt-2 text-sm">
                      Add places to your trip to see hotel suggestions for those cities.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hotels.slice(0, 3).map((hotel: any) => (
                      <div key={hotel._id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high shadow-sm flex">
                        <div className="w-28 h-28 flex-shrink-0">
                          <img src={hotel.images?.[0] || 'https://placehold.co/112x112?text=Hotel'} alt={hotel.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex-grow">
                          <h4 className="font-bold text-on-surface text-sm">{hotel.name}</h4>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {hotel.city}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex">
                              {Array.from({ length: hotel.stars }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              ))}
                            </div>
                            <span className="text-primary font-bold text-sm">${hotel.pricePerNight}/night</span>
                          </div>
                          <Link
                            href={`/hotels/${hotel._id}`}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                          >
                            View hotel
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Reserved Hotels */}
              {activeTrip?.hotels && activeTrip.hotels.length > 0 && (
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">hotel</span>
                      <h2 className="font-h3 text-h3 text-on-surface">Reserved Hotels</h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {activeTrip.hotels.map((entry: any) => (
                      <div key={entry._id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high shadow-sm flex">
                        <div className="w-28 h-28 flex-shrink-0">
                          <img src={entry.hotel?.images?.[0] || 'https://placehold.co/112x112?text=Hotel'} alt={entry.hotel?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex-grow">
                          <h4 className="font-bold text-on-surface text-sm">{entry.hotel?.name}</h4>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {entry.hotel?.city}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                            <span>Check-in: {new Date(entry.checkIn).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{entry.nights} night{entry.nights > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex">
                              {Array.from({ length: entry.hotel?.stars || 0 }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              ))}
                            </div>
                            <span className="text-primary font-bold text-sm">${entry.hotel?.pricePerNight}/night</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Trip Summary */}
              <section className="bg-inverse-surface rounded-xl p-6 text-white">
                <h3 className="font-h3 text-h3 mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-inverse-on-surface/70 font-body-md text-sm">Total Days</span>
                    <span className="font-bold">{activeTrip.totalDays}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-inverse-on-surface/70 font-body-md text-sm">Places Planned</span>
                    <span className="font-bold">{activeTrip.places.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-inverse-on-surface/70 font-body-md text-sm">Status</span>
                    <span className="bg-primary-fixed text-on-primary-fixed text-xs font-bold px-3 py-1 rounded-full capitalize">{activeTrip.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-inverse-on-surface/70 font-body-md text-sm">Cities</span>
                    <span className="font-bold text-sm">
                      {[...new Set(activeTrip.places.map((p: any) => p.place?.city).filter(Boolean))].join(', ') || '—'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/booking?tripId=${activeTrip._id}`}
                  className="mt-4 w-full block text-center bg-primary text-on-primary font-bold py-3 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                >
                  Proceed to Booking
                </Link>
              </section>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
