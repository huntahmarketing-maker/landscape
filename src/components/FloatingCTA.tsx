import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="tel:8432885870"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-2xl hover:bg-emerald-700 transition-all duration-400 lg:hidden ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <Phone className="w-5 h-5" strokeWidth={2.5} />
      Call Now
    </a>
  );
}
