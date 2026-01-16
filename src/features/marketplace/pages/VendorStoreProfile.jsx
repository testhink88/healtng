import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import DashboardLayout from "@/shared/layouts/DashboardLayout"; 

const B2B_CATALOG_STORAGE_KEY = "healtng_provider_b2b_catalog_v1";

export default function VendorStoreProfile() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState({}); 

  useEffect(() => {
    try {
      const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
      if (raw) {
        // Solo cargamos productos con estado 'active' para la vista pública
        const publicItems = JSON.parse(raw).filter(item => 
          item.status === 'active' || item.isPublished === true
        );
        setProducts(publicItems);
      }
    } catch (e) { console.error("Error cargando tienda:", e); }
  }, []);

  const displayedProducts = useMemo(() => {
    return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lab?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <DashboardLayout 
      role="provider" 
      businessType="b2b" // ✅ SOLUCIÓN AL ROL MIXTO: Forzamos el modo B2B
    >
      {/* USO DE MÁRGENES NEGATIVOS (-m-6):
          DashboardLayout tiene un padding p-6 en el main. 
          Usamos -m-6 para que el banner azul toque los bordes laterales y el tope del header.
      */}
      <div className="flex flex-col min-h-full -m-6 bg-slate-50/50">
        
        {/* --- BANNER PRINCIPAL --- */}
        <div className="bg-slate-900 h-48 relative flex items-end">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <Button 
                variant="ghost" 
                className="absolute top-6 left-6 text-white hover:bg-white/10 z-20 border border-white/20 backdrop-blur-sm"
                onClick={() => navigate(-1)}
            >
                <Icon name="ArrowLeft" size={16} className="mr-2" /> Volver al Panel
            </Button>

            <div className="w-full max-w-6xl mx-auto px-8 pb-8 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    {/* Logo con efecto de superposición */}
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl p-1.5 flex-shrink-0 -mb-12 border border-slate-200 overflow-hidden">
                        <div className="w-full h-full bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                            <Icon name="Activity" size={32} className="text-blue-600" />
                            <span className="text-slate-900 font-black text-[10px] mt-1 tracking-tighter">HEALTNG</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 text-white pb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black tracking-tight">Droguería Healtng Demo</h1>
                            <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                                <Icon name="Check" size={14} className="text-white" />
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
                            <Icon name="MapPin" size={14} /> Distribuidor Nacional • Suministros B2B
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CUERPO DE LA TIENDA --- */}
        <div className="w-full max-w-6xl mx-auto px-8 pt-20 pb-24">
            
            {/* Buscador Estilizado */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:flex-1">
                    <Input 
                        placeholder="Buscar por producto, laboratorio o principio activo..." 
                        icon="Search"
                        className="bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 py-6"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 px-2">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Capacidad</p>
                        <p className="text-sm font-bold text-slate-700">Stock Inmediato</p>
                    </div>
                    <div className="h-10 w-px bg-slate-100"></div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Catálogo</p>
                        <p className="text-sm font-bold text-blue-600">{displayedProducts.length} Items</p>
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            {displayedProducts.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
                    <Icon name="Inbox" size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-slate-900 font-bold text-lg">No hay productos publicados</h3>
                    <p className="text-slate-400 text-sm mt-1">Este proveedor aún no ha activado items en su catálogo público.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedProducts.map(product => (
                        <ProductCardPublic 
                            key={product.id} 
                            product={product} 
                            onAdd={() => setCart(prev => ({...prev, [product.id]: (prev[product.id] || 0) + 1}))}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const ProductCardPublic = ({ product, onAdd }) => (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group flex flex-col border-b-4 border-b-transparent hover:border-b-blue-500">
        <div className="h-44 bg-slate-50 rounded-[24px] mb-5 flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors duration-500">
            {product.image ? (
                <img src={product.image} className="h-full w-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" alt={product.name} />
            ) : (
                <Icon name="Image" size={48} className="text-slate-200" />
            )}
        </div>
        
        <div className="flex-1 space-y-2 mb-6">
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                    {product.lab || 'LABORATORIO'}
                </span>
                {product.expiryDate && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">V: {product.expiryDate}</span>
                )}
            </div>
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight h-10 group-hover:text-blue-600 transition-colors">
                {product.name}
            </h3>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Bs. Unitario</span>
                <span className="font-black text-slate-900 text-lg tracking-tight">
                    {Number(product.price).toLocaleString()}
                </span>
            </div>
            <Button 
                size="sm" 
                onClick={onAdd} 
                className="rounded-2xl w-12 h-12 p-0 bg-slate-900 hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all active:scale-90"
            >
                <Icon name="Plus" size={20} />
            </Button>
        </div>
    </div>
);