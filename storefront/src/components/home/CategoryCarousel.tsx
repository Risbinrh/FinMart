'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { medusa, ProductCategory } from '@/lib/medusa';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { product_categories } = await medusa.getCategories();
        setCategories(product_categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Default category images by handle
  const getCategoryImage = (handle: string) => {
    const images: Record<string, string> = {
      'sea-fish-premium': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
      'sea-fish-regular': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200&h=200&fit=crop',
      'prawns': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&h=200&fit=crop',
      'crabs': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200&h=200&fit=crop',
      'squid': 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=200&h=200&fit=crop',
      'river-fish': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200&h=200&fit=crop',
      'dried-fish': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    };
    return images[handle] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop';
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-28 sm:w-36 shrink-0">
                <Skeleton className="aspect-square rounded-full mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Shop by Category</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.handle}`}
              className="flex-shrink-0 snap-start"
            >
              <div className="w-28 sm:w-36 group">
                <div className="relative aspect-square rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-primary transition-colors">
                  <Image
                    src={getCategoryImage(category.handle)}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.metadata?.tamil_name && (
                    <p className="text-xs text-muted-foreground">
                      {category.metadata.tamil_name as string}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
