'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
  Fish,
  Check,
  ChevronRight,
  Zap,
  Award,
  Leaf,
  ThermometerSnowflake,
  PlayCircle,
  ChefHat,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { medusa, Product, ProductVariant, formatPrice, getVariantPrice } from '@/lib/medusa';
import { useCart } from '@/context/CartContext';
import FreshCatchCard from '@/components/product/FreshCatchCard';

// Fish handle to recipe mapping
const fishRecipeMap: Record<string, { id: string; title: string; tamilTitle: string; image: string; videoId: string; duration: number; }[]> = {
  'seer-fish': [
    { id: '1', title: 'Vanjaram Fish Fry', tamilTitle: 'வஞ்சிரம் வறுவல்', image: 'https://img.youtube.com/vi/o8lDCY2_jyw/maxresdefault.jpg', videoId: 'o8lDCY2_jyw', duration: 30 },
  ],
  'mackerel': [
    { id: '2', title: 'Meen Kuzhambu', tamilTitle: 'மீன் குழம்பு', image: 'https://img.youtube.com/vi/-kPEvUSZkEM/maxresdefault.jpg', videoId: '-kPEvUSZkEM', duration: 40 },
  ],
  'tiger-prawns': [
    { id: '3', title: 'Prawn Biryani', tamilTitle: 'இறால் பிரியாணி', image: 'https://img.youtube.com/vi/OYo9kHRxeH0/maxresdefault.jpg', videoId: 'OYo9kHRxeH0', duration: 60 },
  ],
  'prawns': [
    { id: '3', title: 'Prawn Biryani', tamilTitle: 'இறால் பிரியாணி', image: 'https://img.youtube.com/vi/OYo9kHRxeH0/maxresdefault.jpg', videoId: 'OYo9kHRxeH0', duration: 60 },
  ],
  'blue-crab': [
    { id: '4', title: 'Crab Masala', tamilTitle: 'நண்டு மசாலா', image: 'https://img.youtube.com/vi/2BSVhda6tWs/maxresdefault.jpg', videoId: '2BSVhda6tWs', duration: 50 },
  ],
  'crab': [
    { id: '4', title: 'Crab Masala', tamilTitle: 'நண்டு மசாலா', image: 'https://img.youtube.com/vi/2BSVhda6tWs/maxresdefault.jpg', videoId: '2BSVhda6tWs', duration: 50 },
  ],
  'pomfret': [
    { id: '5', title: 'Kerala Fish Molee', tamilTitle: 'கேரளா மீன் மொலி', image: 'https://img.youtube.com/vi/9qXZ_aous-Y/maxresdefault.jpg', videoId: '9qXZ_aous-Y', duration: 35 },
  ],
  'pomfret-white': [
    { id: '8', title: 'White Pomfret Fry', tamilTitle: 'வெள்ளை வாவல் வறுவல்', image: 'https://img.youtube.com/vi/H88X5b2lx9w/maxresdefault.jpg', videoId: 'H88X5b2lx9w', duration: 30 },
  ],
  'pomfret-black': [
    { id: '9', title: 'Black Pomfret Masala', tamilTitle: 'கருப்பு வாவல் மசாலா', image: 'https://img.youtube.com/vi/-TH4QuqJnUM/hqdefault.jpg', videoId: '-TH4QuqJnUM', duration: 40 },
  ],
  'squid': [
    { id: '6', title: 'Squid Roast', tamilTitle: 'கணவாய் வறுவல்', image: 'https://img.youtube.com/vi/7y0kgjyhHZ8/maxresdefault.jpg', videoId: '7y0kgjyhHZ8', duration: 30 },
  ],
  'baby-squid': [
    { id: '14', title: 'Baby Squid Fry', tamilTitle: 'குட்டி கணவாய் வறுவல்', image: 'https://img.youtube.com/vi/edCbLvpLVEI/maxresdefault.jpg', videoId: 'edCbLvpLVEI', duration: 20 },
  ],
  'king-fish': [
    { id: '7', title: 'King Fish Fry', tamilTitle: 'நெய்மீன் வறுவல்', image: 'https://img.youtube.com/vi/x0h_sDFZn6w/maxresdefault.jpg', videoId: 'x0h_sDFZn6w', duration: 35 },
  ],
  'red-snapper': [
    { id: '10', title: 'Red Snapper Curry', tamilTitle: 'சங்கரா மீன் குழம்பு', image: 'https://img.youtube.com/vi/BacKM_-N2q8/maxresdefault.jpg', videoId: 'BacKM_-N2q8', duration: 45 },
  ],
  'barramundi': [
    { id: '11', title: 'Barramundi Fry', tamilTitle: 'கொடுவா வறுவல்', image: 'https://img.youtube.com/vi/NlL2htQNWoo/hqdefault.jpg', videoId: 'NlL2htQNWoo', duration: 35 },
  ],
  'sea-bass': [
    { id: '11', title: 'Barramundi Fry', tamilTitle: 'கொடுவா வறுவல்', image: 'https://img.youtube.com/vi/NlL2htQNWoo/hqdefault.jpg', videoId: 'NlL2htQNWoo', duration: 35 },
  ],
  'indian-salmon': [
    { id: '12', title: 'Indian Salmon Curry', tamilTitle: 'காலா மீன் குழம்பு', image: 'https://img.youtube.com/vi/SbN8AILtKTQ/maxresdefault.jpg', videoId: 'SbN8AILtKTQ', duration: 45 },
  ],
  'sardine': [
    { id: '13', title: 'Sardine Fry', tamilTitle: 'மத்தி வறுவல்', image: 'https://img.youtube.com/vi/T-CDURLMH6s/maxresdefault.jpg', videoId: 'T-CDURLMH6s', duration: 25 },
  ],
  'dried-sardine': [
    { id: '15', title: 'Dried Sardine Fry', tamilTitle: 'மத்தி கருவாடு வறுவல்', image: 'https://img.youtube.com/vi/NeDBEQtT3EE/hqdefault.jpg', videoId: 'NeDBEQtT3EE', duration: 25 },
  ],
  'dried-prawns': [
    { id: '16', title: 'Dried Prawn Curry', tamilTitle: 'இறால் கருவாடு குழம்பு', image: 'https://img.youtube.com/vi/YQFa018AL5o/maxresdefault.jpg', videoId: 'YQFa018AL5o', duration: 40 },
  ],
  'dried-anchovy': [
    { id: '17', title: 'Dried Anchovy Fry', tamilTitle: 'நெத்திலி கருவாடு வறுவல்', image: 'https://img.youtube.com/vi/62HGi9-qKDI/maxresdefault.jpg', videoId: '62HGi9-qKDI', duration: 20 },
  ],
  'anchovy': [
    { id: '17', title: 'Dried Anchovy Fry', tamilTitle: 'நெத்திலி கருவாடு வறுவல்', image: 'https://img.youtube.com/vi/62HGi9-qKDI/maxresdefault.jpg', videoId: '62HGi9-qKDI', duration: 20 },
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const handle = params.id as string;

  const { addToCart, isLoading: cartLoading } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoId: string; title: string }>({ isOpen: false, videoId: '', title: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { products } = await medusa.getProductByHandle(handle);
        if (products && products.length > 0) {
          const prod = products[0];
          setProduct(prod);
          setSelectedVariant(prod.variants?.[0] || null);

          if (prod.categories && prod.categories.length > 0) {
            const { products: related } = await medusa.getProducts({
              category_id: [prod.categories[0].id],
              limit: 5,
            });
            setRelatedProducts(related.filter(p => p.id !== prod.id).slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      setIsAdding(true);
      await addToCart(selectedVariant.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-24 w-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Fish className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist</p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tamilName = product.subtitle || (product.metadata?.tamil_name as string) || '';
  const freshness = (product.metadata?.freshness as string) || 'Fresh catch of the day';
  const rating = (product.metadata?.rating as number) || 4.5;
  const reviewCount = (product.metadata?.review_count as number) || Math.floor(Math.random() * 100 + 50);
  const bestFor = (product.metadata?.best_for as string[]) || ['Fry', 'Curry', 'Grill', 'Steam'];
  const nutritionalInfo = (product.metadata?.nutritional_info as Record<string, string>) || {
    calories: '100 kcal',
    protein: '20g',
    fat: '2g',
    omega3: '0.5g',
  };

  const images = product.thumbnail
    ? [product.thumbnail, ...(product.images?.filter(img => img.url !== product.thumbnail).map(img => img.url) || [])]
    : product.images?.length > 0
      ? product.images.map(img => img.url)
      : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop'];

  const currentPrice = selectedVariant ? getVariantPrice(selectedVariant) : 0;
  const originalPrice = product.metadata?.original_price as number;
  const discountPercent = originalPrice && currentPrice < originalPrice
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : 0;
  const totalPrice = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-primary truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Back Button - Mobile */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 lg:hidden">
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[15/9] max-w-2xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 shadow-lg">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain p-6 rounded-2xl"
              />

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-500 text-white text-sm font-bold px-3 py-1.5 shadow-lg">
                  {discountPercent}% OFF
                </Badge>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="h-11 w-11 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Stock Badge */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  In Stock
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 bg-gray-50 ${selectedImage === index
                      ? 'border-primary shadow-md ring-2 ring-primary/20'
                      : 'border-transparent hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            {/* Freshness Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <Clock className="h-4 w-4" />
              {freshness}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.title}</h1>
              {tamilName && (
                <p className="text-base text-muted-foreground mt-1">{tamilName}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 text-sm">{rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {reviewCount} reviews
              </span>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm text-green-600 font-medium">500+ sold</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">{formatPrice(currentPrice)}</span>
                <span className="text-sm text-muted-foreground">/kg</span>
                {originalPrice && currentPrice < originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  You save {formatPrice(originalPrice - currentPrice)} ({discountPercent}% off)
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-bold text-lg mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setQuantity(Math.max(.5, quantity - .5))}
                    disabled={quantity <= .5}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setQuantity(quantity + 0.5)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({quantity} kg)
                </span>
              </div>
            </div>

            {/* Total and Buttons */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold text-primary">{formatPrice(totalPrice)}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm">
                  <Truck className="h-4 w-4 mr-1" />
                  Free Delivery
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 h-11 gap-2 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                  onClick={handleAddToCart}
                  disabled={isAdding || cartLoading || !selectedVariant}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Link href="/checkout" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full h-11 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white">
                    <Zap className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-white rounded-xl border">
                <div className="h-10 w-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-semibold">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Above ₹300</p>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border">
                <div className="h-10 w-10 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-xs font-semibold">Fresh Guarantee</p>
                <p className="text-xs text-muted-foreground">100% Quality</p>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border">
                <div className="h-10 w-10 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-xs font-semibold">Premium Quality</p>
                <p className="text-xs text-muted-foreground">Handpicked</p>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border">
                <div className="h-10 w-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs font-semibold">Easy Returns</p>
                <p className="text-xs text-muted-foreground">If not satisfied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-white rounded-xl p-1 h-auto flex-wrap">
              <TabsTrigger value="description" className="rounded-lg px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                Description
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="rounded-lg px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                Nutrition Facts
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                Reviews ({reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="prose max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      Best Cooking Methods
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {bestFor.map((method) => (
                        <Badge key={method} className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <ThermometerSnowflake className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-semibold">Storage</p>
                        <p className="text-sm text-muted-foreground">Keep refrigerated at 0-4°C</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <Clock className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold">Shelf Life</p>
                        <p className="text-sm text-muted-foreground">Best consumed within 2-3 days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h4 className="font-bold text-xl mb-6">Nutritional Information (per 100g)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl">
                      <p className="text-3xl font-bold text-red-600">
                        {nutritionalInfo.calories}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Calories</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                      <p className="text-3xl font-bold text-blue-600">
                        {nutritionalInfo.protein}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Protein</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl">
                      <p className="text-3xl font-bold text-amber-600">
                        {nutritionalInfo.fat}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Fat</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                      <p className="text-3xl font-bold text-green-600">
                        {nutritionalInfo.omega3}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Omega-3</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800">
                      <strong>Health Benefits:</strong> Rich in high-quality protein, omega-3 fatty acids, and essential vitamins.
                      Supports heart health, brain function, and overall wellness.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                    <div className="text-center p-6 bg-amber-50 rounded-2xl">
                      <p className="text-5xl font-bold text-amber-600">{rating}</p>
                      <div className="flex gap-1 justify-center my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= Math.round(rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {reviewCount} reviews
                      </p>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-3">{stars}</span>
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 3}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-10">
                            {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : '3%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Be the first to review this product!</p>
                    <Button variant="outline" className="gap-2">
                      <Star className="h-4 w-4" />
                      Write a Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recipe Section */}
        {fishRecipeMap[handle] && fishRecipeMap[handle].length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Recipe for {product.title}</h2>
                  <p className="text-muted-foreground text-sm">Learn how to cook this delicious fish</p>
                </div>
              </div>
              <Link href="/recipes">
                <Button variant="ghost" className="gap-1">
                  All Recipes
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fishRecipeMap[handle].map((recipe) => (
                <Card
                  key={recipe.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg cursor-pointer"
                  onClick={() => setVideoModal({ isOpen: true, videoId: recipe.videoId, title: recipe.title })}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                      Video Recipe
                    </Badge>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg">{recipe.title}</h3>
                      <p className="text-white/80 text-sm">{recipe.tamilTitle}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{recipe.duration} mins</span>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        Watch Now
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Similar Fishes You May Like</h2>
              <Link href="/products">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <FreshCatchCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setVideoModal({ isOpen: false, videoId: '', title: '' })}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoModal.videoId}?autoplay=1`}
                  title={videoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-gray-900">
                <h3 className="text-white font-bold text-lg">{videoModal.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
