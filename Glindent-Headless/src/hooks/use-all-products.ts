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

  // Extract categories from products with proper hierarchy
  const categories = useMemo(() => {
    const categoryMap = new Map<string, Category>();
    
    allProducts.forEach(product => {
      const cats = product.categories || [];
      cats.forEach((cat: any) => {
        if (!categoryMap.has(cat.id)) {
          // Check for parentId in different possible locations
          const parentId = cat.parentId || cat.parent?.id || null;
          
          categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            parentId: parentId,
          });
          
          // Also check categoryPathItems for hierarchy
          if (cat.categoryPathItems && Array.isArray(cat.categoryPathItems)) {
            cat.categoryPathItems.forEach((pathItem: any, index: number) => {
              if (!categoryMap.has(pathItem.id)) {
                const pathParentId = index > 0 ? cat.categoryPathItems[index - 1].id : null;
                categoryMap.set(pathItem.id, {
                  id: pathItem.id,
                  name: pathItem.name,
                  parentId: pathParentId,
                });
              }
            });
          }
        }
      });
    });

    const allCats = Array.from(categoryMap.values());
    
    // Debug: Log categories
    console.log('=== Categories Debug ===');
    console.log('All categories:', allCats.map(c => ({ id: c.id, name: c.name, parentId: c.parentId })));
    
    // Build tree - main categories have no parent (parentId is null/undefined)
    const mainCats = allCats.filter(c => !c.parentId);
    
    // Recursive function to build subcategories
    const buildSubcategories = (parentId: string): Category[] => {
      return allCats
        .filter(c => c.parentId === parentId)
        .map(cat => ({
          ...cat,
          subcategories: buildSubcategories(cat.id)
        }));
    };
    
    // Assign subcategories to main categories
    mainCats.forEach(main => {
      main.subcategories = buildSubcategories(main.id);
    });
    
    console.log('Main categories with subs:', mainCats.map(c => ({
      name: c.name,
      subcategories: c.subcategories?.map(s => s.name) || []
    })));

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

  // Get product count for a category (including products in subcategories)
  const getCategoryProductCount = useCallback((categoryId: string, includeSubcategories = true) => {
    // Direct count for this category
    const directCount = allProducts.filter(product => {
      const cats = (product as any).categories || [];
      return cats.some((cat: any) => cat.id === categoryId);
    }).length;
    
    if (!includeSubcategories) return directCount;
    
    // Also count products in subcategories
    const category = categories.all.find(c => c.id === categoryId);
    if (!category) return directCount;
    
    // Get all descendant category IDs
    const getDescendantIds = (cat: Category): string[] => {
      const ids: string[] = [];
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          ids.push(sub.id);
          ids.push(...getDescendantIds(sub));
        });
      }
      return ids;
    };
    
    // Find the category with subcategories from mainCategories
    const findCategoryWithSubs = (cats: Category[], id: string): Category | null => {
      for (const c of cats) {
        if (c.id === id) return c;
        if (c.subcategories) {
          const found = findCategoryWithSubs(c.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const catWithSubs = findCategoryWithSubs(categories.main, categoryId);
    if (!catWithSubs) return directCount;
    
    const descendantIds = getDescendantIds(catWithSubs);
    const totalCount = allProducts.filter(product => {
      const cats = (product as any).categories || [];
      return cats.some((cat: any) => 
        cat.id === categoryId || descendantIds.includes(cat.id)
      );
    }).length;
    
    return totalCount;
  }, [allProducts, categories]);

  // Check if a category or any of its subcategories have products
  const categoryHasProducts = useCallback((category: Category): boolean => {
    const count = getCategoryProductCount(category.id, true);
    return count > 0;
  }, [getCategoryProductCount]);

  // Filter main categories to only include those with products
  const filteredMainCategories = useMemo(() => {
    const filterCategories = (cats: Category[]): Category[] => {
      return cats
        .filter(cat => categoryHasProducts(cat))
        .map(cat => ({
          ...cat,
          subcategories: cat.subcategories 
            ? filterCategories(cat.subcategories)
            : undefined
        }));
    };
    
    return filterCategories(categories.main);
  }, [categories.main, categoryHasProducts]);

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
    mainCategories: filteredMainCategories, // Only categories with products
    
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
    categoryHasProducts,
    clearFilters,
  };
}

export default useProductsWithFilters;
