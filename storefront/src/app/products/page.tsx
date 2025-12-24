'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tamilName.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'all' || product.categorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Fresh Fish & Seafood</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search fish, prawns, crabs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.slug ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {cat.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {cat.productCount}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Mode Toggle - Desktop */}
          <div className="hidden sm:flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="opacity-60">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  {['Under ₹200', '₹200 - ₹500', '₹500 - ₹800', 'Above ₹800'].map(
                    (range) => (
                      <label
                        key={range}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input type="checkbox" className="rounded" />
                        {range}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    In Stock
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    Include Limited Stock
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}

            {sortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
