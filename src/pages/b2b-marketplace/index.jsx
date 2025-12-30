import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import GlobalSearch from "@/components/ui/GlobalSearch";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// ✅ Import explícito con extensión para evitar el error de Vite
import {
  getMarketplaceProducts,
  getMarketplaceVendors,
} from "@/api/marketplace/marketplace.js";

// Componentes compartidos de marketplace (misma UX que B2C)
import FilterPanel from "../marketplace/components/FilterPanel";
import ShoppingCart from "../marketplace/components/ShoppingCart";
import ProductGrid from "../marketplace/components/ProductGrid";
import QuickFilters from "../marketplace/components/QuickFilters";

const B2BMarketplace = () => {
  const navigate = useNavigate();

  // ✅ Mantén rol real
  const [userRole, setUserRole] = useState("doctor");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Orden de compra usando la misma mecánica del carrito
  const [poItems, setPoItems] = useState([]);

  // Filtros (mantengo la misma “shape” del B2C para que FilterPanel/QuickFilters no se rompan)
  const [filters, setFilters] = useState({
    category: "all",
    provider: "all", // en B2B lo usaremos como vendor
    priceRange: { min: 0, max: 5000 },
    availability: "all",
    insuranceCompatible: false, // no aplica en B2B pero se conserva
    sortBy: "relevance",
    search: "",
    freeShipping: false,
    newProducts: false,
    onSale: false,
  });

  const [allProductsRaw, setAllProductsRaw] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // ------------------------------------------------------
  // Boot
  // ------------------------------------------------------
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") || "doctor";
    setUserRole(savedRole);
    localStorage.setItem("marketplace_mode", "b2b");
  }, []);

  // ------------------------------------------------------
  // Load B2B catalog desde API fake
  // ------------------------------------------------------
  useEffect(() => {
    const products = getMarketplaceProducts("b2b") || [];
    const v = getMarketplaceVendors("b2b") || [];
    setAllProductsRaw(products);
    setVendors(v);
  }, []);

  // ------------------------------------------------------
  // Normalizador:
  // Hace que productos B2B tengan los campos que el grid B2C espera
  // ------------------------------------------------------
  const allProducts = useMemo(() => {
    return (allProductsRaw || []).map((p) => {
      const firstTier = p?.priceTiers?.[0];
      const bestBasePrice =
        typeof p?.price === "number"
          ? p.price
          : typeof p?.priceUSD === "number"
          ? p.priceUSD
          : typeof firstTier?.priceUSD === "number"
          ? firstTier.priceUSD
          : 0;

      return {
        ...p,
        // Campos “compatibles B2C”
        provider: p?.vendor || p?.provider || "Proveedor",
        price: bestBasePrice,
        priceVES: p?.priceVES || undefined,
        discount: p?.discount || 0,
        insuranceCompatible: false,
        isNew: Boolean(p?.isNew),
        deliveryTime: p?.deliveryTime || (p?.leadTimeDays ? `${p.leadTimeDays} días` : ""),
        availableFor: p?.availableFor || ["b2b"],

        // Campos B2B útiles para que el card los tenga disponibles si el grid los usa
        minOrderQuantity: p?.minOrderQuantity ?? 1,
        priceTiers: p?.priceTiers ?? [],
        vendorId: p?.vendorId,
        vendor: p?.vendor,
        certification: p?.certification,
        stock: p?.stock ?? 0,
        rating: p?.rating ?? 0,
      };
    });
  }, [allProductsRaw]);

  // ------------------------------------------------------
  // Filtrado y ordenamiento (misma lógica base del B2C)
  // ------------------------------------------------------
  useEffect(() => {
    let filtered = allProducts?.filter((product) =>
      product?.availableFor?.includes("b2b")
    );

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered?.filter(
        (product) =>
          product?.name?.toLowerCase()?.includes(q) ||
          product?.description?.toLowerCase()?.includes(q) ||
          product?.provider?.toLowerCase()?.includes(q)
      );
    }

    if (filters?.category !== "all") {
      filtered = filtered?.filter(
        (product) => product?.category === filters?.category
      );
    }

    // provider == vendor en B2B
    if (filters?.provider !== "all") {
      filtered = filtered?.filter(
        (product) => product?.provider === filters?.provider
      );
    }

    if (filters?.availability !== "all") {
      if (filters?.availability === "in-stock") {
        filtered = filtered?.filter((product) => (product?.stock ?? 0) > 5);
      } else if (filters?.availability === "low-stock") {
        filtered = filtered?.filter(
          (product) => (product?.stock ?? 0) > 0 && (product?.stock ?? 0) <= 5
        );
      }
    }

    // B2B normalmente no usa insurance flags, pero se conserva por compatibilidad
    if (filters?.insuranceCompatible) {
      filtered = filtered?.filter((product) => product?.insuranceCompatible);
    }

    if (filters?.newProducts) {
      filtered = filtered?.filter((product) => product?.isNew);
    }

    if (filters?.onSale) {
      filtered = filtered?.filter((product) => (product?.discount ?? 0) > 0);
    }

    filtered = filtered?.filter((product) => {
      const basePrice =
        product?.discount > 0
          ? product?.price * (1 - product?.discount / 100)
          : product?.price;

      return (
        basePrice >= (filters?.priceRange?.min ?? 0) &&
        basePrice <= (filters?.priceRange?.max ?? 999999)
      );
    });

    switch (filters?.sortBy) {
      case "price-low":
        filtered?.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
        break;
      case "price-high":
        filtered?.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
        break;
      case "rating":
        filtered?.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
        break;
      case "newest":
        filtered?.sort((a, b) => Number(b?.isNew) - Number(a?.isNew));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered?.slice(0, 12));
    setCurrentPage(1);
  }, [filters, allProducts]);

  // Simular loading al cambiar filtros
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [filters]);

  // Paginación "Ver más"
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * 12;
      const endIndex = startIndex + 12;
      const newProducts = filteredProducts?.slice(startIndex, endIndex);
      setDisplayedProducts((prev) => [...prev, ...newProducts]);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 800);
  };

  // ------------------------------------------------------
  // Orden de compra (reutilizando patrón de carrito)
  // ------------------------------------------------------
  const handleAddToPO = (product, quantity) => {
    const q = Math.max(1, Number(quantity || 1));
    const moq = Math.max(1, Number(product?.minOrderQuantity || 1));
    const finalQty = Math.max(q, moq);

    const existingItem = poItems?.find((item) => item?.id === product?.id);

    if (existingItem) {
      setPoItems((prev) =>
        prev?.map((item) =>
          item?.id === product?.id
            ? { ...item, quantity: item?.quantity + finalQty }
            : item
        )
      );
    } else {
      setPoItems((prev) => [...prev, { ...product, quantity: finalQty }]);
    }
  };

  const handleUpdatePOQuantity = (itemId, newQuantity) => {
    setPoItems((prev) =>
      prev?.map((item) => {
        if (item?.id !== itemId) return item;
        const moq = Math.max(1, Number(item?.minOrderQuantity || 1));
        const q = Math.max(moq, Number(newQuantity || moq));
        return { ...item, quantity: q };
      })
    );
  };

  const handleRemoveFromPO = (itemId) => {
    setPoItems((prev) => prev?.filter((item) => item?.id !== itemId));
  };

  const handleCheckout = (items) => {
    navigate("/payment-processing", {
      state: {
        orderData: {
          items: items?.map((item) => ({
            name: item?.name,
            description:
              item?.vendor
                ? `${item.vendor} | MOQ: ${item?.minOrderQuantity ?? 1}`
                : item?.description,
            price: item?.price,
            quantity: item?.quantity,
            icon: "Package",
          })),
          orderNumber: `B2B-${Date.now()}`,
          date: new Date()?.toLocaleDateString("es-VE"),
          shipping: 0,
          marketplaceType: "b2b",
        },
      },
    });
  };

  const totalPages = Math.ceil((filteredProducts?.length || 0) / 12);
  const hasMore = currentPage < totalPages;

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-6">
          {/* Header de página */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Marketplace B2B
                  </h1>
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Profesional
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Insumos, equipos y productos clínicos con lógica de compra por volumen
                </p>
              </div>

              {/* CTA PO */}
              <div className="flex items-center gap-3">
                {poItems?.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCartOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Icon name="FileText" size={16} />
                    Orden de Compra ({poItems?.reduce((s, i) => s + (i?.quantity || 0), 0)})
                  </Button>
                )}
              </div>
            </div>

            {/* Banner modo B2B */}
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Building2" size={16} />
                <span className="text-sm font-medium text-orange-800">
                  Modo: Compra Profesional (B2B)
                </span>
                <span className="text-sm text-orange-600">
                  | Precios por volumen + MOQ
                </span>
              </div>
            </div>

            {/* Búsqueda global */}
            <div className="w-full mt-4">
              <GlobalSearch
                userRole={userRole}
                placeholder="Buscar insumos, equipos, proveedores..."
                variant="default"
              />
            </div>
          </div>

          {/* Filtros rápidos */}
          <QuickFilters
            activeFilters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProducts?.length || 0}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Panel de filtros */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredProducts?.length || 0}
                isOpen={filterPanelOpen}
                onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
              />
            </div>

            {/* Grid de productos */}
            <div className="lg:col-span-3">
              {/* Banner informativo B2B */}
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Package" size={16} />
                  <span className="text-sm font-medium text-purple-800">
                    Compras Profesionales
                  </span>
                </div>
                <div className="text-sm text-purple-700 space-y-1">
                  <div>✓ Precios base normalizados para cards</div>
                  <div>✓ MOQ y tramos de precio disponibles en detalle</div>
                  <div>✓ Enfoque listo para Orden de Compra</div>
                </div>
              </div>

              <ProductGrid
                products={displayedProducts}
                loading={loading || loadingMore}
                onAddToCart={handleAddToPO} // ✅ reutilizamos handler
                onViewDetails={(product) =>
                  console.log("Ver detalles B2B:", product)
                }
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                currentPage={currentPage}
                totalPages={totalPages}
                marketplaceType="b2b"
              />
            </div>
          </div>
        </div>
      </main>

      {/* “Carrito” reutilizado como Orden de Compra */}
      <ShoppingCart
        items={poItems}
        isOpen={cartOpen}
        onToggle={() => setCartOpen(!cartOpen)}
        onUpdateQuantity={handleUpdatePOQuantity}
        onRemoveItem={handleRemoveFromPO}
        onCheckout={handleCheckout}
        marketplaceType="b2b"
      />

      {/* Botón flotante */}
      {poItems?.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        >
          <div className="relative">
            <Icon name="FileText" size={24} />
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {poItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0)}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

export default B2BMarketplace;
