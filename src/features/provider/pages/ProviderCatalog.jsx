import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import BreadcrumbNavigation from "@/components/ui/BreadcrumbNavigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// Componentes específicos del catálogo B2B
import CatalogFilters from "./components/CatalogFilters";
import CatalogTable from "./components/CatalogTable";
import AddItemModal from "./components/AddItemModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import BulkActionModal from "./components/BulkActionModal";

// Clave compartida con ProviderInventory
const B2B_CATALOG_STORAGE_KEY = "mock:b2bCatalog";

// ***************************************************************
// MOCK DATA (fallback si aún no hay nada publicado)
// ***************************************************************
const mockCatalogData = [
  {
    id: 1,
    name: "Ibuprofeno 400mg",
    code: "MED-001",
    type: "product",
    category: "medicamentos",
    price: 8.5,
    stock: 150,
    minStock: 20,
    status: "active",
    targetAudience: "b2b",
  },
  {
    id: 2,
    name: "Consulta Cardiología",
    code: "SRV-001",
    type: "service",
    category: "consultas",
    price: 85,
    duration: 45,
    status: "active",
    professionalSpecialties: ["cardiologia"],
    targetAudience: "b2b",
  },
  {
    id: 3,
    name: "Paracetamol 500mg",
    code: "MED-002",
    type: "product",
    category: "medicamentos",
    price: 3.25,
    stock: 0,
    minStock: 50,
    status: "active",
    targetAudience: "b2b",
  },
  {
    id: 4,
    name: "Análisis de Sangre Completo",
    code: "LAB-001",
    type: "service",
    category: "examenes",
    price: 35,
    duration: 15,
    status: "active",
    requiresMedicalOrder: true,
    targetAudience: "b2b",
  },
];

