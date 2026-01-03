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
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface FreshCatchCardProps {
    product: Product;
}

export default function FreshCatchCard({ product }: FreshCatchCardProps) {
    const { addToCart, isLoading: cartLoading } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const { language } = useLanguage();

    // Get first variant for default price display
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant ? getVariantPrice(defaultVariant) : 0;

    // Get data from metadata or fallback
    const originalPrice = (product.metadata?.original_price as number) || 0;
    const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

    // Missing contents integration
    const tamilName = product.subtitle || (product.metadata?.tamil_name as string) || '';
    const freshness = (product.metadata?.freshness as string) || t('caughtFresh', language);
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
                    {/* Main Title - Language Switched */}
                    <div className="mb-1.5">
                        <h3 className="font-bold text-sm sm:text-base leading-tight text-[#333333] group-hover:text-primary transition-colors line-clamp-1">
                            {language === 'ta' && tamilName ? tamilName : product.title}
                        </h3>
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
                            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-tight -mt-0.5">{t('perKg', language)}</span>
                        </div>

                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 h-7 sm:h-8 gap-1.5 font-black shadow-sm active:scale-95 transition-all"
                            disabled={isAdding || cartLoading}
                            onClick={handleAddToCart}
                        >
                            {isAdding ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingBasket className="h-3.5 w-3.5 stroke-[2.5px]" />
                                    <span className="text-[10px] uppercase tracking-wider">{t('add', language)}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}
