// src/@/@/pages/provider/ProviderInventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import StockBadge from '@/shared/StockBadge';
import { useParams } from 'react-router-dom';

const ProviderInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        sku: "PAR-500-001",
        name: 'Paracetamol 500mg',
        category: 'Medicamentos',
        price: 2500,
        stock: 150,
        minStock: 50,
        unit: 'comprimidos',
        description: 'Analgésico y antipirético',
        provider: 'Laboratorio Nacional',
        lastUpdated: '2024-01-15'
      },
      {
        id: 2,
        sku: "TEN-DIG-002",
        name: 'Tensiómetro Digital',
        category: 'Equipos Médicos',
        price: 125000,
        stock: 8,
        minStock: 10,
        unit: 'unidades',
        description: 'Monitor de presión arterial automático',
        provider: 'MedTech Solutions',
        lastUpdated: '2024-01-14'
      }
    ];
    setProducts(mockProducts);
  }, []);

  const categories = ['all', 'Medicamentos', 'Equipos Médicos', 'Insumos Médicos'];

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock) return 'low';
    if (stock <= minStock * 2) return 'medium';
    return 'high';
  };

  const filteredProducts = products.filter(product =>
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  );

  const ProductCard = ({ product }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
        </div>
        <StockBadge
          status={getStockStatus(product.stock, product.minStock)}
          value={product.stock}
          unit={product.unit}
          item={product}
        />
      </div>

      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/provider/inventory/product/${product.sku}`)} // 👈 Detalle
        >
          <Icon name="Eye" size={14} className="mr-2" />
          Ver Detalles
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Plus" size={14} className="mr-2" />
          Reabastecer
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e?.target?.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories?.slice(1)?.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          value={stockFilter}
          onChange={(e) => setStockFilter(e?.target?.value)}
        >
          <option value="all">Todos los stocks</option>
          <option value="low">Stock bajo</option>
          <option value="normal">Stock normal</option>
          <option value="high">Stock alto</option>
        </select>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            <Icon name="Filter" size={16} className="mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Icon name="SortAsc" size={16} />
          </Button>
        </div>
      </div>

      {/* Productos Filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredProducts?.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No se encontraron productos</p>
          <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default ProviderInventory;
