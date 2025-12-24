import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';

export default function PopularProducts() {
  // Get products sorted by review count (popularity)
  const popularProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Popular This Week</h2>
            <p className="text-sm text-muted-foreground">Most ordered by our customers</p>
          </div>
          <Link
            href="/products?sort=popular"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
