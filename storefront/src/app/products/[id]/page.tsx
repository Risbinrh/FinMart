'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Star,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedCleaning, setSelectedCleaning] = useState(
    product?.cleaningOptions[0]?.id || 'whole'
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const selectedCleaningOption = product.cleaningOptions.find(
    (opt) => opt.id === selectedCleaning
  );
  const totalPrice =
    (product.price + (selectedCleaningOption?.extraPrice || 0)) * quantity;

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-primary">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button - Mobile */}
        <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4 lg:hidden">
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.originalPrice && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
                  <p className="text-lg text-muted-foreground">{product.tamilName}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">{product.freshness}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              <span className="text-lg text-muted-foreground">/{product.unit}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Cleaning Options */}
            <div>
              <h3 className="font-semibold mb-3">Select Cleaning Option</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.cleaningOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCleaning(option.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      selectedCleaning === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{option.name}</p>
                    <p className="text-xs text-muted-foreground">{option.tamilName}</p>
                    {option.extraPrice > 0 && (
                      <p className="text-xs text-primary mt-1">+₹{option.extraPrice}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity ({product.unit})</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                    disabled={quantity <= 0.5}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold">{quantity} {product.unit}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 0.5)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Min: 500g
                </span>
              </div>
            </div>

            {/* Total and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">₹{totalPrice}</p>
              </div>
              <div className="flex gap-2">
                <Button size="lg" className="flex-1 sm:flex-none gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="secondary">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary mb-1" />
                <p className="text-xs font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Above ₹300</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-primary mb-1" />
                <p className="text-xs font-medium">Fresh Guarantee</p>
                <p className="text-xs text-muted-foreground">100% Quality</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-primary mb-1" />
                <p className="text-xs font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">If not satisfied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Best Cooking Methods:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.bestFor.map((method) => (
                        <Badge key={method} variant="secondary">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Nutritional Information (per 100g)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {product.nutritionalInfo.calories}
                      </p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {product.nutritionalInfo.protein}
                      </p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {product.nutritionalInfo.fat}
                      </p>
                      <p className="text-sm text-muted-foreground">Fat</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {product.nutritionalInfo.omega3}
                      </p>
                      <p className="text-sm text-muted-foreground">Omega-3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">{product.rating}</p>
                      <div className="flex gap-0.5 justify-center my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.reviewCount} reviews
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-center">
                    Reviews will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
