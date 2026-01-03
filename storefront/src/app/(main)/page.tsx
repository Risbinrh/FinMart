'use client';

import { useEffect, useState } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PopularProducts from '@/components/home/PopularProducts';
import RecipeSuggestions from '@/components/home/RecipeSuggestions';
import CategoryProductGrid from '@/components/home/CategoryProductGrid';
import { medusa, ProductCategory } from '@/lib/medusa';

export default function Home() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { product_categories } = await medusa.getCategories();
        // Only show top-level categories or filter as needed
        setCategories(product_categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <HeroBanner />
      <CategoryCarousel />
      <FeaturedProducts />

      {/* Dynamic Category Sections */}
      {categories.map((category) => (
        <CategoryProductGrid key={category.id} category={category} />
      ))}

      <PopularProducts />
      <RecipeSuggestions />
    </>
  );
}
