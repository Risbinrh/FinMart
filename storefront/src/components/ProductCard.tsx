"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

interface ProductCardProps {
    id: string
    title: string
    tamilName?: string
    price: number
    image: string
    rating?: number
    reviewCount?: number
    inStock?: boolean
    discount?: number
    onAddToCart?: () => void
    onQuickView?: () => void
}

export default function ProductCard({
    id,
    title,
    tamilName,
    price,
    image,
    rating = 0,
    reviewCount = 0,
    inStock = true,
    discount,
    onAddToCart,
    onQuickView,
}: ProductCardProps) {
    const { language } = useLanguage()
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const discountedPrice = discount ? price * (1 - discount / 100) : price
    const formattedPrice = `₹${discountedPrice.toFixed(0)}`
    const originalPrice = discount ? `₹${price.toFixed(0)}` : null

    return (
        <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover-lift animate-fade-in">
            {/* Wishlist Button */}
            <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all hover:scale-110"
                aria-label="Add to wishlist"
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                />
            </button>

            {/* Discount Badge */}
            {discount && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold shadow-md">
                    {discount}% {t('off', language)}
                </div>
            )}

            {/* Product Image */}
            <Link href={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-muted">
                {!imageLoaded && (
                    <div className="absolute inset-0 shimmer" />
                )}
                <Image
                    src={image}
                    alt={title}
                    fill
                    className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            onQuickView?.()
                        }}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                        <Eye className="w-4 h-4" />
                        {t('quickView', language)}
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 space-y-2">
                {/* Rating */}
                {rating > 0 && (
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                            ({reviewCount})
                        </span>
                    </div>
                )}

                {/* Title */}
                <Link href={`/products/${id}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {title}
                    </h3>
                    {tamilName && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {tamilName}
                        </p>
                    )}
                </Link>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={`text-xs font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
                        {inStock ? t('inStock', language) : t('outOfStock', language)}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">{formattedPrice}</span>
                    {originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            {originalPrice}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={onAddToCart}
                    disabled={!inStock}
                    className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:shadow-md disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed group/btn"
                >
                    <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    {inStock ? t('addToCart', language) : t('outOfStock', language)}
                </button>
            </div>
        </div>
    )
}
