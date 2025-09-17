// Inventory utility functions for clinic management

/**
 * Check if an item is low on stock
 * @param {Object} item - Inventory item with stock_actual and stock_mínimo
 * @returns {boolean} - True if stock is low
 */
export const isLowStock = (item) => {
  if (!item?.stock_actual || !item?.stock_mínimo) return false;
  return item?.stock_actual <= item?.stock_mínimo;
};

/**
 * Check if an item is expiring soon (within 60 days)
 * @param {Object} item - Inventory item with vencimiento date
 * @returns {boolean} - True if expiring soon
 */
export const isExpiringSoon = (item) => {
  if (!item?.vencimiento) return false;
  
  const today = new Date();
  const expirationDate = new Date(item.vencimiento);
  const differenceInTime = expirationDate?.getTime() - today?.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays <= 60 && differenceInDays >= 0;
};

/**
 * Check if an item is expired
 * @param {Object} item - Inventory item with vencimiento date
 * @returns {boolean} - True if expired
 */
export const isExpired = (item) => {
  if (!item?.vencimiento) return false;
  
  const today = new Date();
  const expirationDate = new Date(item.vencimiento);
  
  return expirationDate < today;
};

/**
 * Get stock status badge info
 * @param {Object} item - Inventory item
 * @returns {Object} - Badge info with variant and text
 */
export const getStockBadgeInfo = (item) => {
  if (isExpired(item)) {
    return { variant: 'destructive', text: 'Vencido' };
  }
  
  if (isExpiringSoon(item)) {
    return { variant: 'warning', text: 'Vence Pronto' };
  }
  
  if (isLowStock(item)) {
    return { variant: 'secondary', text: 'Bajo Stock' };
  }
  
  return { variant: 'success', text: 'En Stock' };
};

/**
 * Filter inventory items based on criteria
 * @param {Array} items - Array of inventory items
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered items
 */
export const filterInventoryItems = (items = [], filters = {}) => {
  let filteredItems = [...items];
  
  // Filter by search term
  if (filters?.search) {
    const searchLower = filters?.search?.toLowerCase();
    filteredItems = filteredItems?.filter(item => 
      item?.nombre?.toLowerCase()?.includes(searchLower) ||
      item?.codigo?.toLowerCase()?.includes(searchLower) ||
      item?.categoria?.toLowerCase()?.includes(searchLower)
    );
  }
  
  // Filter by category
  if (filters?.categoria && filters?.categoria !== 'all') {
    filteredItems = filteredItems?.filter(item => 
      item?.categoria === filters?.categoria
    );
  }
  
  // Filter by location
  if (filters?.ubicacion && filters?.ubicacion !== 'all') {
    filteredItems = filteredItems?.filter(item => 
      item?.ubicacion === filters?.ubicacion
    );
  }
  
  // Filter by stock status
  if (filters?.stockStatus) {
    switch (filters?.stockStatus) {
      case 'low':
        filteredItems = filteredItems?.filter(isLowStock);
        break;
      case 'expiring':
        filteredItems = filteredItems?.filter(isExpiringSoon);
        break;
      case 'expired':
        filteredItems = filteredItems?.filter(isExpired);
        break;
      default:
        break;
    }
  }
  
  return filteredItems;
};

/**
 * Mock inventory data for development
 */
export const mockInventoryData = [
  {
    id: 1,
    codigo: 'MED001',
    nombre: 'Paracetamol 500mg',
    categoria: 'Medicamentos',
    unidad: 'Tabletas',
    stock_actual: 150,
    stock_mínimo: 100,
    stock_máximo: 500,
    ubicacion: 'Farmacia Principal',
    proveedor_preferido: 'Laboratorios Beta',
    costo_unitario: 0.25,
    vencimiento: '2024-12-15',
    lote: 'LOT-2024-001'
  },
  {
    id: 2,
    codigo: 'MED002',
    nombre: 'Amoxicilina 250mg',
    categoria: 'Antibióticos',
    unidad: 'Cápsulas',
    stock_actual: 50,
    stock_mínimo: 75,
    stock_máximo: 200,
    ubicacion: 'Farmacia Principal',
    proveedor_preferido: 'Farmacéutica Alfa',
    costo_unitario: 0.45,
    vencimiento: '2024-10-30',
    lote: 'ANT-2024-003'
  },
  {
    id: 3,
    codigo: 'SUP001',
    nombre: 'Jeringas Desechables 10ml',
    categoria: 'Suministros Médicos',
    unidad: 'Unidades',
    stock_actual: 200,
    stock_mínimo: 150,
    stock_máximo: 1000,
    ubicacion: 'Almacén General',
    proveedor_preferido: 'Suministros Médicos SA',
    costo_unitario: 1.20,
    vencimiento: null,
    lote: 'SYR-2024-010'
  },
  {
    id: 4,
    codigo: 'EQU001',
    nombre: 'Termómetro Digital',
    categoria: 'Equipos Médicos',
    unidad: 'Unidades',
    stock_actual: 12,
    stock_mínimo: 10,
    stock_máximo: 25,
    ubicacion: 'Consultorios',
    proveedor_preferido: 'Equipos Médicos Pro',
    costo_unitario: 35.00,
    vencimiento: null,
    lote: 'THERM-2024-005'
  },
  {
    id: 5,
    codigo: 'MED003',
    nombre: 'Ibuprofeno 400mg',
    categoria: 'Medicamentos',
    unidad: 'Tabletas',
    stock_actual: 8,
    stock_mínimo: 50,
    stock_máximo: 300,
    ubicacion: 'Farmacia Principal',
    proveedor_preferido: 'Laboratorios Gamma',
    costo_unitario: 0.30,
    vencimiento: '2024-09-20',
    lote: 'IBU-2024-002'
  }
];