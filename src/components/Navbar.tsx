import { useEffect, useState } from 'react';
import { Menu, X, Phone, Leaf } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-sand-50/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className={`p-2 rounded-xl transition-colors duration-300 ${scrolled ? 'bg-emerald-700' : 'bg-white/15 backdrop-blur-sm'}`}>
            <Leaf className="w-6 h-6 text-emerald-300" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-emerald-800' : 'text-white'}`}>
              Emerald
            </span>
            <span className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${scrolled ? 'text-sand-600' : 'text-emerald-100'}`}>
              Landscaping & Hardscaping
            </span>
          </div>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  scrolled
                    ? 'text-sand-700 hover:bg-emerald-50 hover:text-emerald-700'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:8432885870"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              scrolled
                ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md hover:shadow-lg'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 shadow-md'
            }`}
          >
            <Phone className="w-4 h-4" strokeWidth={2.5} />
            (843) 288-5870
          </a>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className={`w-6 h-6 ${scrolled ? 'text-emerald-800' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? 'text-emerald-800' : 'text-white'}`} />
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-sand-50 border-t border-sand-200 shadow-lg animate-fade-in-down">
          <ul className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-sand-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="tel:8432885870"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
              >
                <Phone className="w-5 h-5" strokeWidth={2.5} />
                (843) 288-5870
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
