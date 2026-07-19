import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = ['Menu', 'About', 'Specials', 'Contact']

const PRODUCTS = [
  {
    name: 'Classic Sourdough',
    desc: 'Long-fermented wild yeast, crisp crust, open crumb',
    price: '$9',
    tag: 'Signature',
    img: 'https://images.unsplash.com/photo-1705680827676-ea4a49bc6ecb?w=600&h=700&fit=crop&auto=format',
  },
  {
    name: 'Butter Croissant',
    desc: 'Seventy-two layers of French butter, baked golden',
    price: '$4.50',
    tag: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=700&fit=crop&auto=format',
  },
  {
    name: 'Dark Chocolate Tart',
    desc: 'Single-origin 70% ganache, salted caramel base',
    price: '$7',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1737700087822-0dfbb754db30?w=600&h=700&fit=crop&auto=format',
  },
  {
    name: 'Country Loaf',
    desc: 'Stone-milled wheat, rye, and spelt blend',
    price: '$11',
    tag: '',
    img: 'https://images.unsplash.com/photo-1684091272645-3dfd9df8dfdf?w=600&h=700&fit=crop&auto=format',
  },
  {
    name: 'Pastry Selection',
    desc: 'Seasonal morning pastries — ask at the counter',
    price: 'From $3',
    tag: 'Daily',
    img: 'https://images.unsplash.com/photo-1686515266396-080c4939e6b4?w=600&h=700&fit=crop&auto=format',
  },
  {
    name: 'Bakery Basket',
    desc: 'Loaf, four croissants, two pastries, jam',
    price: '$34',
    tag: 'Gift',
    img: 'https://images.unsplash.com/photo-1644015272264-2d70518c2046?w=600&h=700&fit=crop&auto=format',
  },
]

