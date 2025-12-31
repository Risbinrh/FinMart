'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Grid3X3,
  LayoutList,
  Fish,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpDown,
  X,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import FreshCatchCard from '@/components/product/FreshCatchCard';
import { medusa, Product, ProductCategory } from '@/lib/medusa';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('q') || '';

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { language } = useLanguage();
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { product_categories } = await medusa.getCategories();
        setCategories(product_categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    // Wait for categories to load before filtering by category
    if (selectedCategory !== 'all' && categories.length === 0) {
      return; // Will re-run when categories load
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Find category id from handle
        let categoryIds: string[] | undefined;
        if (selectedCategory !== 'all') {
          const category = categories.find(c => c.handle === selectedCategory);
          if (category) {
            categoryIds = [category.id];
          }
        }

        const { products } = await medusa.getProducts({
          limit: 50,
          category_id: categoryIds,
          q: searchQuery || undefined,
        });
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, categories, searchQuery]);

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Sort products client-side
  // Helper to get product price (supports both Medusa v1 and v2)
  const getProductPrice = (product: Product): number => {
    const variant = product.variants?.[0];
    if (!variant) return 0;
    // Medusa v2: calculated_price
    if (variant.calculated_price?.calculated_amount) {
      return variant.calculated_price.calculated_amount;
    }
    // Medusa v1 fallback: prices array
    return variant.prices?.[0]?.amount || 0;
  };

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = getProductPrice(a);
    const priceB = getProductPrice(b);

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
      default:
        return 0;
    }
  });

  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );

  const handleCategorySelect = (handle: string) => {
    setSelectedCategory(handle);
    setFilterOpen(false); // Close mobile filter sheet
  };

  const CategoryButton = ({ category, isMobile = false }: { category: ProductCategory | null; isMobile?: boolean }) => {
    const isAll = category === null;
    const isSelected = isAll ? selectedCategory === 'all' : selectedCategory === category?.handle;

    return (
      <button
        onClick={() => handleCategorySelect(isAll ? 'all' : category!.handle)}
        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${isSelected
          ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-md'
          : 'hover:bg-primary/5 text-gray-700'
          }`}
      >
        <span className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-primary/10'
            }`}>
            <Fish className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
          </div>
          {isAll ? t('allCategories', language) : (language === 'ta' && typeof category?.metadata?.tamil_name === 'string' ? category.metadata.tamil_name : category?.name)}
        </span>
        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-white' : 'text-gray-400 group-hover:translate-x-1'
          }`} />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Fish className="h-4 w-4 text-primary" />
                  </div>
                  {t('categories', language)}
                </h3>
                <div className="space-y-2">
                  <CategoryButton category={null} />
                  {categories.map((cat) => (
                    <CategoryButton key={cat.id} category={cat} />
                  ))}
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{t('freshDaily', language)}</span>
                </div>
                <p className="text-sm text-white/90 mb-3">
                  {t('fishArrivesDaily', language)}
                </p>
                <div className="text-xs bg-white/20 rounded-lg px-3 py-2 text-center font-medium">
                  {t('orderBefore10pm', language)}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: Filters, Sort, View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              {/* Left: Results count & active filters */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile Filter Button */}
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {selectedCategory !== 'all' && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-white">1</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Categories</h3>
                      <CategoryButton category={null} isMobile />
                      {categories.map((cat) => (
                        <CategoryButton key={cat.id} category={cat} isMobile />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  {t('showing', language)} <span className="font-semibold text-foreground">{sortedProducts.length}</span> {t('productsText', language)}
                </p>
                {selectedCategory !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer text-xs"
                    onClick={() => setSelectedCategory('all')}
                  >
                    {language === 'ta' && categories.find((c) => c.handle === selectedCategory)?.metadata?.tamil_name
                      ? String(categories.find((c) => c.handle === selectedCategory)?.metadata?.tamil_name)
                      : categories.find((c) => c.handle === selectedCategory)?.name}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer text-xs"
                    onClick={clearSearch}
                  >
                    "{searchQuery}"
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>

              {/* Right: Sort & View Toggle */}
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="Sort" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Popular
                      </div>
                    </SelectItem>
                    <SelectItem value="price-low">Price: Low-High</SelectItem>
                    <SelectItem value="price-high">Price: High-Low</SelectItem>
                    <SelectItem value="newest">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Newest
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {sortedProducts.map((product) => (
                  <FreshCatchCard key={product.id} product={product} view={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="h-24 w-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Fish className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('noProductsFound', language)}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('adjustSearchFilter', language)}
                  {/* Try selecting a different category */}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory('all')}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  {t('clearFilters', language)}
                  {/* Clear filters */}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
