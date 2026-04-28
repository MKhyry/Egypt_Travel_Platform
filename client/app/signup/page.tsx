'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col"> 
      <main className="flex flex-col md:flex-row flex-1">

        {/* Left — Image Side */}
        <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 bg-inverse-surface overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtlACg03CFW0ydSpAjrkIRhWbc9dzWsxb7vF3p-R06YIafiJoGAHWF9MPQSTrBtSygqRe2GDTECs9-BMDzj3_r8UazaE6WMvMAlSxl8eWH9ZC3duRDbf697zz8pXRcnl67BuZ6yJ7nZnHUSckQZSzni5-6ifvNRdX_lLmTOSXbQyRNw1GJh0JeFbe8yGofEJgFF3xy9dlfD2ht0gw7iY8Au7MJdRVUjO3U2AznOH9K1LHwiXbF3csdmmXGJA_7gcudgXGwTa9AS80"
              alt="Ancient Egyptian temple at sunset"
              className="w-full h-full object-cover opacity-80 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col justify-end p-margin-desktop text-white">
            <div className="mb-stack-md">
              <span className="font-label-caps text-primary-fixed uppercase mb-base block">
                Begin Your Journey
              </span>
              <h1 className="font-h1 text-h1 max-w-md">
                The sands of time await your arrival.
              </h1>
            </div>
            <p className="font-body-lg text-body-lg text-surface-container opacity-90 max-w-sm">
              Join an exclusive circle of travelers experiencing the heritage of Egypt through a modern luxury lens.
            </p>
          </div>
        </section>

        {/* Right — Form Side */}
        <section className="flex-1 flex flex-col relative bg-surface">

          {/* Mobile Logo */}
          <div className="md:hidden pt-8 px-margin-mobile">
            <Link href="/" className="text-2xl font-h1 font-bold tracking-tighter text-on-surface">
              KEMET
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-24">
            <div className="w-full max-w-md">

              {/* Header */}
              <div className="mb-stack-lg">
                <Link
                  href="/"
                  className="hidden md:inline-block text-2xl font-h1 font-bold tracking-tighter text-on-surface mb-stack-md"
                >
                  KEMET
                </Link>
                <h2 className="font-h2 text-h2 text-on-surface mt-4">Create Account</h2>
                <p className="font-body-md text-on-surface-variant mt-2">
                  Enter your details to start your luxury voyage.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 px-4 py-3 bg-error-container text-on-error-container text-sm font-body-md rounded">
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">

                  {/* Name */}
                  <div className="group">
                    <label
                      className="block font-label-caps text-on-surface-variant mb-2"
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Alexander Rostova"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-4 py-3 font-body-md transition-all duration-300 focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label
                      className="block font-label-caps text-on-surface-variant mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="traveler@heritage.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-4 py-3 font-body-md transition-all duration-300 focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label
                      className="block font-label-caps text-on-surface-variant mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="········"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-4 py-3 font-body-md transition-all duration-300 focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label
                      className="block font-label-caps text-on-surface-variant mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="········"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-4 py-3 font-body-md transition-all duration-300 focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 space-y-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-tertiary text-on-tertiary py-4 font-label-caps text-sm tracking-widest uppercase hover:bg-tertiary-container transition-all duration-300 shadow-lg active:scale-[0.98] disabled:opacity-60"
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </button>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-outline-variant/30" />
                    <span className="font-label-caps text-[10px] text-outline">OR</span>
                    <div className="h-px flex-1 bg-outline-variant/30" />
                  </div>

                  <div className="text-center">
                    <p className="font-body-md text-on-surface-variant">
                      Already have an account?{' '}
                      <Link
                        href="/login"
                        className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-outline-variant/20 flex justify-between items-center opacity-60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="text-[10px] font-label-caps">Secure Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span className="text-[10px] font-label-caps">Privacy Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Egyptian Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none egyptian-pattern" />
        </section>
      </main>
        {/* Footer sits BELOW the two columns */}
        <footer className="w-full py-8 px-6 md:px-12 bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-label-caps text-outline uppercase tracking-wider border-t border-outline-variant/10">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Help Center</a>
          </div>
          <div>2024 Kemet Luxury Travel. All rights reserved.</div>
        </footer>
      </div>
  );
}