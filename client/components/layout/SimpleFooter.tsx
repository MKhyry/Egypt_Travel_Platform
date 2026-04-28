import Link from 'next/link';

export default function SimpleFooter() {
  return (
    <footer className="border-t border-outline-variant/30 bg-surface-container-low py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-h3 text-primary italic tracking-widest uppercase" style={{ fontSize: '18px' }}>
          Kemet Travel
        </span>
        <div className="flex items-center gap-6 text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider">
          <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          <Link href="/trips" className="hover:text-primary transition-colors">Trips</Link>
          <Link href="/my-trip" className="hover:text-primary transition-colors">My Trip</Link>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <p className="text-[10px] font-label-caps text-on-surface-variant/50 tracking-widest uppercase">
          © 2024 Kemet Luxury Travel
        </p>
      </div>
    </footer>
  );
}