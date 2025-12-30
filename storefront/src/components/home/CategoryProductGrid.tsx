'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import FreshCatchCard from '@/components/product/FreshCatchCard';
import { medusa, Product, ProductCategory } from '@/lib/medusa';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryProductGridProps {
    category: ProductCategory;
}

export default function CategoryProductGrid({ category }: CategoryProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch ALL products for this category (using a reasonable limit of 100)
                const { products } = await medusa.getProducts({
                    category_id: [category.id],
                    limit: 100
                });
                setProducts(products);
            } catch (error) {
                console.error(`Failed to fetch products for category ${category.name}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [category.id]);

    if (isLoading) {
        return (
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="height-48 rounded-xl" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gradient">{category.name}</h2>
                        {category.description && (
                            <p className="text-base text-muted-foreground mt-1 font-medium">{category.description}</p>
                        )}
                    </div>
                    <Link
                        href={`/products?category=${category.handle}`}
                        className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                        View All
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <FreshCatchCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
