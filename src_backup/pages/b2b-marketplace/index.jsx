// src/@/@/pages/b2b-marketplace/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import GlobalSearch from '@/components/ui/GlobalSearch';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const B2BMarketplace = () => {
  const navigate = useNavigate();
  const { id: vendorId } = useParams();

  // ⚠️ Mantén el rol REAL de la cuenta (doctor/specialist/clinic_admin), NO "medical_provider"
  const [userRole, setUserRole] = useState('doctor');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState(vendorId ? 'vendor' : 'catalog');
  const [loading, setLoading] = useState(true);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
  const [showPOSidebar, setShowPOSidebar] = useState(false);

  const [filters, setFilters] = useState({
    category: 'all',
    vendor: 'all',
    priceRange: { min: 0, max: 5000 },
    certification: 'all',
    search: '',
    minOrderQuantity: 1
  });

  // Al montar, lee el rol desde localStorage y marca modo B2B (sin tocar el rol)
  useEffect(() => {
    const savedRole =
      localStorage.getItem('userRole') || 'doctor'; // 'doctor' | 'specialist' | 'clinic_admin' | 'patient'
    setUserRole(savedRole);
    localStorage.setItem('marketplace_mode', 'b2b');
  }, []);

  // Mock B2B products with volume pricing
  const [allProducts] = useState([
    {
      id: 101,
      name: "Jeringas Desechables 5ml (Caja 100 unidades)",
      category: "supplies",
      vendorId: "vendor-001",
      vendor: "MediSupply Profesional",
      stock: 500,
      rating: 4.8,
      leadTimeDays: 3,
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400",
      availableFor: ['b2b'],
      description: "Jeringas estériles para uso profesional, certificadas ISO",
      certification: "ISO 13485",
      priceTiers: [
        { min: 1, max: 9, priceUSD: 45.00 },
        { min: 10, max: 49, priceUSD: 42.00 },
        { min: 50, max: 999, priceUSD: 38.00 }
      ],
      minOrderQuantity: 1,
      taxIncluded: false
    },
    {
      id: 102,
      name: "Guantes Nitrilo Azules Talla M (Caja 200 pares)",
      category: "supplies",
      vendorId: "vendor-001",
      vendor: "MediSupply Profesional",
      stock: 250,
      rating: 4.9,
      leadTimeDays: 2,
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400",
      availableFor: ['b2b'],
      description: "Guantes de nitrilo sin polvo, alta resistencia",
      certification: "FDA Aprobado",
      priceTiers: [
        { min: 1, max: 4, priceUSD: 35.00 },
        { min: 5, max: 19, priceUSD: 32.00 },
        { min: 20, max: 999, priceUSD: 29.00 }
      ],
      minOrderQuantity: 1,
      taxIncluded: false
    },
    {
      id: 103,
      name: "Termómetros Infrarrojos Profesionales (Pack 10)",
      category: "equipment",
      vendorId: "vendor-002",
      vendor: "TecnoMed Equipment",
      stock: 50,
      rating: 4.7,
      leadTimeDays: 7,
      image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400",
      availableFor: ['b2b'],
      description: "Termómetros de grado médico con calibración profesional",
      certification: "CE Medical",
      priceTiers: [
        { min: 1, max: 2, priceUSD: 450.00 },
        { min: 3, max: 9, priceUSD: 425.00 },
        { min: 10, max: 999, priceUSD: 395.00 }
      ],
      minOrderQuantity: 1,
      taxIncluded: false
    },
    {
      id: 104,
      name: "Monitor de Signos Vitales Profesional",
      category: "equipment",
      vendorId: "vendor-002",
      vendor: "TecnoMed Equipment",
      stock: 15,
      rating: 4.9,
      leadTimeDays: 14,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      availableFor: ['b2b'],
      description: "Monitor multiparamétrico para UCI y consultorios",
      certification: "FDA Clase II",
      priceTiers: [
        { min: 1, max: 2, priceUSD: 2500.00 },
        { min: 3, max: 5, priceUSD: 2350.00 },
        { min: 6, max: 999, priceUSD: 2200.00 }
      ],
      minOrderQuantity: 1,
      taxIncluded: false
    },
    {
      id: 105,
      name: "Mascarillas N95 Profesionales (Caja 50)",
      category: "supplies",
      vendorId: "vendor-003",
      vendor: "ProtecMed Industrial",
      stock: 800,
      rating: 4.8,
      leadTimeDays: 3,
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400",
      availableFor: ['b2b'],
      description: "Mascarillas certificadas NIOSH N95 para personal médico",
      certification: "NIOSH N95",
      priceTiers: [
        { min: 1, max: 9, priceUSD: 85.00 },
        { min: 10, max: 49, priceUSD: 78.00 },
        { min: 50, max: 999, priceUSD: 72.00 }
      ],
      minOrderQuantity: 1,
      taxIncluded: false
    },
    {
      id: 106,
      name: "Suturas Absorbibles Vicryl 3-0 (Caja 12)",
      category: "supplies",
      vendorId: "vendor-003",
      vendor: "ProtecMed Industrial",
      stock: 120,
      rating: 4.9,
      leadTimeDays: 5,
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400",
      availableFor: ['b2b'],
      description: "Material de sutura profesional estéril",
      certification: "ISO 13485",
      priceTiers: [
        { min: 1, max: 4, priceUSD: 125.00 },
        { min: 5, max: 19, priceUSD: 115.00 },
        { min: 20, max: 999, priceUSD: 105.00 }
      ],
      minOrderQuantity: 1,
      taxIncluded: false
    }
  ]);

  // Mock vendors data
  const [vendors] = useState([
    {
      id: "vendor-001",
      name: "MediSupply Profesional",
      rating: 4.8,
      location: "Caracas, Venezuela",
      leadTimeDays: 3,
      terms: "NET 30",
      certifications: ["ISO 13485", "FDA Registered"],
      specialties: ["Suministros médicos", "Consumibles"],
      contactEmail: "ventas@medisupply.com.ve",
      contactPhone: "+58 212-555-0100"
    },
    {
      id: "vendor-002",
      name: "TecnoMed Equipment",
      rating: 4.9,
      location: "Valencia, Venezuela",
      leadTimeDays: 7,
      terms: "NET 15",
      certifications: ["CE Medical", "FDA Clase II"],
      specialties: ["Equipos médicos", "Tecnología diagnóstica"],
      contactEmail: "info@tecnomed.com.ve",
      contactPhone: "+58 241-555-0200"
    },
    {
      id: "vendor-003",
      name: "ProtecMed Industrial",
      rating: 4.7,
      location: "Maracaibo, Venezuela",
      leadTimeDays: 5,
      terms: "NET 45",
      certifications: ["NIOSH", "ISO 9001"],
      specialties: ["Protección personal", "Suministros industriales"],
      contactEmail: "comercial@protecmed.com.ve",
      contactPhone: "+58 261-555-0300"
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtrado de productos B2B (y por proveedor si aplica)
  useEffect(() => {
    let filtered = allProducts?.filter(p => p?.availableFor?.includes('b2b'));

    if (vendorId) filtered = filtered?.filter(p => p?.vendorId === vendorId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered?.filter(p =>
        p?.name?.toLowerCase()?.includes(q) ||
        p?.description?.toLowerCase()?.includes(q) ||
        p?.vendor?.toLowerCase()?.includes(q)
      );
    }

    if (filters?.category !== 'all') {
      filtered = filtered?.filter(p => p?.category === filters?.category);
    }

    if (filters?.vendor !== 'all') {
      filtered = filtered?.filter(p => p?.vendorId === filters?.vendor);
    }

    if (filters?.certification !== 'all') {
      const c = filters.certification.toLowerCase();
      filtered = filtered?.filter(p => p?.certification?.toLowerCase()?.includes(c));
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts, vendorId]);

  // Simular carga
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [filters]);

  const getPriceForQuantity = (product, quantity) => {
    const tier = product?.priceTiers?.find(t => quantity >= t.min && quantity <= t.max);
    return tier || product?.priceTiers?.[0];
  };

  const handleAddToPurchaseOrder = (product, quantity) => {
    const existing = purchaseOrderItems?.find(i => i?.id === product?.id);
    if (existing) {
      setPurchaseOrderItems(prev =>
        prev?.map(i =>
          i?.id === product?.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                unitPrice: getPriceForQuantity(product, i.quantity + quantity)?.priceUSD,
                totalPrice: getPriceForQuantity(product, i.quantity + quantity)?.priceUSD * (i.quantity + quantity)
              }
            : i
        )
      );
    } else {
      const priceInfo = getPriceForQuantity(product, quantity);
      setPurchaseOrderItems(prev => [
        ...prev,
        {
          ...product,
          quantity,
          unitPrice: priceInfo?.priceUSD,
          totalPrice: priceInfo?.priceUSD * quantity
        }
      ]);
    }
  };

  const handleRemoveFromPO = (itemId) => {
    setPurchaseOrderItems(prev => prev?.filter(i => i?.id !== itemId));
  };

  const handleUpdatePOQuantity = (itemId, newQuantity) => {
    setPurchaseOrderItems(prev =>
      prev?.map(i => {
        if (i?.id === itemId) {
          const product = allProducts?.find(p => p?.id === itemId);
          const priceInfo = getPriceForQuantity(product, newQuantity);
          return {
            ...i,
            quantity: newQuantity,
            unitPrice: priceInfo?.priceUSD,
            totalPrice: priceInfo?.priceUSD * newQuantity
          };
        }
        return i;
      })
    );
  };

  const handleProcessPurchaseOrder = () => {
    const poNumber = `PO-${Date.now()}`;
    navigate('/payment-processing', {
      state: {
        orderData: {
          items: purchaseOrderItems?.map(item => ({
            name: item?.name,
            description: `${item?.vendor} - MOQ: ${item?.minOrderQuantity}`,
            price: item?.unitPrice,
            quantity: item?.quantity,
            icon: 'Package'
          })),
          orderNumber: poNumber,
          date: new Date()?.toLocaleDateString('es-VE'),
          shipping: 0,
          marketplaceType: 'b2b',
          paymentMethods: ['credit_card', 'pago_movil', 'purchase_order']
        }
      }
    });
  };

  const handleSwitchMode = () => {
    localStorage.setItem('marketplace_mode', 'b2c');
    navigate('/marketplace/b2c');
  };

  const handleRequestQuote = (product) => {
    alert(`Cotización solicitada para: ${product?.name}`);
  };

  const getCurrentVendor = () => vendors?.find(v => v?.id === vendorId);

  const calculatePOTotal = () => {
    const subtotal = purchaseOrderItems?.reduce((sum, i) => sum + i?.totalPrice, 0);
    const tax = subtotal * 0.16;
    return { subtotal, tax, total: subtotal + tax };
  };

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

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {currentView === 'vendor' ? `Proveedor: ${getCurrentVendor()?.name}` : 'Marketplace B2B'}
                  </h1>
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Profesional
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {currentView === 'vendor' ? 'Catálogo especializado del proveedor' : 'Insumos y equipos médicos por volumen'}
                </p>
              </div>

              {/* Mode Switch */}
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleSwitchMode} className="flex items-center gap-2">
                  <Icon name="User" size={16} />
                  Cambiar a B2C
                </Button>
                {purchaseOrderItems?.length > 0 && (
                  <Button variant="default" onClick={() => setShowPOSidebar(true)} className="flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    Orden de Compra ({purchaseOrderItems?.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Modo / banner */}
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Building2" size={16} color="var(--color-orange-600)" />
                <span className="text-sm font-medium text-orange-800">Modo: Profesional/B2B</span>
                <span className="text-sm text-orange-600">|</span>
                <button onClick={handleSwitchMode} className="text-sm text-orange-600 hover:text-orange-800 underline">
                  Cambiar a Paciente/B2C
                </button>
              </div>
            </div>

            {/* Migas para vista de proveedor */}
            {currentView === 'vendor' && (
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
                <button
                  onClick={() => {
                    setCurrentView('catalog');
                    navigate('/marketplace/b2b');
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Catálogo B2B
                </button>
                <Icon name="ChevronRight" size={14} />
                <span className="text-foreground font-medium">{getCurrentVendor()?.name}</span>
              </nav>
            )}

            {/* Búsqueda global */}
            <div className="w-full mt-4">
              <GlobalSearch userRole={userRole} placeholder="Buscar insumos médicos, equipos, proveedores..." variant="default" />
            </div>
          </div>

          {/* Vendor Detail */}
          {currentView === 'vendor' && getCurrentVendor() && (
            <div className="mb-6 p-6 bg-card border border-border rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Información del Proveedor</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Star" size={14} color="var(--color-yellow-500)" />
                      <span>{getCurrentVendor()?.rating} estrellas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} />
                      <span>{getCurrentVendor()?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={14} />
                      <span>Entrega: {getCurrentVendor()?.leadTimeDays} días</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="CreditCard" size={14} />
                      <span>Términos: {getCurrentVendor()?.terms}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {getCurrentVendor()?.specialties?.map((s, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{s}</span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 mt-4">Certificaciones</h3>
                  <div className="flex flex-wrap gap-2">
                    {getCurrentVendor()?.certifications?.map((c, i) => (
                      <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Contacto</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" fullWidth>
                      <Icon name="Mail" size={14} className="mr-2" />
                      Solicitar Cotización
                    </Button>
                    <Button variant="ghost" size="sm" fullWidth>
                      <Icon name="Phone" size={14} className="mr-2" />
                      {getCurrentVendor()?.contactPhone}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info B2B */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Package" size={16} color="var(--color-purple-600)" />
              <span className="text-sm font-medium text-purple-800">Compras Profesionales B2B</span>
            </div>
            <div className="text-sm text-purple-700 space-y-1">
              <div>✓ Precios por volumen con descuentos escalonados</div>
              <div>✓ Métodos de pago: Tarjeta, Pago Móvil, Orden de Compra</div>
              <div>✓ Facturas con IVA incluido para empresas</div>
              <div>✓ Términos de crédito NET 15/30/45</div>
            </div>
          </div>

          {/* Filtros y productos */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 p-4 bg-card border border-border rounded-lg">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Buscar productos..."
                  value={filters?.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e?.target?.value }))}
                />
              </div>
              <select
                className="px-3 py-2 border border-border rounded-md"
                value={filters?.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e?.target?.value }))}
              >
                <option value="all">Todas las categorías</option>
                <option value="supplies">Suministros</option>
                <option value="equipment">Equipos</option>
              </select>
              {currentView !== 'vendor' && (
                <select
                  className="px-3 py-2 border border-border rounded-md"
                  value={filters?.vendor}
                  onChange={(e) => setFilters(prev => ({ ...prev, vendor: e?.target?.value }))}
                >
                  <option value="all">Todos los proveedores</option>
                  {vendors?.map(v => (
                    <option key={v?.id} value={v?.id}>{v?.name}</option>
                  ))}
                </select>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Icon name="Loader" size={32} className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts?.map(product => (
                  <div key={product?.id} className="p-6 bg-card border border-border rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Info */}
                      <div className="lg:col-span-5">
                        <div className="flex gap-4">
                          <img src={product?.image} alt={product?.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{product?.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{product?.description}</p>
                            <div className="flex gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{product?.certification}</span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">MOQ: {product?.minOrderQuantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vendor */}
                      <div className="lg:col-span-2">
                        <div className="text-sm">
                          <div className="font-medium text-foreground">{product?.vendor}</div>
                          <div className="text-muted-foreground">Stock: {product?.stock}</div>
                          <div className="text-muted-foreground">Entrega: {product?.leadTimeDays} días</div>
                        </div>
                      </div>

                      {/* Precios por volumen */}
                      <div className="lg:col-span-3">
                        <div className="space-y-1">
                          {product?.priceTiers?.map((t, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {t?.min}-{t?.max === 999 ? '+' : t?.max}:
                              </span>
                              <span className="font-medium text-foreground">${t?.priceUSD?.toFixed(2)} + IVA</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="lg:col-span-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input type="number" min="1" defaultValue="1" className="w-16" id={`qty-${product?.id}`} />
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                const qty = parseInt(document.getElementById(`qty-${product?.id}`)?.value) || 1;
                                handleAddToPurchaseOrder(product, qty);
                              }}
                            >
                              + OC
                            </Button>
                          </div>
                          <Button variant="outline" size="sm" fullWidth onClick={() => handleRequestQuote(product)}>
                            <Icon name="FileText" size={14} className="mr-1" />
                            Cotizar
                          </Button>
                          {currentView !== 'vendor' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              fullWidth
                              onClick={() => navigate(`/marketplace/vendor/${product?.vendorId}`)}
                            >
                              Ver Proveedor
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Proveedores destacados */}
          {currentView === 'catalog' && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Proveedores Destacados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors?.map(v => (
                  <div key={v?.id} className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{v?.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon name="Star" size={14} color="var(--color-yellow-500)" />
                          <span className="text-sm text-muted-foreground">{v?.rating}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/vendor/${v?.id}`)}>
                        Ver Catálogo
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={12} />
                        <span>{v?.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={12} />
                        <span>Entrega: {v?.leadTimeDays} días</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {v?.specialties?.slice(0, 2)?.map((s, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Purchase Order Sidebar */}
      {showPOSidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPOSidebar(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Orden de Compra</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowPOSidebar(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {purchaseOrderItems?.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No hay productos en la orden de compra</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseOrderItems?.map(item => (
                    <div key={item?.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground text-sm">{item?.name}</h4>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFromPO(item?.id)}>
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          type="number"
                          min="1"
                          value={item?.quantity}
                          onChange={(e) => handleUpdatePOQuantity(item?.id, parseInt(e?.target?.value) || 1)}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">× ${item?.unitPrice?.toFixed(2)}</span>
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        Total: ${item?.totalPrice?.toFixed(2)} + IVA
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {purchaseOrderItems?.length > 0 && (
              <div className="p-4 border-t border-border">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal:</span><span>${calculatePOTotal()?.subtotal?.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>IVA (16%):</span><span>${calculatePOTotal()?.tax?.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold"><span>Total:</span><span>${calculatePOTotal()?.total?.toFixed(2)}</span></div>
                </div>
                <Button variant="default" fullWidth className="mt-4" onClick={handleProcessPurchaseOrder}>
                  Procesar Orden de Compra
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BMarketplace;
