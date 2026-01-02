'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBasket, Loader2, Star, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, formatPrice, getVariantPrice } from '@/lib/medusa';
import { useCart } from '@/context/CartContext';

interface FreshCatchCardProps {
    product: Product;
    view?: 'grid' | 'list';
}

export default function FreshCatchCard({ product, view = 'grid' }: FreshCatchCardProps) {
    const { addToCart, isLoading: cartLoading } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Get first variant for default price display
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant ? getVariantPrice(defaultVariant) : 0;

    // Get data from metadata or fallback
    const originalPrice = (product.metadata?.original_price as number) || 0;
    const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

    // Missing contents integration
    const tamilName = product.subtitle || (product.metadata?.tamil_name as string) || '';
    const freshness = (product.metadata?.freshness as string) || 'Caught fresh';
    const rating = (product.metadata?.rating as number) || 4.5;
    const reviewCount = (product.metadata?.review_count as number) || 0;

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

    if (view === 'list') {
        return (
            <Card className="group overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white">
                <div className="flex flex-col sm:flex-row h-full">
                    {/* Image Section */}
                    <Link href={`/products/${product.handle}`} className="relative w-full sm:w-[240px] shrink-0 bg-slate-50/50 px-4 flex items-center justify-center">
                        <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-28">
                            <Image
                                src={product.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'}
                                alt={product.title}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {discount > 0 && (
                            <div className="absolute top-2 left-2">
                                <Badge variant="destructive" className="bg-[#8B1D1D] text-white rounded-none px-1.5 py-0.5 text-[10px] font-bold uppercase">
                                    {discount}% OFF
                                </Badge>
                            </div>
                        )}
                    </Link>

                    {/* Content Section */}
                    <div className="flex-1 px-5 flex flex-col sm:flex-row gap-2 py-2">
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <Link href={`/products/${product.handle}`}>
                                    <h3 className="font-bold text-lg sm:text-xl text-[#333333] group-hover:text-primary transition-colors leading-tight mb-0.5">
                                        {product.title}
                                    </h3>
                                </Link>
                                {tamilName && (
                                    <p className="text-sm text-muted-foreground italic mb-1">
                                        {tamilName}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">{freshness}</span>
                                    <span className="text-xs text-muted-foreground/60">({reviewCount} reviews)</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[#333333]">
                                        {formatPrice(price)}
                                    </span>
                                    {originalPrice > price && (
                                        <span className="text-sm text-muted-foreground line-through font-medium">
                                            {formatPrice(originalPrice)}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Per KG</span>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="flex sm:flex-col items-center justify-between sm:justify-between sm:items-end w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-50 pt-2 sm:pt-0 sm:pl-4">
                            <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-bold text-[#333333]">{rating}</span>
                            </div>

                            <Button
                                className="bg-[#006699] hover:bg-[#005580] text-white rounded-full px-8 h-10 gap-2 font-black shadow-md active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                                disabled={isAdding || cartLoading}
                                onClick={handleAddToCart}
                            >
                                {isAdding ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingBasket className="h-4 w-4 stroke-[2.5px]" />
                                        <span className="text-xs uppercase tracking-widest">ADD TO CART</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Grid View (Default)
    return (
        <Card className="group overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
            <Link href={`/products/${product.handle}`}>
                <div className="relative aspect-[16/8] sm:aspect-[16/7] overflow-hidden bg-slate-50/50">
                    <Image
                        src={product.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'}
                        alt={product.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                            <Badge variant="destructive" className="bg-[#8B1D1D] text-white rounded-none px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase">
                                {discount}% OFF
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-2.5 sm:p-3.5 pt-1.5 flex flex-col">
                <Link href={`/products/${product.handle}`} className="flex flex-col">
                    {/* Main Title & Tamil Name - Condensed */}
                    <div className="mb-1.5">
                        <h3 className="font-bold text-sm sm:text-base leading-tight text-[#333333] group-hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                        </h3>
                        {tamilName && (
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground italic truncate">
                                {tamilName}
                            </p>
                        )}
                    </div>

                    {/* Meta Row - Combined Rating & Freshness */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-bold text-[#333333]">{rating}</span>
                            <span className="text-[10px] text-muted-foreground opacity-70">({reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            <span className="text-[10px] font-medium">{freshness}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-sm sm:text-base font-black text-[#333333]">
                                    {formatPrice(price)}
                                </span>
                                {originalPrice > price && (
                                    <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/40 font-medium">
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-tight -mt-0.5">Per KG</span>
                        </div>

                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 h-7 sm:h-8 gap-1.5 font-black shadow-sm active:scale-95 transition-all cursor-pointer"
                            disabled={isAdding || cartLoading}
                            onClick={handleAddToCart}
                        >
                            {isAdding ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingBasket className="h-3.5 w-3.5 stroke-[2.5px]" />
                                    <span className="text-[10px] uppercase tracking-wider">ADD</span>
                                </>
                            )}
                        </Button>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}
