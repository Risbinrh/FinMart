'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Plus, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, formatPrice, getVariantPrice } from '@/lib/medusa';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Get first variant for default price display
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant ? getVariantPrice(defaultVariant) : 0;

  // Get Tamil name from subtitle or metadata
  const tamilName = product.subtitle || (product.metadata?.tamil_name as string) || '';

  // Get freshness from metadata
  const freshness = (product.metadata?.freshness as string) || 'Caught fresh';

  // Get rating from metadata
  const rating = (product.metadata?.rating as number) || 4.5;
  const reviewCount = (product.metadata?.review_count as number) || 0;

  // Check availability
  const isInStock = defaultVariant?.inventory_quantity !== 0;
  const isLimited = (defaultVariant?.inventory_quantity || 0) < 10 && isInStock;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) return;

    try {
      setIsAdding(true);
      await addToCart(defaultVariant.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.handle}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.tags?.some(t => t.value === 'bestseller') && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                Best Seller
              </Badge>
            )}
            {product.metadata?.original_price && price < (product.metadata.original_price as number) && (
              <Badge variant="destructive" className="text-xs">
                {Math.round((1 - price / (product.metadata.original_price as number)) * 100)}% OFF
              </Badge>
            )}
          </div>
          {/* Availability indicator */}
          <div className="absolute top-2 right-2">
            <div className={`h-2.5 w-2.5 rounded-full ${
              !isInStock ? 'bg-red-500' : isLimited ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
          </div>
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${product.handle}`}>
          {/* Name */}
          <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{tamilName}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          {/* Freshness */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            <span className="line-clamp-1">{freshness}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-muted-foreground">/kg</span>
            {product.metadata?.original_price && price < (product.metadata.original_price as number) && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.metadata.original_price as number)}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <Button
          className="w-full gap-2"
          size="sm"
          disabled={!isInStock || isAdding || cartLoading}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
