import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import GlobalSearch from '@/components/ui/GlobalSearch';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

// Import marketplace components
import FilterPanel from '../marketplace/components/FilterPanel';
import ShoppingCart from '../marketplace/components/ShoppingCart';
import ProductGrid from '../marketplace/components/ProductGrid';
import QuickFilters from '../marketplace/components/QuickFilters';

// Import payment components



const B2CMarketplace = () => {
  const navigate = useNavigate();
  const [userRole] = useState('patient');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [showModeSwitch, setShowModeSwitch] = useState(false);

  // Check if user can switch modes (Professional or Clinic)
  useEffect(() => {
    const currentRole = localStorage.getItem('userRole');
    setShowModeSwitch(currentRole === 'professional' || currentRole === 'clinic');
  }, []);

  const [filters, setFilters] = useState({
    category: 'all',
    provider: 'all',
    priceRange: { min: 0, max: 1000 },
    availability: 'all',
    insuranceCompatible: false,
    sortBy: 'relevance',
    search: '',
    freeShipping: false,
    newProducts: false,
    onSale: false
  });

  // Mock B2C products data - focused on individual consumer purchases
  const [allProducts] = useState([
    {
      id: 1,
      name: "Losartán 50mg - Antihipertensivo",
      category: "medications",
      provider: "Farmacia Central",
      price: 25.50,
      priceVES: 918.00, // Mock VES equivalent
      discount: 15,
      stock: 45,
      rating: 4.8,
      deliveryTime: "2-3 días",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      insuranceCompatible: true,
      isNew: false,
      availableFor: ['b2c', 'b2b'],
      description: "Medicamento antihipertensivo para el control de la presión arterial alta",
      prescription: true,
      genericAlternative: "Losartán Genérico",
      sideEffects: "Mareos, dolor de cabeza leve",
      dosage: "Una tableta diaria"
    },
    {
      id: 2,
      name: "Tensiómetro Digital Automático",
      category: "medical-equipment",
      provider: "MediSupply VE",
      price: 89.99,
      priceVES: 3239.64,
      discount: 0,
      stock: 12,
      rating: 4.6,
      deliveryTime: "1-2 días",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      insuranceCompatible: false,
      isNew: true,
      availableFor: ['b2c'],
      description: "Monitor de presión arterial digital con pantalla LCD grande",
      prescription: false,
      warranty: "2 años de garantía",
      features: "Memoria para 90 mediciones, detección arritmia"
    },
    {
      id: 3,
      name: "Paracetamol 500mg (100 tabletas)",
      category: "medications",
      provider: "Farmacia Central",
      price: 12.75,
      priceVES: 459.00,
      discount: 0,
      stock: 156,
      rating: 4.6,
      deliveryTime: "1-2 días",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      insuranceCompatible: true,
      isNew: false,
      availableFor: ['b2c', 'b2b'],
      description: "Analgésico y antipirético para dolor y fiebre",
      prescription: false,
      dosage: "1-2 tabletas cada 6-8 horas",
      maxDaily: "Máximo 8 tabletas diarias"
    },
    {
      id: 4,
      name: "Vitamina D3 2000 UI (60 cápsulas)",
      category: "wellness",
      provider: "Wellness Store",
      price: 18.50,
      priceVES: 666.00,
      discount: 0,
      stock: 89,
      rating: 4.4,
      deliveryTime: "2-3 días",
      image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400",
      insuranceCompatible: false,
      isNew: false,
      availableFor: ['b2c'],
      description: "Suplemento de vitamina D3 para fortalecer el sistema inmune",
      prescription: false,
      dosage: "1 cápsula diaria con alimentos",
      benefits: "Fortalece huesos y sistema inmune"
    },
    {
      id: 5,
      name: "Glucómetro con 50 Tiras Reactivas",
      category: "diagnostics",
      provider: "Laboratorio Nacional",
      price: 45.75,
      priceVES: 1647.00,
      discount: 10,
      stock: 28,
      rating: 4.7,
      deliveryTime: "2-4 días",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
      insuranceCompatible: true,
      isNew: false,
      availableFor: ['b2c', 'b2b'],
      description: "Medidor de glucosa en sangre con tiras reactivas incluidas",
      prescription: false,
      warranty: "5 años de garantía",
      includes: "Lancetas, estuche de transporte"
    },
    {
      id: 6,
      name: "Termómetro Infrarrojo Sin Contacto",
      category: "medical-equipment",
      provider: "MediSupply VE",
      price: 32.99,
      priceVES: 1187.64,
      discount: 0,
      stock: 67,
      rating: 4.5,
      deliveryTime: "1-2 días",
      image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400",
      insuranceCompatible: false,
      isNew: true,
      availableFor: ['b2c'],
      description: "Termómetro digital infrarrojo para medición sin contacto",
      prescription: false,
      features: "Medición rápida 1 segundo, memoria 32 lecturas",
      accuracy: "±0.2°C precisión"
    },
    {
      id: 7,
      name: "Multivitamínico Completo (90 cápsulas)",
      category: "wellness",
      provider: "Wellness Store",
      price: 24.99,
      priceVES: 899.64,
      discount: 20,
      stock: 45,
      rating: 4.5,
      deliveryTime: "2-4 días",
      image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400",
      insuranceCompatible: false,
      isNew: true,
      availableFor: ['b2c'],
      description: "Complejo multivitamínico para nutrición diaria",
      prescription: false,
      dosage: "1 cápsula diaria con el desayuno",
      contains: "23 vitaminas y minerales esenciales"
    },
    {
      id: 8,
      name: "Oxímetro de Pulso Digital",
      category: "diagnostics",
      provider: "Laboratorio Nacional",
      price: 28.99,
      priceVES: 1043.64,
      discount: 15,
      stock: 34,
      rating: 4.7,
      deliveryTime: "2-3 días",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
      insuranceCompatible: true,
      isNew: false,
      availableFor: ['b2c', 'b2b'],
      description: "Medidor de saturación de oxígeno y frecuencia cardíaca",
      prescription: false,
      features: "Display OLED, apagado automático",
      accuracy: "SpO2: ±2%, Pulso: ±2bpm"
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // Filter B2C products
  useEffect(() => {
    let filtered = allProducts?.filter(product => 
      product?.availableFor?.includes('b2c')
    );

    // Apply search filter
    if (filters?.search) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        product?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        product?.provider?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Apply category filter
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(product => product?.category === filters?.category);
    }

    // Apply provider filter
    if (filters?.provider !== 'all') {
      filtered = filtered?.filter(product => product?.provider === filters?.provider);
    }

    // Apply availability filter
    if (filters?.availability !== 'all') {
      if (filters?.availability === 'in-stock') {
        filtered = filtered?.filter(product => product?.stock > 5);
      } else if (filters?.availability === 'low-stock') {
        filtered = filtered?.filter(product => product?.stock > 0 && product?.stock <= 5);
      }
    }

    // Apply insurance filter
    if (filters?.insuranceCompatible) {
      filtered = filtered?.filter(product => product?.insuranceCompatible);
    }

    // Apply special filters
    if (filters?.newProducts) {
      filtered = filtered?.filter(product => product?.isNew);
    }

    if (filters?.onSale) {
      filtered = filtered?.filter(product => product?.discount > 0);
    }

    // Price range filter
    filtered = filtered?.filter(product => {
      const price = product?.discount > 0 
        ? product?.price * (1 - product?.discount / 100)
        : product?.price;
      return price >= filters?.priceRange?.min && price <= filters?.priceRange?.max;
    });

    // Sort products
    switch (filters?.sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => {
          const priceA = a?.discount > 0 ? a?.price * (1 - a?.discount / 100) : a?.price;
          const priceB = b?.discount > 0 ? b?.price * (1 - b?.discount / 100) : b?.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered?.sort((a, b) => {
          const priceA = a?.discount > 0 ? a?.price * (1 - a?.discount / 100) : a?.price;
          const priceB = b?.discount > 0 ? b?.price * (1 - b?.discount / 100) : b?.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.isNew - a?.isNew);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered?.slice(0, 12));
    setCurrentPage(1);
  }, [filters, allProducts]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * 12;
      const endIndex = startIndex + 12;
      const newProducts = filteredProducts?.slice(startIndex, endIndex);
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 1000);
  };

  const handleAddToCart = async (product, quantity) => {
    const existingItem = cartItems?.find(item => item?.id === product?.id);
    
    if (existingItem) {
      setCartItems(prev =>
        prev?.map(item =>
          item?.id === product?.id
            ? { ...item, quantity: Math.min(item?.quantity + quantity, product?.stock) }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, quantity }]);
    }
  };

  const handleUpdateCartQuantity = (itemId, newQuantity) => {
    setCartItems(prev =>
      prev?.map(item =>
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(prev => prev?.filter(item => item?.id !== itemId));
  };

  const handleCheckout = async (items) => {
    // Process B2C checkout with credit card and Pago Móvil
    navigate('/payment-processing', {
      state: {
        orderData: {
          items: items?.map(item => ({
            name: item?.name,
            description: item?.description,
            price: item?.discount > 0 ? item?.price * (1 - item?.discount / 100) : item?.price,
            quantity: item?.quantity,
            icon: 'ShoppingBag'
          })),
          orderNumber: `B2C-${Date.now()}`,
          date: new Date()?.toLocaleDateString('es-VE'),
          shipping: 5.00,
          marketplaceType: 'b2c'
        }
      }
    });
  };

  const handleSwitchMode = () => {
    navigate('/marketplace/b2b');
  };

  const totalPages = Math.ceil(filteredProducts?.length / 12);
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
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6">
          {/* Page Header */}
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
              
              {/* Mode Switch - Only for Professional/Clinic users */}
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

            {/* Mode Switch Context */}
            {showModeSwitch && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} color="var(--color-blue-600)" />
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

            {/* Global Search */}
            <div className="w-full mt-4">
              <GlobalSearch
                userRole={userRole}
                placeholder="Buscar medicamentos, productos de salud..."
                variant="default"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <QuickFilters
            activeFilters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProducts?.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredProducts?.length}
                isOpen={filterPanelOpen}
                onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
              />
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {/* B2C Specific Features */}
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Shield" size={16} color="var(--color-green-600)" />
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
                onViewDetails={(product) => console.log('Ver detalles:', product)}
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
      
      {/* Shopping Cart */}
      <ShoppingCart
        items={cartItems}
        isOpen={cartOpen}
        onToggle={() => setCartOpen(!cartOpen)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        marketplaceType="b2c"
      />

      {/* Floating Cart Button */}
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