import { Check, Award, Users, Leaf, Truck } from 'lucide-react';

import { Reveal } from '@/components/Reveal';

const features = [
  'Licensed and fully insured',
  'Free on-site consultations',
  'Premium materials and plants',
  'Transparent, upfront pricing',
  'Timely project completion',
  'Satisfaction guaranteed',
];

const values = [
  { icon: Award, title: 'Quality Craftsmanship', text: 'Every project is held to the highest standard — from base preparation to final cleanup.' },
  { icon: Users, title: 'Reliable Team', text: 'Friendly, uniformed professionals who show up on time and respect your property.' },
  { icon: Leaf, title: 'Local Expertise', text: 'We know the coastal climate, soil, and plants that thrive in the Grand Strand.' },
  { icon: Truck, title: 'Full-Service', text: 'One company for design, installation, and maintenance — no finger-pointing between contractors.' },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-sand-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal animation="slide-in-left">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/29226332/pexels-photo-29226332.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Beautiful garden landscape"
                className="rounded-3xl shadow-2xl w-full h-[520px] object-cover"
              />
              <div className="absolute -bottom-8 -right-4 lg:-right-8 w-64 bg-emerald-700 rounded-2xl p-6 shadow-xl text-white">
                <div className="text-2xl font-display font-bold leading-tight">Myrtle Beach<br />& Grand Strand</div>
                <div className="mt-2 text-sm text-emerald-100 leading-relaxed">
                  Proudly serving our local community
                </div>
              </div>
              <div className="absolute -top-6 -left-4 lg:-left-6 w-20 h-20 bg-emerald-300/30 rounded-full blur-2xl" />
            </div>
          </Reveal>

          <Reveal animation="slide-in-right" delay={150}>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold uppercase tracking-wide">
                About Us
              </span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-sand-900 leading-tight">
                Your Trusted Partner for Outdoor Transformation
              </h2>
              <p className="mt-6 text-lg text-sand-600 leading-relaxed">
                Emerald Landscaping & Hardscaping is a locally owned company serving Myrtle Beach and the greater Grand Strand. We've built our reputation one yard at a time — combining horticultural knowledge with masonry skill to create outdoor spaces that last.
              </p>
              <p className="mt-4 text-base text-sand-600 leading-relaxed">
                Whether you need a complete landscape overhaul, a new paver patio, or reliable weekly maintenance, our team treats every property like it's our own.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-700" strokeWidth={3} />
                    </div>
                    <span className="text-sand-700 font-medium text-[15px]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <Reveal key={val.title} delay={idx * 100} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 border border-sand-100">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-emerald-700" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-lg font-bold text-sand-900">{val.title}</h3>
                <p className="mt-2 text-sand-600 text-sm leading-relaxed">{val.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
