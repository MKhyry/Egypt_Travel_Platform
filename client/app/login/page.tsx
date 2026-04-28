'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      // Read the actual message from the backend response
      const message = err?.response?.data?.message || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">

      {/* Left — Image Side */}
      <section className="hidden md:flex relative w-1/2 lg:w-3/5 items-center justify-center bg-inverse-surface overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt5Q5FqayxlccoJHk41GOWTmmgK7SKNESrs-PFLHEcznJLv9R78qQq5alxzJdBhitjlwxhbGVa83mHJKsu4MQY1F4WUF9KRP_V3OTJyYWbQTmFvNbF-MyiOjuj5uVCAntJ0SZI31qfYJGa8s7yPBAC87LlUPu8GQz9JE6GHsk4z3Ie8E_VwVVoxPwTP7wMfJBvASH2mEqepFVOl5tpuG3kyPI5IlL6SbbauawJMO7XHAkBOIcu9sYKsnVJj1AP4JKDQ4flcXsMuWs"
          alt="The Great Pyramids of Giza at dusk"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent" />
        <div className="relative z-10 px-margin-desktop max-w-2xl text-white">
          <p className="font-label-caps text-label-caps mb-stack-sm tracking-[0.2em] uppercase text-primary-fixed">
            The Ancient Awaits
          </p>
          <h1 className="font-h1 text-h1 mb-stack-md leading-tight">
            Embark on a timeless journey through Egypt.
          </h1>
          <div className="h-1 w-24 bg-primary-container mb-stack-md" />
          <p className="font-body-lg text-body-lg text-surface-container-low/90">
            Experience the monumental heritage of the Nile with the world's most exclusive luxury concierge service.
          </p>
        </div>
        <div className="absolute bottom-12 left-12 flex items-center gap-4 text-surface-container-lowest/60">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-label-caps text-[10px] tracking-widest">KEMET LUXURY TRAVEL</span>
        </div>
      </section>

      {/* Right — Form Side */}
      <section className="flex-1 flex flex-col bg-surface px-6 py-12 md:px-16 lg:px-24 justify-center relative">

        {/* Mobile Logo */}
        <div className="md:hidden absolute top-8 left-8">
          <span className="font-h3 text-h3 text-primary tracking-tighter">Kemet Luxury</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <header className="mb-stack-lg">
            <div className="hidden md:block mb-stack-md">
              <span className="font-h3 text-h3 text-primary tracking-tighter">Kemet Luxury</span>
            </div>
            <h2 className="font-h2 text-h2 mb-2 text-on-surface">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Access your curated itineraries and private experiences.
            </p>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-error-container text-on-error-container text-sm font-body-md rounded">
              {error}
            </div>
          )}

          <form className="space-y-stack-md" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative group">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant/70 block mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="alexander@heritage.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input-luxury w-full py-3 font-body-md text-on-surface placeholder-on-surface-variant/30"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="flex justify-between items-end mb-1">
                <label
                  className="font-label-caps text-label-caps text-on-surface-variant/70"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="font-label-caps text-[11px] text-primary hover:text-tertiary-container transition-colors uppercase tracking-wider"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="············"
                value={formData.password}
                onChange={handleChange}
                className="form-input-luxury w-full py-3 font-body-md text-on-surface placeholder-on-surface-variant/30"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 py-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 rounded-sm border-outline text-primary"
              />
              <label className="font-body-md text-sm text-on-surface-variant" htmlFor="remember">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-caps py-5 rounded-none shadow-lg shadow-tertiary-container/20 transition-all duration-300 active:scale-[0.98] tracking-[0.15em] uppercase disabled:opacity-60"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-col items-center gap-4">
            <p className="font-body-md text-sm text-on-surface-variant">New to Kemet Luxury?</p>
            <Link
              href="/signup"
              className="font-label-caps text-primary border border-primary/30 px-10 py-3 hover:bg-primary/5 transition-all duration-300 tracking-widest uppercase"
            >
              Create Account
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-stack-lg text-center">
            <div className="flex justify-center gap-6 mb-8">
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              </a>
            </div>
            <p className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-[0.2em] uppercase">
              © 2024 Kemet Luxury Travel. All rights reserved.
            </p>
          </footer>
        </div>
      </section>

      {/* Mobile Bottom Image */}
      <div className="md:hidden block">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTjkZpOQi0HlhKgfGmTy9kPAbceQBAEyZT5XrgOfWVPMa9CqRMsb48SoOtbbbf3DkkH3iXZ3aN4oAgD9UlUFcshVqtzJy5NIemwyVn5DQcr8s5IerQL_ftyHdvRHZPLcA1MlzPnhJUWe9C4DNIL_clZZTDKwUvSj7RKvd0fEDw7AJMxGpGJQp0UIyKVOvPGHJEQqRiPNhMKxBD-2SSY-MLrHM8ySOqHW9x7vM4TNbHDEUb4URSyi9tQjXifMoKWn-gFMmvH2awVok"
          alt="The Nile River at dusk"
          className="fixed bottom-0 left-0 w-full h-1/4 object-cover opacity-20 pointer-events-none grayscale"
        />
      </div>
    </main>
  );
}