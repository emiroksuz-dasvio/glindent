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
          
          // Also check categoryPathItems for hierarchy (these are parent categories)
          if (cat.categoryPathItems && Array.isArray(cat.categoryPathItems)) {
            cat.categoryPathItems.forEach((pathItem: any, index: number) => {
              if (!categoryMap.has(pathItem.id)) {
                // categoryPathItems go from root to parent, so parent is the one before it
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

    // If no categories found, create fallback categories based on brand/product name patterns
    let mainCats = allCats.filter(c => !c.parentId);
    let finalAllCats = allCats;

    if (allCats.length === 0 && allProducts.length > 0) {
      // Analyze products to create intelligent fallback categories
      const labProducts = allProducts.filter(p => {
        const name = (p.name || '').toLowerCase();
        const desc = ((p as any).shortDescription || '').toLowerCase();
        return name.includes('zirconia') || name.includes('porcelain') || name.includes('ceram') || 
               name.includes('glass') || desc.includes('lab') || (p.brand?.name || '').toLowerCase().includes('ceram');
      });
      
      const chairProducts = allProducts.filter(p => {
        const name = (p.name || '').toLowerCase();
        const desc = ((p as any).shortDescription || '').toLowerCase();
        return name.includes('composite') || name.includes('prosthetic') || name.includes('prophy') ||
               name.includes('cem') || name.includes('dent') || name.includes('teeth') ||
               desc.includes('chairside') || desc.includes('interim');
      });
      
      const medicalProducts = allProducts.filter(p => {
        const name = (p.name || '').toLowerCase();
        return name.includes('instrument') || name.includes('device') || name.includes('surgical') ||
               name.includes('clean') || name.includes('barrier') || name.includes('cord') ||
               name.includes('plate') || name.includes('retraction');
      });

      // Create fallback categories
      if (labProducts.length > 0) {
        const labCat: Category = {
          id: 'cat-labside',
          name: 'Labside',
          parentId: null,
          subcategories: []
        };
        mainCats.push(labCat);
        categoryMap.set(labCat.id, labCat);
      }
      
      if (chairProducts.length > 0) {
        const chairCat: Category = {
          id: 'cat-chairside',
          name: 'Chairside',
          parentId: null,
          subcategories: []
        };
        mainCats.push(chairCat);
        categoryMap.set(chairCat.id, chairCat);
      }
      
      if (medicalProducts.length > 0) {
        const medCat: Category = {
          id: 'cat-medical',
          name: 'Medical Devices',
          parentId: null,
          subcategories: []
        };
        mainCats.push(medCat);
        categoryMap.set(medCat.id, medCat);
      }
      
      finalAllCats = Array.from(categoryMap.values());
    } else {
      // Normal case - build tree from existing categories
      // Build tree - main categories have no parent (parentId is null/undefined)
      mainCats = allCats.filter(c => !c.parentId);
    }

    // Recursive function to build subcategories
    const buildSubcategories = (parentId: string): Category[] => {
      return finalAllCats
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

    // Choose the top 3 root-level categories dynamically based on product count
    const getCountForCategory = (cat: Category) => {
      // Count products that belong to this category or any of its descendants
      const collectIds = (c: Category): string[] => {
        const ids = [c.id];
        if (c.subcategories) {
          c.subcategories.forEach(sc => ids.push(...collectIds(sc)));
        }
        return ids;
      };
      const ids = collectIds(cat);
      return allProducts.filter(p => (p.categories || []).some((pc: any) => ids.includes(pc.id))).length;
    };

    const mainCatsWithCounts = mainCats.map(mc => ({ cat: mc, count: getCountForCategory(mc) }));
    mainCatsWithCounts.sort((a, b) => b.count - a.count);

    // Don't try to match by name - just pick the top 3 by product count
    const selected = mainCatsWithCounts.slice(0, 3).map(mc => mc.cat);

    // Determine which categories to show in sidebar
    // Always use the "selected" categories (which are now the preferred names: Labside, Chairside, Medical Devices)
    const categoriesToShow = selected.length > 0 ? selected.slice(0, 3) : mainCats.slice(0, 3);

    // Return selected top categories (max 3)
    return { all: finalAllCats, main: categoriesToShow };
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
      // Check if this is a fallback category (starts with 'fallback-')
      if (selectedCategory.startsWith('fallback-')) {
        // Filter by category name based on fallback logic
        result = result.filter(product => {
          const name = (product.name || '').toLowerCase();
          const desc = ((product as any).shortDescription || '').toLowerCase();
          
          if (selectedCategory.includes('labside')) {
            return name.includes('zirconia') || name.includes('porcelain') || name.includes('ceram') || 
                   name.includes('glass') || desc.includes('lab') || (product.brand?.name || '').toLowerCase().includes('ceram');
          } else if (selectedCategory.includes('chairside')) {
            return name.includes('composite') || name.includes('prosthetic') || name.includes('prophy') ||
                   name.includes('cem') || name.includes('dent') || name.includes('teeth') ||
                   desc.includes('chairside') || desc.includes('interim');
          } else if (selectedCategory.includes('medical')) {
            return name.includes('instrument') || name.includes('device') || name.includes('surgical') ||
                   name.includes('clean') || name.includes('barrier') || name.includes('cord') ||
                   name.includes('plate') || name.includes('retraction');
          }
          return false;
        });
      } else {
        // Normal category filtering
        result = result.filter(product => {
          const cats = (product as any).categories || [];
          return cats.some((cat: any) => 
            cat.id === selectedCategory || 
            cat.name === selectedCategory ||
            cat.parentId === selectedCategory
          );
        });
      }
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
    // Check if this is a fallback category (cat-labside, cat-chairside, cat-medical)
    if (categoryId.startsWith('cat-')) {
      const name = (categoryId || '').toLowerCase();
      const count = allProducts.filter(product => {
        const pName = (product.name || '').toLowerCase();
        const desc = ((product as any).shortDescription || '').toLowerCase();
        
        if (name.includes('labside')) {
          return pName.includes('zirconia') || pName.includes('porcelain') || pName.includes('ceram') || 
                 pName.includes('glass') || desc.includes('lab') || (product.brand?.name || '').toLowerCase().includes('ceram');
        } else if (name.includes('chairside')) {
          return pName.includes('composite') || pName.includes('prosthetic') || pName.includes('prophy') ||
                 pName.includes('cem') || pName.includes('dent') || pName.includes('teeth') ||
                 desc.includes('chairside') || desc.includes('interim');
        } else if (name.includes('medical')) {
          return pName.includes('instrument') || pName.includes('device') || pName.includes('surgical') ||
                 pName.includes('clean') || pName.includes('barrier') || pName.includes('cord') ||
                 pName.includes('plate') || pName.includes('retraction');
        }
        return false;
      }).length;
      return count;
    }

    // Check if this is a fallback category (old style)
    if (categoryId.startsWith('fallback-')) {
      const name = (categoryId || '').toLowerCase();
      const count = allProducts.filter(product => {
        const pName = (product.name || '').toLowerCase();
        const desc = ((product as any).shortDescription || '').toLowerCase();
        
        if (name.includes('labside')) {
          return pName.includes('zirconia') || pName.includes('porcelain') || pName.includes('ceram') || 
                 pName.includes('glass') || desc.includes('lab') || (product.brand?.name || '').toLowerCase().includes('ceram');
        } else if (name.includes('chairside')) {
          return pName.includes('composite') || pName.includes('prosthetic') || pName.includes('prophy') ||
                 pName.includes('cem') || pName.includes('dent') || pName.includes('teeth') ||
                 desc.includes('chairside') || desc.includes('interim');
        } else if (name.includes('medical')) {
          return pName.includes('instrument') || pName.includes('device') || pName.includes('surgical') ||
                 pName.includes('clean') || pName.includes('barrier') || pName.includes('cord') ||
                 pName.includes('plate') || pName.includes('retraction');
        }
        return false;
      }).length;
      return count;
    }
    
    // Direct count for this category
    const directCount = allProducts.filter(product => {
      const cats = (product as any).categories || [];
      return cats.some((cat: any) => cat.id === categoryId);
    }).length;

    if (!includeSubcategories) return directCount;
    
    // Also count products in subcategories - use mainCategories from useMemo above
    const getCats = () => {
      const cats = new Set<string>();
      const map = new Map<string, Category>();
      
      allProducts.forEach(p => {
        const pCats = (p as any).categories || [];
        pCats.forEach((c: any) => {
          if (c.id && c.name) {
            cats.add(c.id);
            if (!map.has(c.id)) {
              map.set(c.id, {
                id: c.id,
                name: c.name,
                parentId: c.parentId || null,
                subcategories: []
              });
            }
          }
        });
      });
      
      // Build tree
      const roots = Array.from(map.values()).filter(c => !c.parentId);
      const buildTree = (parent: Category) => {
        const children = Array.from(map.values()).filter(c => c.parentId === parent.id);
        parent.subcategories = children.map(c => {
          buildTree(c);
          return c;
        });
      };
      
      roots.forEach(r => buildTree(r));
      return roots;
    };
    
    const mainCats = getCats();
    const catWithSubs = mainCats.find(c => c.id === categoryId);
    if (!catWithSubs) return directCount;
    
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
    
    const descendantIds = getDescendantIds(catWithSubs);
    const totalCount = allProducts.filter(product => {
      const cats = (product as any).categories || [];
      return cats.some((cat: any) => 
        cat.id === categoryId || descendantIds.includes(cat.id)
      );
    }).length;
    
    return totalCount;
  }, [allProducts]);

  // Check if a category or any of its subcategories have products
  const categoryHasProducts = useCallback((category: Category): boolean => {
    return getCategoryProductCount(category.id, true) > 0;
  }, [getCategoryProductCount]);

  // Don't need filteredMainCategories - just return categories.main directly
  // since we already selected the correct ones in the categories useMemo

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
    mainCategories: categories.main, // The 3 selected main categories (Labside, Chairside, Medical Devices)
    
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
