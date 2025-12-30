// src/pages/b2c-marketplace/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import GlobalSearch from "@/components/ui/GlobalSearch";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// API central del marketplace
import { getMarketplaceProducts } from "@/api/marketplace/marketplace";

// Componentes de marketplace
import FilterPanel from "../marketplace/components/FilterPanel";
import ShoppingCart from "../marketplace/components/ShoppingCart";
import ProductGrid from "../marketplace/components/ProductGrid";
import QuickFilters from "../marketplace/components/QuickFilters";

const B2CMarketplace = () => {
  const navigate = useNavigate();

  const [userRole] = useState("patient");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [showModeSwitch, setShowModeSwitch] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    category: "all",
    provider: "all",
    priceRange: { min: 0, max: 1000 },
    availability: "all",
    insuranceCompatible: false,
    sortBy: "relevance",
    search: "",
    freeShipping: false,
    newProducts: false,
    onSale: false,
  });

  // Productos (desde el API mock)
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // ¿El usuario actual puede cambiar a modo B2B?
  useEffect(() => {
    const currentRole = localStorage.getItem("userRole");
    setShowModeSwitch(
      currentRole === "professional" || currentRole === "clinic"
    );
  }, []);

  // Cargar catálogo desde la capa api/ (solo B2C)
  useEffect(() => {
    const products = getMarketplaceProducts("b2c");
    setAllProducts(products);
  }, []);

  // Filtro + ordenamiento sobre allProducts
  useEffect(() => {
    let filtered = allProducts?.filter((product) =>
      product?.availableFor?.includes("b2c")
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

    if (filters?.provider !== "all") {
      filtered = filtered?.filter(
        (product) => product?.provider === filters?.provider
      );
    }

    if (filters?.availability !== "all") {
      if (filters?.availability === "in-stock") {
        filtered = filtered?.filter((product) => product?.stock > 5);
      } else if (filters?.availability === "low-stock") {
        filtered = filtered?.filter(
          (product) => product?.stock > 0 && product?.stock <= 5
        );
      }
    }

    if (filters?.insuranceCompatible) {
      filtered = filtered?.filter((product) => product?.insuranceCompatible);
    }

    if (filters?.newProducts) {
      filtered = filtered?.filter((product) => product?.isNew);
    }

    if (filters?.onSale) {
      filtered = filtered?.filter((product) => product?.discount > 0);
    }

    filtered = filtered?.filter((product) => {
      const basePrice =
        product?.discount > 0
          ? product?.price * (1 - product?.discount / 100)
          : product?.price;
      return (
        basePrice >= filters?.priceRange?.min &&
        basePrice <= filters?.priceRange?.max
      );
    });

    switch (filters?.sortBy) {
      case "price-low":
        filtered?.sort((a, b) => {
          const priceA =
            a?.discount > 0 ? a?.price * (1 - a?.discount / 100) : a?.price;
          const priceB =
            b?.discount > 0 ? b?.price * (1 - b?.discount / 100) : b?.price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered?.sort((a, b) => {
          const priceA =
            a?.discount > 0 ? a?.price * (1 - a?.discount / 100) : a?.price;
          const priceB =
            b?.discount > 0 ? b?.price * (1 - b?.discount / 100) : b?.price;
          return priceB - priceA;
        });
        break;
      case "rating":
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case "newest":
        filtered?.sort((a, b) => b?.isNew - a?.isNew);
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
    const timer = setTimeout(() => setLoading(false), 800);
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
    }, 1000);
  };

  // Cart (B2C)
  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems?.find((item) => item?.id === product?.id);

    if (existingItem) {
      setCartItems((prev) =>
        prev?.map((item) =>
          item?.id === product?.id
            ? {
                ...item,
                quantity: Math.min(
                  item?.quantity + quantity,
                  product?.stock || item?.quantity + quantity
                ),
              }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity }]);
    }
  };

  const handleUpdateCartQuantity = (itemId, newQuantity) => {
    setCartItems((prev) =>
      prev?.map((item) =>
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prev) => prev?.filter((item) => item?.id !== itemId));
  };

  const handleCheckout = (items) => {
    navigate("/payment-processing", {
      state: {
        orderData: {
          items: items?.map((item) => ({
            name: item?.name,
            description: item?.description,
            price:
              item?.discount > 0
                ? item?.price * (1 - item?.discount / 100)
                : item?.price,
            quantity: item?.quantity,
            icon: "ShoppingBag",
          })),
          orderNumber: `B2C-${Date.now()}`,
          date: new Date()?.toLocaleDateString("es-VE"),
          shipping: 5.0,
          marketplaceType: "b2c",
        },
      },
    });
  };

  const handleSwitchMode = () => {
    navigate("/marketplace/b2b");
  };

  const totalPages = Math.ceil((filteredProducts?.length || 0) / 12);
  const hasMore = currentPage < totalPages;

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
                    Marketplace B2C
                  </h1>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Paciente
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Medicamentos y productos de salud para consumo personal
                </p>
              </div>

              {/* Switch B2C/B2B solo para roles Pro/Clínica */}
              {showModeSwitch && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSwitchMode}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Building2" size={16} />
                    Cambiar a B2B
                  </Button>
                </div>
              )}
            </div>

            {/* Banner modo B2C */}
            {showModeSwitch && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon
                    name="Users"
                    size={16}
                    color="var(--color-blue-600)"
                  />
                  <span className="text-sm font-medium text-blue-800">
                    Modo: Compra para Paciente (B2C)
                  </span>
                  <span className="text-sm text-blue-600">|</span>
                  <button
                    onClick={handleSwitchMode}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Cambiar a Profesional/B2B
                  </button>
                </div>
              </div>
            )}

            {/* Búsqueda global */}
            <div className="w-full mt-4">
              <GlobalSearch
                userRole={userRole}
                placeholder="Buscar medicamentos, productos de salud..."
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
              {/* Banner B2C */}
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    name="Shield"
                    size={16}
                    color="var(--color-green-600)"
                  />
                  <span className="text-sm font-medium text-green-800">
                    Compra Segura para Pacientes
                  </span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>✓ Precios en USD con referencia VES</div>
                  <div>✓ Pago con Tarjeta de Crédito y Pago Móvil</div>
                  <div>✓ Verificación de recetas médicas</div>
                  <div>✓ Compatibilidad con seguros</div>
                </div>
              </div>

              <ProductGrid
                products={displayedProducts}
                loading={loading || loadingMore}
                onAddToCart={handleAddToCart}
                onViewDetails={(product) =>
                  console.log("Ver detalles:", product)
                }
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                currentPage={currentPage}
                totalPages={totalPages}
                marketplaceType="b2c"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Carrito flotante */}
      <ShoppingCart
        items={cartItems}
        isOpen={cartOpen}
        onToggle={() => setCartOpen(!cartOpen)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        marketplaceType="b2c"
      />

      {cartItems?.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        >
          <div className="relative">
            <Icon name="ShoppingCart" size={24} />
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {cartItems?.reduce((sum, item) => sum + item?.quantity, 0)}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

export default B2CMarketplace;
