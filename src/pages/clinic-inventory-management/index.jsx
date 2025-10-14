import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import StockBadge from '@/shared/StockBadge';
import { mockInventoryData, filterInventoryItems, isLowStock, isExpiringSoon, isExpired } from '../../utils/inventory';

const ClinicInventoryManagement = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Inventory state
  const [inventoryItems, setInventoryItems] = useState(mockInventoryData);
  const [filteredItems, setFilteredItems] = useState(mockInventoryData);
  const [selectedItems, setSelectedItems] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    categoria: 'all',
    ubicacion: 'all',
    stockStatus: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique categories and locations for filters
  const categories = [...new Set(inventoryItems.map(item => item?.categoria).filter(Boolean))];
  const locations = [...new Set(inventoryItems.map(item => item?.ubicacion).filter(Boolean))];

  useEffect(() => {
    const filtered = filterInventoryItems(inventoryItems, filters);
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [filters, inventoryItems]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev?.includes(itemId) 
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const pageItems = getCurrentPageItems()?.map(item => item?.id);
    const allSelected = pageItems?.every(id => selectedItems?.includes(id));
    
    if (allSelected) {
      setSelectedItems(prev => prev?.filter(id => !pageItems?.includes(id)));
    } else {
      setSelectedItems(prev => [...new Set([...prev, ...pageItems])]);
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems?.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +"Código,Nombre,Categoría,Stock Actual,Stock Mínimo,Ubicación,Proveedor,Costo,Vencimiento,Lote\n"
      + filteredItems?.map(item => 
        `${item?.codigo},${item?.nombre},${item?.categoria},${item?.stock_actual},${item?.stock_mínimo},${item?.ubicacion},${item?.proveedor_preferido},${item?.costo_unitario},${item?.vencimiento || ''},${item?.lote}`
      )?.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", "inventario_clinica.csv");
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const InventoryCard = ({ item }) => {
    const isSelected = selectedItems?.includes(item?.id);
    const stockBadgeInfo = StockBadge({ item });

    return (
      <div className={`bg-white border rounded-lg p-4 transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-gray-200'
      }`}>
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectItem(item?.id)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{item?.nombre}</h3>
              <p className="text-sm text-gray-500">Código: {item?.codigo}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" title="Ver detalles">
              <Icon name="Eye" size={16} />
            </Button>
            <Button size="sm" variant="ghost" title="Editar">
              <Icon name="Edit" size={16} />
            </Button>
            <Button size="sm" variant="ghost" title="Más opciones">
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>
        </div>
        {/* Stock Information */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Stock Actual</p>
            <p className="text-lg font-bold text-gray-900">{item?.stock_actual}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Unidad</p>
            <p className="text-sm text-gray-700">{item?.unidad}</p>
          </div>
        </div>
        {/* Stock Range */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Mín: {item?.stock_mínimo}</span>
            <span>Máx: {item?.stock_máximo}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                isLowStock(item) ? 'bg-red-500' : 
                item?.stock_actual <= (item?.stock_mínimo * 1.5) ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min((item?.stock_actual / item?.stock_máximo) * 100, 100)}%`
              }}
            />
          </div>
        </div>
        {/* Badges and Info */}
        <div className="flex flex-wrap gap-2 mb-3">
          <StockBadge item={item} />
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {item?.categoria}
          </span>
        </div>
        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Ubicación:</span>
            <span className="font-medium">{item?.ubicacion}</span>
          </div>
          <div className="flex justify-between">
            <span>Proveedor:</span>
            <span className="font-medium">{item?.proveedor_preferido}</span>
          </div>
          <div className="flex justify-between">
            <span>Costo Unit.:</span>
            <span className="font-medium">${item?.costo_unitario}</span>
          </div>
          {item?.vencimiento && (
            <div className="flex justify-between">
              <span>Vencimiento:</span>
              <span className={`font-medium ${
                isExpiringSoon(item) ? 'text-yellow-600' : isExpired(item) ? 'text-red-600' : 'text-gray-600'
              }`}>
                {new Date(item.vencimiento)?.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
          <Button size="sm" variant="outline" className="flex-1">
            <Icon name="BarChart3" size={14} className="mr-2" />
            Movimientos
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Icon name="Package" size={14} className="mr-2" />
            Ajustar Stock
          </Button>
          <Button size="sm" variant="outline">
            <Icon name="ShoppingCart" size={14} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Inventario</h1>
              <p className="text-gray-600">Control integral de stock médico y suministros</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/marketplace/b2b')}
                className="flex items-center space-x-2"
              >
                <Icon name="Store" size={16} />
                <span>Surtir desde B2B</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/clinic/inventory/new')}
                className="flex items-center space-x-2"
              >
                <Icon name="Plus" size={16} />
                <span>Nuevo Producto</span>
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Buscar por nombre, código..."
                value={filters?.search}
                onChange={(e) => handleFilterChange('search', e?.target?.value)}
                className="w-full"
              />
              
              <Select
                value={filters?.categoria}
                onValueChange={(value) => handleFilterChange('categoria', value)}
              >
                <option value="all">Todas las categorías</option>
                {categories?.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              
              <Select
                value={filters?.ubicacion}
                onValueChange={(value) => handleFilterChange('ubicacion', value)}
              >
                <option value="all">Todas las ubicaciones</option>
                {locations?.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </Select>
              
              <Select
                value={filters?.stockStatus}
                onValueChange={(value) => handleFilterChange('stockStatus', value)}
              >
                <option value="">Todos los estados</option>
                <option value="low">Bajo stock</option>
                <option value="expiring">Próximo a vencer</option>
                <option value="expired">Vencido</option>
              </Select>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <span className="text-sm text-gray-500">
                  {filteredItems?.length} productos encontrados
                </span>
                {selectedItems?.length > 0 && (
                  <span className="text-sm font-medium text-primary">
                    {selectedItems?.length} seleccionados
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleExportCSV}>
                  <Icon name="Download" size={14} className="mr-2" />
                  Exportar CSV
                </Button>
                
                {selectedItems?.length > 0 && (
                  <>
                    <Button size="sm" variant="outline">
                      <Icon name="Package" size={14} className="mr-2" />
                      Ajuste Masivo
                    </Button>
                    <Button size="sm" variant="outline">
                      <Icon name="ShoppingCart" size={14} className="mr-2" />
                      Crear OC
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="mb-6">
            {getCurrentPageItems()?.length > 0 ? (
              <>
                {/* Select All Checkbox */}
                <div className="bg-white border border-gray-200 rounded-t-lg p-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={getCurrentPageItems()?.length > 0 && getCurrentPageItems()?.every(item => selectedItems?.includes(item?.id))}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Seleccionar todos en esta página
                    </span>
                  </label>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-b-lg border border-t-0 border-gray-200">
                  {getCurrentPageItems()?.map(item => (
                    <InventoryCard key={item?.id} item={item} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Icon name="Package" size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500 mb-6">Ajusta los filtros o agrega nuevos productos al inventario</p>
                <Button 
                  onClick={() => navigate('/clinic/inventory/new')}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Agregar Producto</span>
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredItems?.length)} de {filteredItems?.length} productos
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                <span className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </span>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClinicInventoryManagement;