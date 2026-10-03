import { Phone, Calendar, ChevronDown, Star } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/12220735/pexels-photo-12220735.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Beautifully landscaped garden with manicured lawn"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/50 to-emerald-950/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-down">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium text-white tracking-wide">Trusted by Homeowners Across the Grand Strand</span>
        </div>

        <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Transforming Outdoor Spaces Into
          <span className="block mt-2 bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-300 bg-clip-text text-transparent">
            Lush, Lasting Beauty
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-emerald-50/90 leading-relaxed animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          From precision hardscaping to year-round lawn care, Emerald Landscaping & Hardscaping brings craftsmanship and reliability to every yard we touch in Myrtle Beach and the surrounding Grand Strand.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <a
            href="#contact"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03]"
          >
            <Calendar className="w-5 h-5" strokeWidth={2.5} />
            Get a Free Estimate
          </a>
          <a
            href="tel:8432885870"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
          >
            <Phone className="w-5 h-5" strokeWidth={2.5} />
            (843) 288-5870
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '550ms' }}>
          {[
            { stat: '500+', label: 'Projects Completed' },
            { stat: '100%', label: 'Satisfaction Goal' },
            { stat: 'Free', label: 'Consultations' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-emerald-200">{item.stat}</div>
              <div className="mt-1 text-xs sm:text-sm text-emerald-100/80 uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#services"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors animate-float"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
