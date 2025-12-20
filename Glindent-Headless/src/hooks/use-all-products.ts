import { useState, useEffect, useCallback, useMemo } from "react";
import { IkasProduct, IkasProductList } from "@ikas/storefront";

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  subcategories?: Category[];
}

/**
 * Hook that uses ikas productList prop directly
 * No custom GraphQL - uses what ikas provides
 */
export function useProductsWithFilters(productList?: IkasProductList) {
  // Get products from ikas prop
  const allProducts = useMemo(() => {
    return (productList?.data || []) as IkasProduct[];
  }, [productList]);

  const totalCount = productList?.count || allProducts.length;

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Extract categories from products
  const categories = useMemo(() => {
    const categoryMap = new Map<string, Category>();
    
    allProducts.forEach(product => {
      const cats = (product as any).categories || [];
      cats.forEach((cat: any) => {
        if (!categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            parentId: cat.parentId || null,
          });
        }
      });
    });

    const allCats = Array.from(categoryMap.values());
    
    // Build tree - main categories have no parent
    const mainCats = allCats.filter(c => !c.parentId);
    mainCats.forEach(main => {
      main.subcategories = allCats.filter(c => c.parentId === main.id);
    });

    return { all: allCats, main: mainCats };
  }, [allProducts]);

  // Extract brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach(p => {
      if (p.brand?.name) brands.add(p.brand.name);
    });
    return Array.from(brands).sort();
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => {
        const cats = (product as any).categories || [];
        return cats.some((cat: any) => 
          cat.id === selectedCategory || 
          cat.name === selectedCategory ||
          cat.parentId === selectedCategory
        );
      });
    }

    // Filter by brand
    if (selectedBrand) {
      result = result.filter(product => product.brand?.name === selectedBrand);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.shortDescription || "").toLowerCase().includes(query) ||
        (product.brand?.name || "").toLowerCase().includes(query)
      );
    }

    return result;
  }, [allProducts, selectedCategory, selectedBrand, searchQuery]);

  // Get product count for a category
  const getCategoryProductCount = useCallback((categoryId: string) => {
    return allProducts.filter(product => {
      const cats = (product as any).categories || [];
      return cats.some((cat: any) => 
        cat.id === categoryId || 
        cat.parentId === categoryId
      );
    }).length;
  }, [allProducts]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchQuery("");
  }, []);

  return {
    // Products
    products: filteredProducts,
    allProducts,
    totalCount,
    isLoading: false,
    
    // Categories
    categories: categories.all,
    mainCategories: categories.main,
    
    // Filters
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    
    // Helpers
    availableBrands,
    getCategoryProductCount,
    clearFilters,
  };
}

export default useProductsWithFilters;
