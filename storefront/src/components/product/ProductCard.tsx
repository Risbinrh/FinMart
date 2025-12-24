'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const availabilityColors = {
    'in-stock': 'bg-green-500',
    'limited': 'bg-yellow-500',
    'out-of-stock': 'bg-red-500',
  };

  const availabilityText = {
    'in-stock': 'In Stock',
    'limited': 'Limited',
    'out-of-stock': 'Out of Stock',
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isBestSeller && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                Best Seller
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive" className="text-xs">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
          {/* Availability indicator */}
          <div className="absolute top-2 right-2">
            <div className={`h-2.5 w-2.5 rounded-full ${availabilityColors[product.availability]}`} />
          </div>
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          {/* Name */}
          <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{product.tamilName}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Freshness */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            <span className="line-clamp-1">{product.freshness}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              ₹{product.price}
            </span>
            <span className="text-sm text-muted-foreground">/{product.unit}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <Button
          className="w-full gap-2"
          size="sm"
          disabled={product.availability === 'out-of-stock'}
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
