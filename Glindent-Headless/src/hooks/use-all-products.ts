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
    
    // First, log what products we have
    console.log('=== Products Check ===');
    console.log('Total products:', allProducts.length);
    if (allProducts.length > 0) {
      console.log('First product sample:', {
        name: allProducts[0].name,
        categoriesLength: (allProducts[0].categories || []).length,
        categories: allProducts[0].categories?.slice(0, 3),
        firstCategoryDetail: allProducts[0].categories?.[0]
      });
      // Log all product categories to understand structure
      console.log('All product categories:', allProducts.map(p => ({
        productName: p.name,
        categoryIds: (p.categories || []).map((c: any) => c.id),
        categoryNames: (p.categories || []).map((c: any) => c.name),
        categoryParentIds: (p.categories || []).map((c: any) => c.parentId)
      })));
    }
    
    // Log all categories with their parentId mapping
    console.log('=== Category Mapping ===');
    allProducts.forEach((p, idx) => {
      const cats = p.categories || [];
      if (cats.length > 0) {
        console.log(`Product ${idx}: ${p.name}`);
        cats.forEach(c => {
          console.log(`  -> Category: ${c.name} (id: ${c.id}, parentId: ${c.parentId})`);
        });
      }
    });
    
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
    
    // Debug: Log categories
    console.log('=== Categories Debug ===');
    console.log('Total unique categories found:', allCats.length);
    if (allCats.length === 0) {
      console.warn('⚠️ NO CATEGORIES FOUND! This might be an issue with the data structure.');
    }
    console.log('All categories:', allCats.map(c => ({ id: c.id, name: c.name, parentId: c.parentId })));
    console.log('Main categories (no parentId):', allCats.filter(c => !c.parentId).map(c => c.name));
    console.log('🔍 ALL MAIN CATEGORY NAMES:', allCats.filter(c => !c.parentId).map(c => c.name).join(', '));
    
    // If no categories found, create fallback categories based on brand/product name patterns
    let mainCats = allCats.filter(c => !c.parentId);
    let finalAllCats = allCats;
    
    if (allCats.length === 0 && allProducts.length > 0) {
      console.warn('⚠️ NO CATEGORIES FROM IKAS! Creating fallback categories from product analysis...');
      
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
      console.log('Fallback categories created:', mainCats.map(c => c.name));
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

    console.log('Main categories with subs:', mainCats.map(c => ({
      name: c.name,
      subcategories: c.subcategories?.map(s => s.name) || []
    })));

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

    console.log('=== Main categories with counts ===');
    mainCatsWithCounts.forEach(mc => {
      console.log(`${mc.cat.name}: ${mc.count} products`);
    });

    // Don't try to match by name - just pick the top 3 by product count
    const selected = mainCatsWithCounts.slice(0, 3).map(mc => mc.cat);

    // Log the final selected categories
    console.log('=== Final Selected Categories ===');
    console.log('Selected for sidebar:', selected.slice(0, 3).map(c => ({ id: c.id, name: c.name, parentId: c.parentId })));
    
    // If no categories found, log warning and prepare fallback
    if (finalAllCats.length === 0) {
      console.warn('⚠️ FALLBACK: No categories detected. Categories might not be loaded from iKAS.');
      console.warn('Please check:');
      console.warn('1. Are products loading?', allProducts.length > 0);
      console.warn('2. Do products have a categories array?');
      console.warn('3. Do categories have id, name, and parentId fields?');
    }

    // Determine which categories to show in sidebar
    // Always use the "selected" categories (which are now the preferred names: Labside, Chairside, Medical Devices)
    const categoriesToShow = selected.length > 0 ? selected.slice(0, 3) : mainCats.slice(0, 3);

    console.log('Final categories to show:', categoriesToShow.map(c => c.name));

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
      console.log(`getCategoryProductCount(${categoryId}): fallback count = ${count}`);
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
    
    console.log(`getCategoryProductCount(${categoryId}): directCount=${directCount}`);
    
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
    const count = getCategoryProductCount(category.id, true);
    console.log(`categoryHasProducts(${category.name}): ${count}`);
    return count > 0;
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
