import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/37785078/pexels-photo-37785078.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Stone patio surrounded by greenery',
    label: 'Stone Patio',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    src: 'https://images.pexels.com/photos/12763046/pexels-photo-12763046.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Rustic stone retaining wall',
    label: 'Retaining Wall',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/13871296/pexels-photo-13871296.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Patio with fire pit and pergola',
    label: 'Fire Pit Area',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/13871294/pexels-photo-13871294.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Wooden gazebo in garden',
    label: 'Garden Structure',
    span: 'lg:col-span-2',
  },
  {
    src: 'https://images.pexels.com/photos/17312058/pexels-photo-17312058.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Manicured garden with lush greenery',
    label: 'Garden Design',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/18288723/pexels-photo-18288723.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Garden pond with waterfall',
    label: 'Water Feature',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/34997078/pexels-photo-34997078.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Aerial view of tropical garden design',
    label: 'Full Yard Design',
    span: '',
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold uppercase tracking-wide">
            Our Work
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-sand-900">
            Project Gallery
          </h2>
          <p className="mt-4 text-lg text-sand-600 leading-relaxed">
            A selection of the landscapes and hardscapes we've built for clients across the Grand Strand.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.label}
              className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-white font-semibold text-lg drop-shadow-lg">
                  {img.label}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
