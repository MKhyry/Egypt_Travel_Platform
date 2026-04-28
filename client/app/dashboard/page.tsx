'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';
import SimpleFooter from '@/components/layout/SimpleFooter';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { trips, fetchTrips } = useTripStore();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchTrips();
  }, [user]);

  const upcomingTrips = trips.filter((t: any) => t.status !== 'completed');
  const completedTrips = trips.filter((t: any) => t.status === 'completed');

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const stats = [
    { icon: 'luggage', label: 'Total Trips', value: trips.length },
    { icon: 'location_on', label: 'Places Saved', value: trips.reduce((a: number, t: any) => a + (t.places?.length || 0), 0) },
    { icon: 'check_circle', label: 'Completed', value: completedTrips.length },
    { icon: 'schedule', label: 'Upcoming', value: upcomingTrips.length },
  ];

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-8 py-stack-lg">

        {/* ── Welcome Header ── */}
        <section className="mb-stack-lg">
          <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase block mb-2">Your Account</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-h1 text-h1 text-on-surface">Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">{user?.email}</p>
            </div>
            <Link href="/my-trip" className="bg-primary text-on-primary px-8 py-3 font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 inline-flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              New Trip
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-stack-lg">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high text-center" style={{ boxShadow: '0 10px 30px -10px rgba(50,100,125,0.1)' }}>
              <span className="material-symbols-outlined text-primary text-3xl mb-3 block">{s.icon}</span>
              <p className="font-h2 text-h2 text-on-surface">{s.value}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── My Trips ── */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-h2 text-h2 text-on-surface">My Trips</h2>
              <Link href="/my-trip" className="text-primary font-bold hover:underline font-body-md">View All</Link>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-outline-variant rounded-xl">
                <span className="material-symbols-outlined text-5xl text-outline-variant">luggage</span>
                <p className="font-h3 text-h3 text-on-surface-variant mt-4 mb-4">No trips yet</p>
                <Link href="/my-trip" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all">
                  Plan Your First Trip
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip: any) => (
                  <div key={trip._id} className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high hover:border-primary/20 transition-colors" style={{ boxShadow: '0 10px 30px -10px rgba(50,100,125,0.1)' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-h3 text-on-surface mb-1" style={{ fontSize: '20px' }}>{trip.title}</h3>
                        <p className="text-sm text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">calendar_today</span>
                          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                        </p>
                        <p className="text-sm text-on-surface-variant flex items-center gap-2 mt-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {trip.places?.length || 0} places planned
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          trip.status === 'confirmed' ? 'bg-secondary-container text-on-secondary-container' :
                          trip.status === 'completed' ? 'bg-surface-container-highest text-on-surface-variant' :
                          'bg-primary-fixed text-on-primary-fixed'
                        }`}>
                          {trip.status}
                        </span>
                        <Link href="/my-trip" className="text-primary hover:underline text-sm font-body-md">
                          View Trip
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-gutter">

            {/* Account Details */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high">
              <h3 className="font-h3 text-on-surface mb-4" style={{ fontSize: '20px' }}>Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps uppercase">Name</p>
                    <p className="font-body-md text-on-surface">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps uppercase">Email</p>
                    <p className="font-body-md text-on-surface">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-inverse-surface rounded-xl p-6 text-white">
              <h3 className="font-h3 mb-4" style={{ fontSize: '20px' }}>Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { href: '/explore', icon: 'explore', label: 'Explore Places' },
                  { href: '/trips', icon: 'card_travel', label: 'Browse Packages' },
                  { href: '/hotels', icon: 'hotel', label: 'Find Hotels' },
                  { href: '/my-trip', icon: 'add_circle', label: 'Plan a Trip' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group">
                    <span className="material-symbols-outlined text-primary-fixed group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-body-md text-sm">{item.label}</span>
                    <span className="material-symbols-outlined text-sm ml-auto text-inverse-on-surface/40">chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}