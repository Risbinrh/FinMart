import HeroBanner from '@/components/home/HeroBanner';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PopularProducts from '@/components/home/PopularProducts';
import RecipeSuggestions from '@/components/home/RecipeSuggestions';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoryCarousel />
      <FeaturedProducts />
      <PopularProducts />
      <RecipeSuggestions />
    </>
  );
}
