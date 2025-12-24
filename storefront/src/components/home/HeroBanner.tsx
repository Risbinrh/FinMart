'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Truck, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Fresh Fish, Delivered Fresh',
    subtitle: 'Caught at dawn, delivered to your doorstep',
    description: 'Premium quality seafood from the Bay of Bengal',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop',
    cta: 'Shop Now',
    href: '/products',
    gradient: 'from-primary/90 to-primary/40',
  },
  {
    id: 2,
    title: 'Sunrise Delivery',
    subtitle: 'Get your fish by 8 AM',
    description: 'Perfect for early morning cooking',
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=1200&h=500&fit=crop',
    cta: 'Order Now',
    href: '/products',
    gradient: 'from-secondary/90 to-secondary/40',
  },
  {
    id: 3,
    title: 'Premium Prawns',
    subtitle: 'Tiger Prawns @ Rs.780/kg',
    description: 'Fresh, large, and delicious',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200&h=500&fit=crop',
    cta: 'Buy Prawns',
    href: '/products?category=prawns',
    gradient: 'from-accent/90 to-accent/40',
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
    <section className="relative">
      {/* Main Banner */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
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
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="max-w-xl text-white">
                <p className="text-sm sm:text-base font-medium mb-2 opacity-90">
                  {slide.subtitle}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-lg mb-6 opacity-90">
                  {slide.description}
                </p>
                <Link href={slide.href}>
                  <Button size="lg" variant="secondary" className="font-semibold">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
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
      </div>
    </section>
  );
}
