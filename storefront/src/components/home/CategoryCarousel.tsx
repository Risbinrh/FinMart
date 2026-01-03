'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { medusa, ProductCategory } from '@/lib/medusa';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

export default function CategoryCarousel() {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { product_categories } = await medusa.getCategories();
        setCategories(product_categories);

        // Fetch one product for each category to get its image
        const imageMap: Record<string, string> = {};

        // Process categories in parallel
        await Promise.all(
          product_categories.map(async (category) => {
            try {
              // Get products for this category, limiting to 1
              const { products } = await medusa.getProducts({
                category_id: [category.id],
                limit: 1,
              });

              if (products.length > 0 && products[0].thumbnail) {
                imageMap[category.handle] = products[0].thumbnail;
              }
            } catch (err) {
              console.error(`Failed to fetch product for category ${category.handle}`, err);
            }
          })
        );

        setCategoryImages(imageMap);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryImage = (handle: string) => {
    // Return fetched product image, or fallback to the previous default image mapping for specific handles, 
    // or a generic fallback if nothing else matches.
    if (categoryImages[handle]) {
      return categoryImages[handle];
    }

    // Fallback dictionary for immediate display if product fetch fails or is slow
    const defaultImages: Record<string, string> = {
      'sea-fish-premium': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
      'sea-fish-regular': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200&h=200&fit=crop',
      'prawns': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&h=200&fit=crop',
      'crabs': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200&h=200&fit=crop',
      'squid': 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=200&h=200&fit=crop',
      'river-fish': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200&h=200&fit=crop',
      'dried-fish': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    };

    return defaultImages[handle] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop';
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-1">{t('shopByCategory', language)}</h2>
            <p className="text-sm text-muted-foreground">{t('freshCatchFromEveryCategory', language)}</p>
          </div>

        </div>

        <div
          ref={scrollRef}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 justify-items-center"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.handle}`}
              className="group block"
            >
              <div className="w-32 sm:w-40 group cursor-pointer">
                <div className="relative aspect-square rounded-full overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-white">
                  <div className="absolute inset-0 p-3">
                    <div className="relative w-full h-full">
                      <Image
                        src={getCategoryImage(category.handle)}
                        alt={category.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                    {language === 'ta' && typeof category.metadata?.tamil_name === 'string'
                      ? category.metadata.tamil_name
                      : category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