const TESTIMONIALS = [
  {
    quote: "The sourdough here changed what I thought bread could taste like. I drive forty minutes every Saturday morning.",
    name: 'Clara Hoffman',
    role: 'Regular since 2019',
  },
  {
    quote: "Every croissant is perfectly layered — flaky outside, pillowy in. It's the best in the city, full stop.",
    name: 'James Okafor',
    role: 'Food writer, The Local Table',
  },
  {
    quote: "We ordered the bakery baskets for our office every Friday. The team asks about them on Thursdays.",
    name: 'Sofia Andreou',
    role: 'Studio Director, Form & Co.',
  },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu open/close animation
  useLayoutEffect(() => {
    if (!mobileMenuRef.current) return
    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      )
    }
  }, [menuOpen])

  // Testimonial crossfade, driven by GSAP instead of CSS transitions
  useLayoutEffect(() => {
    testimonialRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { opacity: i === 0 ? 1 : 0 })
    })
  }, [])

  useEffect(() => {
    testimonialRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        opacity: i === activeTestimonial ? 1 : 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    })
  }, [activeTestimonial])

  // Hero entrance + scroll-triggered reveals for the rest of the page
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .fromTo('.hero-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.hero-heading', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.35')
        .fromTo('.hero-para', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.55')
        .fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-item]')
        gsap.fromTo(
          items,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} style={{ fontFamily: 'Inter, system-ui, sans-serif' }} className="bg-cream text-charcoal min-h-screen">

      {/* ── NAV ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-terra flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C4.79 1 3 2.79 3 5c0 2.76 4 8 4 8s4-5.24 4-8c0-2.21-1.79-4-4-4z" fill="white"/>
              </svg>
            </span>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-xl font-semibold text-charcoal tracking-tight">
              Levain
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="text-sm font-medium text-warm-gray hover:text-charcoal transition-colors duration-200 tracking-wide"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              className="text-sm font-medium px-5 py-2 bg-charcoal text-cream rounded-full hover:bg-charcoal-soft transition-colors duration-200"
            >
              Order Now
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-charcoal transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-charcoal transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-charcoal transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {menuOpen && (
          <div ref={mobileMenuRef} className="md:hidden bg-cream border-t border-wheat px-6 py-6 space-y-4">
            {NAV_LINKS.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block text-base font-medium text-charcoal py-1"
              >
                {link}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-block mt-2 text-sm font-medium px-5 py-2.5 bg-charcoal text-cream rounded-full"
            >
              Order Now
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-charcoal">
        <img
          src="https://images.unsplash.com/photo-1711672284661-bd70e38f31b2?w=1600&h=900&fit=crop&auto=format"
          alt="Bakery filled with freshly baked goods"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal/70" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="hero-eyebrow text-wheat text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Est. 2008 · Handcrafted Daily
            </p>
            <h1
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="hero-heading text-5xl md:text-7xl font-semibold text-cream leading-[1.05] mb-6"
            >
              Bread worth<br />
              <em className="text-wheat not-italic">waking up for.</em>
            </h1>
            <p className="hero-para text-cream/80 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-lg">
              Every loaf, pastry, and tart made from scratch with stone-milled flour,
              wild yeast starters, and French butter.
            </p>
            <div className="hero-cta flex flex-wrap gap-4">
              <a
                href="#menu"
                className="px-8 py-3.5 bg-terra text-cream text-sm font-medium rounded-full hover:bg-terra-light transition-colors duration-200"
              >
                Explore Menu
              </a>
              <a
                href="#about"
                className="px-8 py-3.5 border border-cream/50 text-cream text-sm font-medium rounded-full hover:border-cream hover:bg-cream/10 transition-colors duration-200"
              >
                Our Story
              </a>
            </div>
          </div>

          <div className="hero-scroll absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2">
            <span className="text-cream/50 text-xs tracking-widest uppercase rotate-90 mb-6">Scroll</span>
            <div className="w-px h-12 bg-cream/30" />
          </div>
        </div>
      </section>

      {/* ── FEATURED TRIO ── */}
      <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-terra text-sm font-medium tracking-widest uppercase mb-3">This Week's Pick</p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-4xl md:text-5xl font-semibold text-charcoal leading-tight"
            >
              Made this morning,<br />gone by noon.
            </h2>
          </div>
          <a
            href="#menu"
            className="shrink-0 text-sm font-medium text-terra border-b border-terra pb-0.5 hover:text-terra-light hover:border-terra-light transition-colors duration-200"
          >
            View full menu →
          </a>
        </div>

        <div data-reveal-group className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <div
              key={p.name}
              data-reveal-item
              className="group relative overflow-hidden rounded-2xl bg-cream-dark"
              style={{ aspectRatio: i === 1 ? '3/4' : '4/5' }}
            >
              <img
                src={p.img}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              {p.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-terra text-cream text-xs font-medium rounded-full">
                  {p.tag}
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="text-xl font-semibold text-cream mb-1"
                    >
                      {p.name}
                    </h3>
                    <p className="text-cream/70 text-sm leading-snug max-w-[200px]">{p.desc}</p>
                  </div>
                  <span className="text-wheat font-semibold text-lg shrink-0 ml-4">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 bg-charcoal-soft overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-reveal className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-charcoal">
              <img
                src="https://images.unsplash.com/photo-1536782896453-61d09f3aaf3e?w=800&h=1000&fit=crop&auto=format"
                alt="Artisan baker at work in a traditional bakery"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden border-4 border-charcoal-soft hidden lg:block bg-charcoal">
              <img
                src="https://images.unsplash.com/photo-1515182629504-727d7753751f?w=200&h=200&fit=crop&auto=format"
                alt="Freshly baked bread loaves"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div data-reveal className="lg:pl-8">
            <p className="text-terra text-sm font-medium tracking-widest uppercase mb-4">Our Story</p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-4xl md:text-5xl font-semibold text-cream leading-tight mb-6"
            >
              A bakery built on patience.
            </h2>
            <p className="text-warm-gray-light text-lg leading-relaxed mb-6">
              Levain started as a single oven in a rented kitchen in 2008. We milled our
              own flour, kept our own starters, and sold out of bread bags at the
              Saturday market by 9am.
            </p>
            <p className="text-warm-gray-light text-base leading-relaxed mb-10">
              Today we bake in a proper bakehouse on Elm Street, but the ethos hasn't
              changed. Long fermentation. French butter. Seasonal ingredients. Every
              item on our shelf was shaped by hand before sunrise.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-wheat/20 pt-8">
              {[['16+', 'Years baking'], ['4am', 'Start time daily'], ['100%', 'Made in-house']].map(([stat, label]) => (
                <div key={stat}>
                  <p
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-3xl font-semibold text-cream mb-1"
                  >
                    {stat}
                  </p>
                  <p className="text-warm-gray-light text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL MENU GRID ── */}
      <section id="menu" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <div data-reveal className="text-center mb-14">
          <p className="text-terra text-sm font-medium tracking-widest uppercase mb-3">What We Bake</p>
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-4xl md:text-5xl font-semibold text-charcoal"
          >
            The full menu
          </h2>
        </div>

        <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map(p => (
            <div
              key={p.name}
              data-reveal-item
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-dark mb-4">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="text-lg font-semibold text-charcoal"
                    >
                      {p.name}
                    </h3>
                    {p.tag && (
                      <span className="px-2 py-0.5 bg-terra/10 text-terra text-xs font-medium rounded-full">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-warm-gray text-sm leading-snug">{p.desc}</p>
                </div>
                <span className="shrink-0 ml-4 text-charcoal font-semibold">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-cream-dark px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-terra text-sm font-medium tracking-widest uppercase mb-3">Reviews</p>
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-4xl font-semibold text-charcoal mb-14"
          >
            What people say
          </h2>

          <div className="relative min-h-[160px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                ref={(el) => { testimonialRefs.current[i] = el }}
                className={i === activeTestimonial ? 'relative' : 'absolute inset-0'}
              >
                <blockquote
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-2xl md:text-3xl font-medium text-charcoal leading-relaxed mb-6 italic"
                >
                  "{t.quote}"
                </blockquote>
                <p className="text-charcoal font-semibold text-sm">{t.name}</p>
                <p className="text-warm-gray text-sm mt-1">{t.role}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeTestimonial ? 'w-8 bg-terra' : 'w-4 bg-warm-gray-light'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALS / CTA BANNER ── */}
      <section id="specials" className="relative overflow-hidden bg-terra py-20 px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-wheat -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-wheat translate-x-1/3 translate-y-1/3" />
        </div>
        <div data-reveal className="relative max-w-3xl mx-auto text-center">
          <p className="text-wheat/80 text-sm font-medium tracking-widest uppercase mb-4">Weekend Special</p>
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-4xl md:text-5xl font-semibold text-cream leading-tight mb-6"
          >
            Saturday morning basket — <em>$34</em>
          </h2>
          <p className="text-cream/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            One sourdough loaf, four croissants, two seasonal pastries, and a jar of
            house-made jam. Available for collection from 7am, or delivered by 9am.
          </p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 bg-cream text-charcoal text-sm font-semibold rounded-full hover:bg-wheat transition-colors duration-200"
          >
            Reserve Your Basket
          </a>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div data-reveal>
            <p className="text-terra text-sm font-medium tracking-widest uppercase mb-4">Find Us</p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-4xl md:text-5xl font-semibold text-charcoal leading-tight mb-8"
            >
              Come see us.<br />We'll have bread ready.
            </h2>
            <div className="space-y-6">
              {[
                { label: 'Address', value: '14 Elm Street, North Quarter\nSan Francisco, CA 94103' },
                { label: 'Hours', value: 'Mon – Fri: 7am – 5pm\nSat – Sun: 7am – 3pm' },
                { label: 'Phone', value: '(415) 882-0614' },
                { label: 'Email', value: 'hello@levainbakery.com' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-6 border-b border-wheat pb-6">
                  <span className="w-20 shrink-0 text-warm-gray text-sm font-medium">{label}</span>
                  <span className="text-charcoal text-sm leading-relaxed whitespace-pre-line">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <form data-reveal className="bg-cream-dark rounded-2xl p-8 lg:p-10 space-y-5">
            <h3
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-2xl font-semibold text-charcoal mb-2"
            >
              Send us a message
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5 tracking-wide uppercase">First name</label>
                <input
                  type="text"
                  placeholder="Clara"
                  className="w-full px-4 py-3 bg-cream border border-wheat rounded-lg text-sm text-charcoal placeholder-warm-gray-light focus:outline-none focus:border-terra transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5 tracking-wide uppercase">Last name</label>
                <input
                  type="text"
                  placeholder="Hoffman"
                  className="w-full px-4 py-3 bg-cream border border-wheat rounded-lg text-sm text-charcoal placeholder-warm-gray-light focus:outline-none focus:border-terra transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-gray mb-1.5 tracking-wide uppercase">Email</label>
              <input
                type="email"
                placeholder="clara@example.com"
                className="w-full px-4 py-3 bg-cream border border-wheat rounded-lg text-sm text-charcoal placeholder-warm-gray-light focus:outline-none focus:border-terra transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-gray mb-1.5 tracking-wide uppercase">Message</label>
              <textarea
                rows={4}
                placeholder="Tell us about your order, a catering request, or just say hello…"
                className="w-full px-4 py-3 bg-cream border border-wheat rounded-lg text-sm text-charcoal placeholder-warm-gray-light focus:outline-none focus:border-terra transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-charcoal text-cream text-sm font-semibold rounded-lg hover:bg-charcoal-soft transition-colors duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-charcoal text-cream py-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-wheat/10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-7 h-7 rounded-full bg-terra flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C4.79 1 3 2.79 3 5c0 2.76 4 8 4 8s4-5.24 4-8c0-2.21-1.79-4-4-4z" fill="white"/>
                  </svg>
                </span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-xl font-semibold">Levain</span>
              </div>
              <p className="text-warm-gray-light text-sm leading-relaxed">
                Artisan bakers in San Francisco's North Quarter. Everything made by hand before the city wakes up.
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              {[
                { heading: 'Navigate', links: ['Menu', 'About', 'Specials', 'Contact'] },
                { heading: 'Follow', links: ['Instagram', 'Facebook', 'Newsletter'] },
              ].map(col => (
                <div key={col.heading}>
                  <p className="text-xs font-medium text-warm-gray tracking-widest uppercase mb-4">{col.heading}</p>
                  <ul className="space-y-2">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm text-warm-gray-light hover:text-cream transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
            <p className="text-warm-gray text-xs">© 2024 Levain Bakery. All rights reserved.</p>
            <p className="text-warm-gray text-xs">14 Elm Street, San Francisco · (415) 882-0614</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
