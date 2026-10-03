import { Leaf, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const quickLinks = [
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#about', label: 'About Us' },
  { href: '#contact', label: 'Contact' },
];

const serviceLinks = [
  'Landscape Design',
  'Hardscape Installation',
  'Tree & Shrub Care',
  'Irrigation & Drainage',
  'Lawn Maintenance',
  'Outdoor Living',
];

export function Footer() {
  return (
    <footer className="bg-sand-900 text-sand-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-700">
                <Leaf className="w-5 h-5 text-emerald-300" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-bold text-white">Emerald</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-sand-400">
                  Landscaping & Hardscaping
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-sand-400">
              Professional landscape and hardscape services serving Myrtle Beach and the Grand Strand. Bringing your outdoor vision to life with quality and care.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-sand-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Facebook className="w-5 h-5 text-sand-300" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-sand-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Instagram className="w-5 h-5 text-sand-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-sand-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">Our Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-sm text-sand-400 hover:text-emerald-400 transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">Get In Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:8432885870" className="flex items-start gap-3 group">
                  <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm group-hover:text-emerald-400 transition-colors">(843) 288-5870</span>
                </a>
              </li>
              <li>
                <a href="mailto:emeraldlandscapinghardscaping@gmail.com" className="flex items-start gap-3 group">
                  <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm group-hover:text-emerald-400 transition-colors break-all">
                    emeraldlandscapinghardscaping@gmail.com
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Myrtle Beach, SC<br />Serving the Grand Strand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sand-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-sand-500">
            &copy; {new Date().getFullYear()} Emerald Landscaping & Hardscaping. All rights reserved.
          </p>
          <p className="text-sm text-sand-500">Licensed &amp; Insured</p>
        </div>
      </div>
    </footer>
  );
}
