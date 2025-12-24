import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { featuredProducts } from '@/data/products';

export default function FeaturedProducts() {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Today&apos;s Fresh Catch</h2>
            <p className="text-sm text-muted-foreground">Caught fresh this morning</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {featuredProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
