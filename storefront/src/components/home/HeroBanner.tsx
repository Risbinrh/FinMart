'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Truck, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';


<<<<<<< HEAD
=======
const slides = [
  {
    id: 1,
    title: 'Premium Sea Fish',
    subtitle: 'CATCH OF THE DAY',
    description: 'Experience the finest Emperor fish (Eari), delivered straight from the boat.',
    image: '',
    cta: 'Shop Sea Fish',
    href: '/products',
    gradient: 'from-slate-900/40 via-slate-900/20 to-transparent',
  },
  {
    id: 2,
    title: 'Fresh Prawns Daily',
    subtitle: 'PREMIUM SELECTION',
    description: 'Premium tiger prawns delivered before sunrise to ensure maximum freshness.',
    image: '',
    cta: 'Order Prawns',
    href: '/products?category=prawns',
    gradient: 'from-teal-900/40 via-teal-900/20 to-transparent',
  },
  {
    id: 3,
    title: 'Black Pomfret',
    subtitle: 'CUSTOMER FAVORITE',
    description: 'Discover the rich taste of fresh Black Pomfret, perfect for frying or curry.',
    image: '',
    cta: 'Shop Pomfret',
    href: '/products',
    gradient: 'from-orange-900/40 via-orange-900/20 to-transparent',
  },
];
>>>>>>> 5494701970030cda6266ceac303270eca30562a1

export default function HeroBanner() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: t('premiumSeaFish', language),
      subtitle: t('catchOfTheDay', language),
      description: t('emperorFishDesc', language),
      image: '/images/carousel/emperor_fish_creative.png',
      cta: t('shopSeaFish', language),
      href: '/products',
      gradient: 'from-slate-900/40 via-slate-900/20 to-transparent',
    },
    {
      id: 2,
      title: t('freshPrawnsDaily', language),
      subtitle: t('premiumSelection', language),
      description: t('tigerPrawnsDesc', language),
      image: '/images/carousel/tiger_prawns_creative.png',
      cta: t('orderPrawns', language),
      href: '/products?category=prawns',
      gradient: 'from-teal-900/40 via-teal-900/20 to-transparent',
    },
    {
      id: 3,
      title: t('blackPomfret', language),
      subtitle: t('customerFavorite', language),
      description: t('blackPomfretDesc', language),
      image: '/images/carousel/black_pomfret_creative.png',
      cta: t('shopPomfret', language),
      href: '/products',
      gradient: 'from-orange-900/40 via-orange-900/20 to-transparent',
    },
  ];

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
    <section className="relative w-full bg-white overflow-hidden">
      {/* Full Width Banner - Small Height */}
      <div className="relative h-[150px] sm:h-[180px] lg:h-[220px] container mx-auto overflow-hidden rounded-xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Background Image - Object fit cover to fill the wide area */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat rounded-xl"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Soft Gradient Overlay for text readability without darkening too much */}
            <div className={`rounded-xl absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

            {/* Content positioned to the left */}
            <div className="container mx-auto px-4 h-full relative">
              <div className="h-full flex items-center justify-start max-w-2xl px-4 sm:px-8">
                <div className="text-white drop-shadow-md">
                  <p className="text-[10px] sm:text-xs font-bold mb-1 opacity-90 tracking-[0.2em] uppercase">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-2 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm mb-4 opacity-90 font-medium max-w-md hidden sm:block">
                    {slide.description}
                  </p>
                  <Link href={slide.href}>
                    <Button
                      variant="secondary"
                      className="font-bold text-xs sm:text-sm h-8 sm:h-10 px-4 sm:px-6 hover:scale-105 transition-transform"
                    >
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Minimal Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Minimal Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${index === currentSlide
                ? 'w-6 h-1.5 bg-white rounded-full'
                : 'w-1.5 h-1.5 bg-white/40 rounded-full hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
