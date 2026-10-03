import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Facebook,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminApp from './AdminApp';

type ModalType = 'booking' | 'quote' | 'chat' | null;
type RequestType = 'booking' | 'quote' | 'chat';

type RequestForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  preferredDate: string;
  timeWindow: string;
  details: string;
};

const serviceOptions = [
  'Landscape design',
  'Lawn & garden care',
  'Outdoor living',
  'Tree & shrub care',
  'Irrigation',
  'Seasonal clean-up',
];

const areas = [
  'Thousand Oaks',
  'Pacific Palisades',
  'Calabasas',
  'Beverly Hills',
  'Malibu',
  'Santa Monica',
  'Los Angeles',
  'Sherman Oaks',
  'Woodland Hills',
];

const serviceCards = [
  {
    number: '01',
    title: 'Landscape design',
    desc: 'Thoughtful plans that bring your vision, style, and property together.',
    image:
      'https://images.pexels.com/photos/10681890/pexels-photo-10681890.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    number: '02',
    title: 'Garden & lawn care',
    desc: 'Reliable weekly and seasonal care that keeps every detail looking its best.',
    image:
      'https://images.pexels.com/photos/4920293/pexels-photo-4920293.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    number: '03',
    title: 'Outdoor living',
    desc: 'Patios, planting, lighting, and the finishing touches made for living outside.',
    image:
      'https://images.pexels.com/photos/31291000/pexels-photo-31291000.png?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    number: '04',
    title: 'Trees & irrigation',
    desc: 'Healthy trees, smart watering, and practical systems that work beautifully.',
    image:
      'https://images.pexels.com/photos/24419877/pexels-photo-24419877.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

const emptyForm: RequestForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  service: serviceOptions[0],
  preferredDate: '',
  timeWindow: 'Morning · 8am–11am',
  details: '',
};

/* ============================================================
   PUBLIC LANDSCAPING WEBSITE
   ============================================================ */

function PublicApp() {
  const [modal, setModal] = useState<ModalType>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const closeModal = () => {
    setModal(null);
    setSubmitted(false);
    setError('');
    setForm(emptyForm);
  };

  const openModal = (type: Exclude<ModalType, null>) => {
    setModal(type);
    setMobileOpen(false);
  };

  const updateForm = (key: keyof RequestForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSending(true);
    setError('');

    const requestType: RequestType = modal ?? 'quote';

    if (supabase) {
      const table =
        requestType === 'booking'
          ? 'appointments'
          : requestType === 'chat'
            ? 'inquiries'
            : 'quote_requests';

      const record =
        requestType === 'booking'
          ? {
              customer_name: form.name,
              email: form.email,
              phone: form.phone,
              address: form.address,
              service: form.service,
              appointment_date: form.preferredDate || null,
              appointment_time: form.timeWindow,
              notes: form.details,
            }
          : requestType === 'chat'
            ? {
                customer_name: form.name,
                email: form.email,
                phone: form.phone,
                message: form.details,
              }
            : {
                customer_name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                service: form.service,
                project_details: form.details,
                message: form.details,
              };

      const { error: insertError } = await supabase
        .from(table)
        .insert(record);

      if (insertError) {
        setError(
          'We could not send that just yet. Please call us at (818) 614-6223 and we will take care of you.'
        );

        setSending(false);
        return;
      }
    }

    setSubmitted(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-sand text-forest">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-forest/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="DMA Landscaping home"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-lime/50">
              <img
                src="/images/761811311_1684522027013823_2683291962426104167_n.jpg"
                alt="DMA Landscaping logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="hidden leading-none sm:block">
              <p className="font-display text-xl tracking-tight">DMA</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
                Landscaping Inc.
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/75 lg:flex">
            <a
              className="transition hover:text-lime"
              href="#services"
            >
              Services
            </a>

            <a
              className="transition hover:text-lime"
              href="#about"
            >
              Why DMA
            </a>

            <a
              className="transition hover:text-lime"
              href="#areas"
            >
              Service areas
            </a>

            <a
              className="transition hover:text-lime"
              href="#contact"
            >
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
              href="tel:18186146223"
            >
              <Phone size={16} />
              (818) 614-6223
            </a>

            <button
              onClick={() => openModal('booking')}
              className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-forest shadow-lg shadow-lime/10 transition hover:bg-white"
            >
              Book a visit
              <ArrowRight
                className="ml-2 inline"
                size={15}
              />
            </button>
          </div>

          <button
            className="rounded-full p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 px-5 pb-5 pt-3 lg:hidden">
            <nav className="grid gap-4 text-sm text-white/80">
              <a
                href="#services"
                onClick={() => setMobileOpen(false)}
              >
                Services
              </a>

              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
              >
                Why DMA
              </a>

              <a
                href="#areas"
                onClick={() => setMobileOpen(false)}
              >
                Service areas
              </a>

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </a>

              <button
                onClick={() => openModal('booking')}
                className="mt-2 rounded-full bg-lime px-5 py-3 font-bold text-forest"
              >
                Book a visit
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-forest px-5 pb-16 pt-36 text-white lg:px-8 lg:pb-24 lg:pt-44">
          <img
            src="/ChatGPT_Image_Oct_2,_2026,_09_42_30_PM.png"
            alt="Beautiful landscaped backyard with a lawn, gardens, and outdoor patio at sunset"
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-forest/25" />

          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime">
                <Sparkles size={14} />
                Westside landscapes, thoughtfully done
              </div>

              <h1 className="max-w-3xl font-display text-5xl leading-[.98] tracking-tight sm:text-6xl lg:text-8xl">
                A better yard begins with a{' '}
                <span className="text-lime">
                  better plan.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-mist sm:text-xl">
                Landscape design, care, and outdoor spaces built with
                intention across Los Angeles. Beautiful work, clear
                communication, and a team that shows up.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => openModal('quote')}
                  className="rounded-full bg-lime px-6 py-4 font-bold text-forest shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Get a free quote
                  <ArrowRight
                    className="ml-2 inline"
                    size={18}
                  />
                </button>

                <a
                  href="#services"
                  className="rounded-full border border-white/20 px-6 py-4 text-center font-semibold text-white transition hover:border-lime hover:text-lime"
                >
                  Explore our work
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/65">
                <span className="flex items-center gap-2">
                  <ShieldCheck
                    className="text-lime"
                    size={17}
                  />
                  Licensed · Bonded · Insured
                </span>

                <span className="flex items-center gap-2">
                  <Star
                    className="fill-lime text-lime"
                    size={16}
                  />
                  Local team, 5-star care
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE AREA BAR */}
        <section className="border-b border-forest/10 bg-cream px-5 py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-olive">
            <p className="font-semibold text-forest">
              Serving the places we call home.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {areas.slice(0, 6).map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          className="px-5 py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
              <div>
                <p className="eyebrow">
                  What we do
                </p>

                <h2 className="section-title mt-4">
                  Spaces that feel <em>like yours.</em>
                </h2>

                <p className="mt-6 max-w-md leading-7 text-olive">
                  From the first sketch to the final trim, we make it easier
                  to create an outdoor space that fits the way you live.
                </p>

                <button
                  onClick={() => openModal('quote')}
                  className="mt-8 font-bold text-forest underline decoration-lime decoration-4 underline-offset-8 transition hover:text-olive"
                >
                  Tell us about your space
                  <ArrowRight
                    className="ml-2 inline"
                    size={16}
                  />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {serviceCards.map(
                  ({ number, title, desc, image }) => (
                    <article
                      key={number}
                      className="group overflow-hidden rounded-[1.6rem] border border-forest/10 bg-cream transition hover:-translate-y-1 hover:border-lime hover:shadow-xl hover:shadow-forest/5"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />

                        <span className="absolute left-5 top-5 font-display text-4xl text-white">
                          {number}
                        </span>
                      </div>

                      <div className="p-7">
                        <div className="flex items-start justify-between">
                          <h3 className="font-display text-2xl">
                            {title}
                          </h3>

                          <ArrowRight
                            className="mt-1 text-olive transition group-hover:translate-x-1 group-hover:text-forest"
                            size={20}
                          />
                        </div>

                        <p className="mt-3 text-sm leading-6 text-olive">
                          {desc}
                        </p>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="bg-forest px-5 py-24 text-white lg:px-8 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="eyebrow text-lime">
                The DMA difference
              </p>

              <h2 className="section-title mt-4 text-white">
                Good work is in the{' '}
                <em className="text-lime">
                  details.
                </em>
              </h2>

              <p className="mt-7 max-w-lg leading-8 text-mist">
                DMA Landscaping Inc. is a local team with a simple standard:
                do the job right, communicate clearly, and leave every
                property better than we found it.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="border-t border-white/15 pt-5">
                  <p className="font-display text-4xl text-lime">
                    01
                  </p>

                  <p className="mt-2 font-semibold">
                    Clear from day one
                  </p>

                  <p className="mt-2 text-sm leading-6 text-mist">
                    Straightforward quotes and a plan you can feel good about.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-5">
                  <p className="font-display text-4xl text-lime">
                    02
                  </p>

                  <p className="mt-2 font-semibold">
                    Care you can see
                  </p>

                  <p className="mt-2 text-sm leading-6 text-mist">
                    We sweat the small stuff, from healthy soil to clean edges.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-forest">
                  <Leaf size={25} />
                </div>

                <div>
                  <p className="font-display text-2xl">
                    Made for California living.
                  </p>

                  <p className="mt-1 text-sm text-mist">
                    Local knowledge. Lasting results.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-7">
                <div>
                  <p className="font-display text-4xl text-white">
                    9
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[.15em] text-mist">
                    Neighborhoods
                  </p>
                </div>

                <div>
                  <p className="font-display text-4xl text-white">
                    5★
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[.15em] text-mist">
                    Care standard
                  </p>
                </div>

                <div>
                  <p className="font-display text-4xl text-white">
                    100%
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[.15em] text-mist">
                    Local service
                  </p>
                </div>

                <div>
                  <p className="font-display text-4xl text-white">
                    1:1
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[.15em] text-mist">
                    Personal touch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AREAS */}
        <section
          id="areas"
          className="px-5 py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 border-b border-forest/15 pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">
                  Where we work
                </p>

                <h2 className="section-title mt-4">
                  Proudly local to <em>LA.</em>
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-olive">
                Serving homes and businesses across the West Valley,
                Westside, and surrounding neighborhoods.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-9 text-lg font-semibold sm:grid-cols-3 lg:grid-cols-5">
              {areas.map((area, index) => (
                <div
                  key={area}
                  className="group flex items-center gap-2"
                >
                  <MapPin
                    size={16}
                    className="text-lime transition group-hover:text-forest"
                  />

                  {area}

                  <span className="text-xs font-normal text-olive">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section
          id="contact"
          className="bg-lime px-5 py-20 lg:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div>
              <p className="eyebrow text-forest/60">
                Ready when you are
              </p>

              <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                Let’s make outside your favorite place to be.
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => openModal('booking')}
                className="rounded-full bg-forest px-6 py-4 font-bold text-white transition hover:bg-white hover:text-forest"
              >
                Book a visit
                <CalendarDays
                  className="ml-2 inline"
                  size={17}
                />
              </button>

              <button
                onClick={() => openModal('chat')}
                className="rounded-full border border-forest/25 px-6 py-4 font-bold text-forest transition hover:bg-white"
              >
                Chat with us
                <MessageCircle
                  className="ml-2 inline"
                  size={17}
                />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0a2419] px-5 py-12 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-white">
                <img
                  src="/images/761811311_1684522027013823_2683291962426104167_n.jpg"
                  alt="DMA Landscaping logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="font-display text-2xl">
                  DMA Landscaping
                </p>

                <p className="text-xs uppercase tracking-[.2em] text-mist">
                  Inc.
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-mist">
              Quality work. Beautiful outdoors. Built to last.
            </p>
          </div>

          <div>
            <p className="footer-label">
              Reach out
            </p>

            <div className="mt-5 grid gap-3 text-sm text-mist">
              <a
                href="tel:18186146223"
                className="flex items-center gap-2 hover:text-lime"
              >
                <Phone size={15} />
                (818) 614-6223
              </a>

              <a
                href="mailto:dmalandscaping1@gmail.com"
                className="flex items-center gap-2 hover:text-lime"
              >
                <Mail size={15} />
                dmalandscaping1@gmail.com
              </a>
            </div>
          </div>

          <div>
            <p className="footer-label">
              Follow along
            </p>

            <div className="mt-5 flex gap-3">
              <a
                className="social"
                href="https://www.tiktok.com/@dmalandscaping"
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>

              <span className="social">
                <Facebook size={15} />
                Dma Landscaping INC
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-mist">
          © {new Date().getFullYear()} DMA Landscaping Inc. Serving Los
          Angeles with care.
        </div>
      </footer>

      {/* MODALS */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-forest/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-sand p-6 shadow-2xl sm:rounded-[2rem] sm:p-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">
                  {modal === 'booking'
                    ? 'Schedule a visit'
                    : modal === 'quote'
                      ? 'Start your project'
                      : 'A quick hello'}
                </p>

                <h2 className="mt-2 font-display text-4xl tracking-tight">
                  {modal === 'booking'
                    ? 'Let’s find a good time.'
                    : modal === 'quote'
                      ? 'Tell us what you’re imagining.'
                      : 'How can we help?'}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full border border-forest/10 p-2 text-olive transition hover:bg-cream hover:text-forest"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="my-8 rounded-2xl bg-lime/35 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime">
                  <Check />
                </div>

                <h3 className="mt-5 font-display text-3xl">
                  You’re on our list.
                </h3>

                <p className="mt-3 max-w-md leading-7 text-olive">
                  Thanks for reaching out. A DMA team member will follow up
                  soon to confirm the details.
                </p>

                <button
                  onClick={closeModal}
                  className="mt-6 rounded-full bg-forest px-5 py-3 font-bold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={submitRequest}
                className="mt-8 grid gap-5 sm:grid-cols-2"
              >
                <label className="field">
                  Your name

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateForm('name', e.target.value)
                    }
                    placeholder="Jane Smith"
                  />
                </label>

                <label className="field">
                  Email address

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      updateForm('email', e.target.value)
                    }
                    placeholder="jane@email.com"
                  />
                </label>

                <label className="field">
                  Phone number

                  <input
                    required
                    value={form.phone}
                    onChange={(e) =>
                      updateForm('phone', e.target.value)
                    }
                    placeholder="(818) 555-0123"
                  />
                </label>

                <label className="field">
                  Service address

                  <input
                    required
                    value={form.address}
                    onChange={(e) =>
                      updateForm('address', e.target.value)
                    }
                    placeholder="Street, city, CA"
                  />
                </label>

                {modal !== 'chat' && (
                  <>
                    <label className="field">
                      What do you need?

                      <select
                        value={form.service}
                        onChange={(e) =>
                          updateForm('service', e.target.value)
                        }
                      >
                        {serviceOptions.map((service) => (
                          <option key={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field">
                      Preferred date

                      <input
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) =>
                          updateForm(
                            'preferredDate',
                            e.target.value
                          )
                        }
                      />
                    </label>

                    {modal === 'booking' && (
                      <label className="field">
                        Best time

                        <select
                          value={form.timeWindow}
                          onChange={(e) =>
                            updateForm(
                              'timeWindow',
                              e.target.value
                            )
                          }
                        >
                          <option>
                            Morning · 8am–11am
                          </option>

                          <option>
                            Midday · 11am–2pm
                          </option>

                          <option>
                            Afternoon · 2pm–5pm
                          </option>
                        </select>
                      </label>
                    )}
                  </>
                )}

                <label className="field sm:col-span-2">
                  {modal === 'chat'
                    ? 'Your message'
                    : 'A little about the project'}

                  <textarea
                    required
                    value={form.details}
                    onChange={(e) =>
                      updateForm('details', e.target.value)
                    }
                    placeholder={
                      modal === 'chat'
                        ? 'How can we help?'
                        : 'Tell us what you would love to change outdoors...'
                    }
                    rows={4}
                  />
                </label>

                {error && (
                  <p className="sm:col-span-2 text-sm font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex flex-col justify-between gap-4 border-t border-forest/10 pt-5 sm:col-span-2 sm:flex-row sm:items-center">
                  <p className="flex items-center gap-2 text-xs text-olive">
                    <Clock3 size={14} />
                    Usually replies within one business day.
                  </p>

                  <button
                    disabled={sending}
                    className="rounded-full bg-forest px-6 py-4 font-bold text-white transition hover:bg-olive disabled:cursor-wait disabled:opacity-60"
                  >
                    {sending
                      ? 'Sending…'
                      : modal === 'chat'
                        ? 'Send message'
                        : modal === 'booking'
                          ? 'Request this visit'
                          : 'Request my quote'}

                    <Send
                      className="ml-2 inline"
                      size={16}
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   APP ROUTER
   ============================================================ */

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/admin') {
    return <AdminApp />;
  }

  return <PublicApp />;
}

export default App;
