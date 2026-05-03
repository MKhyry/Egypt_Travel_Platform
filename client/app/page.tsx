'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { placesAPI, packagesAPI } from '@/lib/api';

const destinations = [
  { name: 'Cairo', subtitle: 'The Mother of the World', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755983/Cairo_dvivf7.jpg' },
  { name: 'Giza', subtitle: 'Home of the Great Pyramids', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755983/giza_wy17tt.jpg' },
  { name: 'Alexandria', subtitle: 'The Pearl of the Mediterranean', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755982/alexandria_eoh6wq.jpg' },
  { name: 'Luxor', subtitle: "The World's Largest Open Air Museum", image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755983/luxor_n2lgfm.jpg' },
  { name: 'Aswan', subtitle: 'Gateway to Nubia', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755982/Aswan_f5v2bd.jpg' },
  { name: 'Hurghada', subtitle: 'Red Sea Paradise', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755983/hurghada_ouqwdi.jpg' },
  { name: 'Sharm El Sheikh', subtitle: 'Diving Capital of Egypt', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755982/sharm_f2c6qa.jpg' },
  { name: 'Farafra', subtitle: 'Gateway to the White Desert', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755982/farafra_jg1ipt.jpg' },
  { name: 'Siwa', subtitle: 'Oasis of the Mountain', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755983/siwa_j7aval.jpg' },
  { name: 'Dahab', subtitle: 'Bohemian Red Sea Haven', image: 'https://res.cloudinary.com/dvkzvgdj5/image/upload/v1777755983/dahab_dnmepo.jpg' },
];

const packages = [
  { title: 'Ancient Wonders Tour', description: 'Follow the path of pharaohs from the Giza plateau to the hidden tombs of Luxor.', days: 7, price: '$1,890', tags: ['Heritage', 'Luxury'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0XoEusnRJ-BU1XWbCYaMTS7Pg7Sg1sOrWiw13bAaaeFjosZ2iecq-M29xxtPJnLxGVUlM0u59Lasc_DWaG7i4M0wFjZ3xNVEfNV4msbmkiCn6SzHOA9di28X8c54AhZD_0jIt_XpeyYHvXjevV8cpokjTS5BmhqqibZjEmP2RXEE9AMY3l7TvGoSLMVLfqZ7sb7c0BiMtlpzOBcdS0PE2DLNDmiZmyQThk3nO-hY_J1QLdQqjIJjaUWHYWvhJtjKkccp59gagMvc' },
  { title: 'Nile & Red Sea Escape', description: 'The perfect blend of historical exploration and the turquoise tranquility of Sharm.', days: 10, price: '$2,450', tags: ['Coastal', 'Relax'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHegEuZ7OVgtflLBBJ3EM9N171POXQeePLnNciFllvhrIx404grsu35VksYrWM0tsevzb0usFR9wt_Wq4ye6DP8xga12oMWn3qBzXZxZivkz5pFRoBqv_8MBf72OmsoI2rzJamhCwqvgZI1u09GVvwIGaxX61RuDwUwfDpNWReyW-liYb_sS3aZ5rBpj1RM3R4zLXracXJn-NYSZanhJGjSSPkLKiLuxhkU5KCFyBapMC99stHLWAsSq4Cr192j0mCo4-nfJxnf2k' },
  { title: 'Cairo City Essence', description: "A deep dive into Cairo's layers, from Coptic churches to Islamic citadels and Pyramids.", days: 5, price: '$980', tags: ['Short Break', 'Urban'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRk2xSNXCYAJ7vzZ2M4azZ78I-gQyrbLG3dY5l-1DqsnwI_bEiNKKcu2XrHkgV1A-QOtEpfgraYX1gTvubxsv5880ctTiIYShM3RHpv7DkbVYwSggZ2lh97X5zy6F8PYnNA-_5VJjRZWTF4F9xDPdgvP-ckF2nyFbbiUjL6FiaQ6iQBhSPpfUvf0TkICTy8PAYJENDGFnT6pi7kboHzSDFpEi7ioprCwZXMkhqpsHD6plIbFIRQYzL5q6nQXMwb4fYnjjKvVhBXI' },
];

export default function HomePage() {
  const router = useRouter();
  const [topPlaces, setTopPlaces] = useState<any[]>([]);
  const [homePackages, setHomePackages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  useEffect(() => {
    placesAPI.getAll()
      .then((res) => {
        const sorted = res.data.data
          .sort((a: any, b: any) => b.rating - a.rating)
          .slice(0, 3);
        setTopPlaces(sorted);
      })
      .catch(() => {});

    packagesAPI.getAll()
      .then((res) => setHomePackages(res.data.data.slice(0, 3)))
      .catch(() => setHomePackages([]));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <MainLayout showFooter={false}>

      {/* ── Hero ── */}
      <section className="relative h-[870px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8yJCG_yGTTQ4L_k3tACmYx1XEMSi-e__WNlOaz8IjhcCPhElXkl1_7xad3EuMKZF-JSWD1_XWTLrItWyL7R9hUcJHjCVzfWL99VwDlNiFE4Dwehz-h-0hfxN_smIAMgy5gdKpLnUW82RasX7Ru3ucKyd2yDIw27AwetX-Cl5Tr38TVmphaw3SRXNhRqOiZDw7uH71FbNCtOMCf-obPa72RNN6im4Txcb-ugkXvGW-tgnPZ_pNTfftOS2T8axHL-Mo9gxymBa_92E" alt="Pyramids" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-4xl px-8 text-center text-white">
          <h1 className="font-h1 text-h1 mb-6 drop-shadow-lg">Whispers of the Eternal Nile</h1>
          <p className="font-body-lg text-body-lg mb-10 text-stone-100 max-w-2xl mx-auto opacity-90">
            Experience the monumental weight of history and the effortless luxury of contemporary Egyptian travel.
          </p>
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mb-8">
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-stone-200">
              <span className="material-symbols-outlined text-primary mr-3">location_on</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent border-none focus:ring-0 text-stone-800 font-body-md placeholder:text-stone-400 focus:outline-none"
                placeholder="Where to, explorer?"
                type="text"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#C5A059] text-white px-10 py-3 rounded-lg font-bold font-label-caps hover:bg-primary transition-all active:scale-95 flex items-center justify-center"
            >
              START PLANNING
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Cairo', 'Luxor', 'Aswan', 'Sharm El Sheikh'].map((city) => (
              <Link key={city} href={`/explore?city=${city}`} className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-[6px] rounded-full text-sm font-medium hover:bg-white/20 transition-all">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="py-stack-lg bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-primary font-label-caps text-label-caps tracking-widest uppercase mb-2 block">Curated Collections</span>
              <h2 className="font-h2 text-h2 text-on-surface">Popular Destinations</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="p-2 border border-outline rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button onClick={() => scroll('right')} className="p-2 border border-outline rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div ref={scrollContainerRef} className="flex overflow-x-auto hide-scrollbar gap-gutter pb-8 px-8">
            {destinations.map((dest) => (
              <Link key={dest.name} href={`/explore?city=${dest.name}`} className="min-w-[320px] md:min-w-[400px] group cursor-pointer">
                <div className="relative h-[500px] overflow-hidden rounded-xl shadow-sm transition-all group-hover:shadow-xl">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-h3 text-h3 mb-1">{dest.name}</h3>
                    <p className="text-stone-300 font-body-md text-body-md">{dest.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Experiences ── */}
      <section className="py-stack-lg bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Centered Header matching image */}
          <div className="text-center mb-10">
            <span className="text-[#c19a6b] font-label-caps text-sm tracking-widest uppercase mb-2 block">
              Handpicked Moments
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-on-surface font-semibold">
              Top Experiences
            </h2>
          </div>

          {/* Asymmetric Grid Layout: 3 Columns, 2 Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 min-h-[600px] lg:h-[650px]">
            {topPlaces.length === 0
              ? [0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className={`bg-surface-container-high rounded-2xl animate-pulse ${
                      i === 0 
                        ? 'col-span-1 lg:col-span-2 lg:row-span-2 min-h-[400px]' 
                        : 'col-span-1 lg:col-span-1 min-h-[250px]'
                    }`}
                  />
                ))
              : topPlaces.slice(0, 3).map((place, index) => {
                  const isFeatured = index === 0;

                  return (
                    <article 
                      key={place._id} 
                      className={`relative rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow duration-300 ${
                        isFeatured 
                          ? 'col-span-1 lg:col-span-2 lg:row-span-2 min-h-[400px] lg:min-h-full' 
                          : 'col-span-1 lg:col-span-1 min-h-[250px] lg:min-h-full'
                      }`}
                    >
                      {/* Background Image */}
                      <img 
                        src={place.images?.[0] || 'https://placehold.co/800x600?text=No+Image'} 
                        alt={place.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      
                      {/* Dark Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Content Container */}
                      <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                        
                        {/* Featured item gets the styled badge and full description */}
                        {isFeatured ? (
                          <>
                            <span className="bg-[#c19a6b] text-white text-[10px] font-bold px-3 py-[6px] rounded-full uppercase tracking-widest w-fit mb-4">
                              {place.category}
                            </span>
                            <h3 className="font-serif text-3xl lg:text-4xl text-white font-bold mb-3">
                              {place.name}
                            </h3>
                            <p className="text-gray-200 text-sm lg:text-base line-clamp-2 max-w-md mb-6">
                              {place.description}
                            </p>
                            <Link href={`/place/${place._id}`} className="text-[#c19a6b] font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm group/link">
                              Explore Experience 
                              <span className="material-symbols-outlined text-base transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                            </Link>
                          </>
                        ) : (
                          /* Smaller items get simplified content matching image */
                          <>
                            <h3 className="font-serif text-2xl text-white font-bold mb-1">
                              {place.name}
                            </h3>
                            <p className="text-gray-300 text-xs md:text-sm">
                              {place.category || place.city}
                            </p>
                            {/* Invisible link wrapper so the whole card is still clickable if needed */}
                            <Link href={`/place/${place._id}`} className="absolute inset-0 z-10" aria-label={`View details for ${place.name}`} />
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ── Featured Packages ── */}
      <section className="py-stack-lg bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-primary font-label-caps text-label-caps tracking-widest uppercase mb-2 block">Ready-Made Journeys</span>
              <h2 className="font-h2 text-h2 text-on-surface">Featured Packages</h2>
            </div>
            <Link href="/trips" className="text-primary font-bold hover:underline font-body-md">
              View All Trips
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {homePackages.length === 0
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="bg-surface-container-high rounded-xl h-96 animate-pulse" />
                ))
              : homePackages.map((pkg) => (
                  <Link key={pkg._id} href={`/trips/${pkg._id}`} className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-lg transition-all duration-300 block">
                    <div className="h-64 relative">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-primary font-bold text-sm">
                        {pkg.days} Days
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-[2px] rounded-full uppercase tracking-widest">{pkg.tier}</span>
                      </div>
                      <h3 className="font-h3 text-h3 mb-4 text-on-surface">{pkg.title}</h3>
                      <p className="text-on-surface-variant mb-6 text-sm font-body-md line-clamp-2">{pkg.description}</p>
                      <div className="flex justify-between items-center pt-6 border-t border-stone-100">
                        <div>
                          <span className="text-xs text-stone-400 block uppercase font-bold tracking-tighter">Starting from</span>
                          <span className="text-xl font-h3 text-primary">${pkg.price.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#C5A059] text-white p-3 rounded-lg active:scale-95 transition-transform">
                          <span className="material-symbols-outlined">calendar_today</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-stone-100 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
          <div className="col-span-1">
            <div className="text-xl font-h1 text-[#C5A059] uppercase tracking-tighter mb-6">Kemet Travel</div>
            <p className="font-body-md text-body-md text-stone-500 mb-6">Redefining Egyptian heritage travel with modern luxury and ancient expertise.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">social_leaderboard</span></a>
              <a href="#" className="text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">camera</span></a>
              <a href="#" className="text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
          {[
            { title: 'Travel Styles', links: ['Curated Tours', 'Nile Cruises', 'Archaeology', 'Luxury Stays'] },
            { title: 'Company', links: ['Our Story', 'Expert Guides', 'Safety Protocols', 'Contact Us'] },
            { title: 'Support', links: ['Privacy', 'Terms', 'FAQ', 'Booking Policy'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">{col.title}</h4>
              <ul className="space-y-4 font-body-md text-stone-500">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="hover:text-[#C5A059] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-200 py-8 text-center">
          <p className="text-sm tracking-wide text-stone-400">2024 Kemet Heritage Travel. Experience the timeless sands.</p>
        </div>
      </footer>

    </MainLayout>
  );
}