// ***************************************************************
// COMPONENTE PRINCIPAL: MI CATÁLOGO B2B
// ***************************************************************
const ProviderCatalog = () => {
  const navigate = useNavigate();

  const [catalogItems, setCatalogItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Filtros
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
    type: "", // "product" | "service"
    status: "",
    priceMin: "",
    priceMax: "",
  });

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [bulkAction, setBulkAction] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ------------------------------------------------------------------
  // 1) Carga inicial del catálogo
  // ------------------------------------------------------------------
  useEffect(() => {
    const loadCatalogData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let initial = [];

        try {
          // Intentar leer lo publicado desde inventario (mock)
          const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              initial = parsed.filter(
                (item) =>
                  !item.targetAudience ||
                  item.targetAudience === "b2b" ||
                  item.targetAudience === "both"
              );
            }
          }
        } catch (err) {
          console.error("Error leyendo mock:b2bCatalog:", err);
        }

        if (!initial.length) {
          initial = mockCatalogData;
        }

        setCatalogItems(initial);
      } catch (error) {
        console.error("Error loading catalog:", error);
        setCatalogItems(mockCatalogData);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogData();
  }, []);

  // ------------------------------------------------------------------
  // 2) Normalización de ítems
  // ------------------------------------------------------------------
  const normalizedItems = useMemo(() => {
    return (catalogItems || []).map((item, index) => {
      const code =
        item.code ||
        item.sku ||
        item.barcode ||
        `ITEM-${item.id || index + 1}`;

      const stock =
        typeof item.stock === "number"
          ? item.stock
          : typeof item.quantity === "number"
          ? item.quantity
          : 0;

      const minStock =
        typeof item.minStock === "number"
          ? item.minStock
          : typeof item.lowStockThreshold === "number"
          ? item.lowStockThreshold
          : 0;

      const type =
        item.type || (item.duration || item.timeSlots ? "service" : "product");

      const status =
        item.status || (item.publishedAt ? "active" : "draft");

      return {
        ...item,
        code,
        stock,
        minStock,
        type,
        status,
      };
    });
  }, [catalogItems]);

  // ------------------------------------------------------------------
  // 3) Filtro reactivo
  // ------------------------------------------------------------------
  useEffect(() => {
    let filtered = [...normalizedItems];

    // Búsqueda texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const code = item.code?.toLowerCase() || "";
        const desc = item.description?.toLowerCase() || "";
        return (
          name.includes(searchTerm) ||
          code.includes(searchTerm) ||
          desc.includes(searchTerm)
        );
      });
    }

    // Categoría / Subcategoría
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }
    if (filters.subcategory) {
      filtered = filtered.filter(
        (item) => item.subcategory === filters.subcategory
      );
    }

    // Tipo: product / service
    if (filters.type) {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    // Estado (incluye "out_of_stock" solo para productos)
    if (filters.status) {
      if (filters.status === "out_of_stock") {
        filtered = filtered.filter(
          (item) => item.type === "product" && item.stock === 0
        );
      } else {
        filtered = filtered.filter((item) => item.status === filters.status);
      }
    }

    // Rango de precio
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((item) => item.price >= min);
      }
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      if (!Number.isNaN(max)) {
        filtered = filtered.filter((item) => item.price <= max);
      }
    }

    setFilteredItems(filtered);
    setSelectedItems([]);
  }, [filters, normalizedItems]);

  // ------------------------------------------------------------------
  // Handlers básicos
  // ------------------------------------------------------------------
  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  const handleClearFilters = () =>
    setFilters({
      search: "",
      category: "",
      subcategory: "",
      type: "",
      status: "",
      priceMin: "",
      priceMax: "",
    });

  const handleEditItem = (item) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteItem = async (item) => {
    if (!item) return;
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCatalogItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedItems((prev) => prev.filter((id) => id !== item.id));
      setIsDeleteModalOpen(false);
      setDeleteItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------------
  // Acciones masivas
  // ------------------------------------------------------------------
  const handleBulkAction = (action) => {
    if (!selectedItems.length) {
      alert("Selecciona al menos un artículo.");
      return;
    }
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };

  const confirmBulkAction = async (action, actionData) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      switch (action) {
        case "export":
          console.log("Exportando items:", selectedItems);
          break;

        case "update_pricing":
          setCatalogItems((prev) =>
            prev.map((item) => {
              if (!selectedItems.includes(item.id)) return item;
              if ((item.type || "product") !== "product") return item;

              let price = item.price ?? 0;
              const { mode, value } = actionData || {};

              if (mode === "percent_inc") price = price * (1 + value / 100);
              if (mode === "percent_dec") price = price * (1 - value / 100);
              if (mode === "absolute_inc") price = price + value;
              if (mode === "absolute_dec") price = Math.max(0, price - value);

              return { ...item, price: Number(price.toFixed(2)) };
            })
          );
          break;

        case "deactivate":
          setCatalogItems((prev) =>
            prev.map((item) =>
              selectedItems.includes(item.id)
                ? { ...item, status: "inactive" }
                : item
            )
          );
          break;

        case "delete":
          setCatalogItems((prev) =>
            prev.filter((item) => !selectedItems.includes(item.id))
          );
          break;

        default:
          break;
      }

      setSelectedItems([]);
      setIsBulkModalOpen(false);
      setBulkAction("");
    } catch (error) {
      console.error("Error performing bulk action:", error);
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------------
  // Guardar / actualizar item individual
  // ------------------------------------------------------------------
  const handleSaveItem = async (itemData) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (editItem) {
        setCatalogItems((prev) =>
          prev.map((item) =>
            item.id === editItem.id ? { ...itemData, id: editItem.id } : item
          )
        );
      } else {
        const newItem = {
          ...itemData,
          id: Date.now(),
          targetAudience: itemData.targetAudience || "b2b",
        };
        setCatalogItems((prev) => [newItem, ...prev]);
      }

      setIsAddModalOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <>
      <Helmet>
        <title>Mi Catálogo B2B - Healtng</title>
      </Helmet>

      <div className="p-6 max-w-7xl mx-auto">
        <BreadcrumbNavigation
          items={[
            { label: "Inicio", path: "/provider/dashboard" },
            { label: "Marketplace B2B", path: "/provider/b2b" },
            { label: "Mi catálogo B2B" },
          ]}
        />

        {/* Header de página */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Mi catálogo B2B
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los productos y servicios que aparecen en tu tienda del
              marketplace empresarial.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/provider/b2b")}
            >
              <Icon name="Store" size={16} className="mr-2" />
              Ver mi tienda
            </Button>
            <Button
              variant="default"
              onClick={() => navigate("/provider/b2b/publish")}
              iconName="Plus"
              iconPosition="left"
            >
              Publicar producto
            </Button>
          </div>
        </header>

        {/* Filtros + acciones masivas */}
        <div className="mb-6">
          <CatalogFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredItems.length}
            onBulkAction={handleBulkAction}
            selectedCount={selectedItems.length}
          />
        </div>

        {/* Tabla principal */}
        <CatalogTable
          items={filteredItems}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          loading={loading}
        />

        {/* Barra inferior cuando hay selección */}
        {selectedItems.length > 0 && (
          <div className="sticky bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground p-3 rounded-t-lg shadow-2xl flex justify-between items-center mt-6">
            <p className="font-medium">
              {selectedItems.length} artículo
              {selectedItems.length !== 1 ? "s" : ""} seleccionado
              {selectedItems.length !== 1 ? "s" : ""}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedItems([])}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Icon name="X" size={16} className="mr-2" />
              Limpiar selección
            </Button>
          </div>
        )}

        {/* Modales */}
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditItem(null);
          }}
          onSave={handleSaveItem}
          editItem={editItem}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteItem(null);
          }}
          onConfirm={confirmDeleteItem}
          item={deleteItem}
          loading={saving}
        />

        <BulkActionModal
          isOpen={isBulkModalOpen}
          onClose={() => {
            setIsBulkModalOpen(false);
            setBulkAction("");
          }}
          onConfirm={confirmBulkAction}
          action={bulkAction}
          selectedItems={selectedItems}
          loading={saving}
        />
      </div>
    </>
  );
};

export default ProviderCatalog;
