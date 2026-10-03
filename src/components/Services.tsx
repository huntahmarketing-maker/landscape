import { Sprout, BrickWall, Trees, Droplets, Scissors, Flame } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const services = [
  {
    icon: Sprout,
    title: 'Landscape Design',
    description: 'Custom garden beds, plant selection, and full-yard design plans tailored to your property and lifestyle.',
    image: 'https://images.pexels.com/photos/16327475/pexels-photo-16327475.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: BrickWall,
    title: 'Hardscape Installation',
    description: 'Patios, walkways, driveways, and retaining walls built with premium stone and paver materials.',
    image: 'https://images.pexels.com/photos/11866592/pexels-photo-11866592.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Trees,
    title: 'Tree & Shrub Care',
    description: 'Pruning, trimming, removal, and health assessments to keep your landscape safe and beautiful.',
    image: 'https://images.pexels.com/photos/29821815/pexels-photo-29821815.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Droplets,
    title: 'Irrigation & Drainage',
    description: 'Installation and repair of irrigation systems plus drainage solutions to protect your property.',
    image: 'https://images.pexels.com/photos/9856591/pexels-photo-9856591.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Scissors,
    title: 'Lawn Maintenance',
    description: 'Weekly mowing, edging, fertilization, and weed control for a healthy, manicured lawn all season.',
    image: 'https://images.pexels.com/photos/38194805/pexels-photo-38194805.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Flame,
    title: 'Outdoor Living',
    description: 'Fire pits, outdoor kitchens, pergolas, and seating walls that turn your yard into a living space.',
    image: 'https://images.pexels.com/photos/13871296/pexels-photo-13871296.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-sand-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold uppercase tracking-wide">
            What We Do
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-sand-900">
            Complete Outdoor Services
          </h2>
          <p className="mt-4 text-lg text-sand-600 leading-relaxed">
            From the ground up, we handle every aspect of your landscape and hardscape projects with skill, premium materials, and attention to detail.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Reveal
                key={service.title}
                delay={idx * 100}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-sand-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-emerald-700" strokeWidth={2.2} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-sand-900 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sand-600 leading-relaxed text-[15px]">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16 text-center" delay={200}>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-700 text-white font-semibold text-lg hover:bg-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Request Your Free Quote
          </a>
        </Reveal>
      </div>
    </section>
  );
}
