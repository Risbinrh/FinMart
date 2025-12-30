'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Truck, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Premium Sea Fish',
    subtitle: 'CATCH OF THE DAY',
    description: 'Experience the finest Emperor fish (Eari), delivered straight from the boat to your kitchen.',
    image: '/images/carousel/emperor_fish_creative.png',
    cta: 'Shop Sea Fish',
    href: '/products',
    gradient: 'from-slate-900/80 via-slate-900/60 to-transparent',
  },
  {
    id: 2,
    title: 'Fresh Prawns Daily',
    subtitle: 'PREMIUM SELECTION',
    description: 'Catch of the day - Premium tiger prawns delivered before sunrise to ensure maximum freshness.',
    image: '/images/carousel/tiger_prawns_creative.png',
    cta: 'Order Prawns',
    href: '/products?category=prawns',
    gradient: 'from-teal-900/80 via-teal-900/60 to-transparent',
  },
  {
    id: 3,
    title: 'Black Pomfret',
    subtitle: 'CUSTOMER FAVORITE',
    description: 'Discover the rich taste of fresh Black Pomfret (Karutha Avoli), perfect for frying or curry.',
    image: '/images/carousel/black_pomfret_creative.png',
    cta: 'Shop Pomfret',
    href: '/products',
    gradient: 'from-orange-900/80 via-orange-900/60 to-transparent',
  },
];

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹300' },
  { icon: Clock, title: 'Same Day', desc: 'Delivery available' },
  { icon: Shield, title: 'Fresh Guarantee', desc: '100% quality assured' },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative py-6 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Main Banner - Card Style */}
        <div className="relative h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl shadow-xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

              {/* Content */}
              <div className="relative h-full px-6 sm:px-12 flex items-center justify-start">
                <div className="max-w-xl text-white text-left">
                  <p className="text-xs sm:text-sm font-bold mb-2 opacity-80 tracking-widest uppercase">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base mb-6 opacity-90 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link href={slide.href}>
                    <Button size="lg" variant="secondary" className="font-semibold shadow-lg">
                      {slide.cta} →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows - Outside the card */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/60 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:bg-white/70 transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/60 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:bg-white/70 transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Bar */}
      {/* <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md border border-border p-4">
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2 sm:gap-3">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <div className="hidden sm:block">
                  <p className="font-semibold text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
                <span className="sm:hidden text-xs font-medium">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
}
