import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { getProducts } from "../../../utils/mockData";

// Sub-componentes
import ProductInfoForm from "./components/ProductInfoForm";
import StockManagementPanel from "./components/StockManagementPanel";
import MovementHistoryTab from "./components/MovementHistoryTab";
import OrderAssociationsTab from "./components/OrderAssociationsTab";
import SupplierInfoTab from "./components/SupplierInfoTab";

export default function ProviderProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("movements");
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState(null);

  // Buscar producto
  useEffect(() => {
    const all = (getProducts && typeof getProducts === "function" ? getProducts() : []) || [];
    const found =
      all.find((p) => String(p?.id) === id) ||
      all.find((p) => String(p?.sku) === id);

    if (!found) {
      setProduct(null);
      return;
    }

    const enriched = {
      ...found,
      description: found?.description || "Detalle no disponible (mock).",
      barcode: found?.barcode || "—",
      unitOfMeasure: found?.uom || "unidad",
      supplierPrice: found?.supplierPrice ?? Math.max(0, Number(found?.price) * 0.7),
      status: "active",
      currentStock: Number(found?.stock ?? 0),
      reservedStock: Math.round((found?.stock ?? 0) * 0.15),
      reorderPoint: Math.max(5, Math.round((found?.stock ?? 0) * 0.1)),
      maxStock: Math.max(50, Math.round((found?.stock ?? 0) * 3)),
      lastUpdated: new Date(),
      createdDate: new Date(),
      lastMovement: new Date(),
      category: found?.category || "General",
      subcategory: found?.subcategory || "",
      unitPrice: Number(found?.price ?? 0),
      createdBy: "Sistema",
      updatedBy: "Sistema",
    };

    setProduct(enriched);
  }, [id]);

  const tabs = useMemo(
    () => [
      { id: "movements", label: "Historial de Movimientos", icon: "Activity" },
      { id: "orders", label: "Pedidos Asociados", icon: "ShoppingCart" },
      { id: "suppliers", label: "Información de Proveedores", icon: "Building" },
    ],
    []
  );

  const handleSave = (draft) => {
    setProduct((prev) => ({ ...prev, ...draft, lastUpdated: new Date() }));
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  const handleStockAdjustment = ({ type, quantity }) => {
    if (!product) return;
    const qty = Number(quantity || 0);
    const next =
      type === "entry"
        ? product.currentStock + qty
        : Math.max(0, product.currentStock - qty);
    setProduct((p) => ({ ...p, currentStock: next, lastMovement: new Date() }));
  };

  const handleCreateOrder = () => {
    navigate(`/provider/orders?from=${encodeURIComponent(product?.id || id)}`);
  };

  if (product === null) {
    return (
      <div className="p-4 lg:p-6">
        <Breadcrumb />
        <div className="text-center py-16">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Producto no encontrado</h2>
          <p className="text-muted-foreground mb-6">
            Verifica el identificador en la URL o vuelve al inventario.
          </p>
          <Button onClick={() => navigate("/provider/inventory")} iconName="ArrowLeft" iconPosition="left">
            Volver al Inventario
          </Button>
        </div>
      </div>
    );
  }

  const statusChip =
    product?.status === "active"
      ? "bg-green-100 text-green-700"
      : product?.status === "inactive"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="p-4 lg:p-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
            <Icon name="Package" size={28} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{product?.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusChip}`}>
                {product?.status === "active"
                  ? "Activo"
                  : product?.status === "inactive"
                  ? "Inactivo"
                  : "Descontinuado"}
              </span>
            </div>
            <p className="text-muted-foreground mb-1">{product?.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Icon name="Hash" size={12} /> {product?.id || product?.sku}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="Barcode" size={12} /> {product?.barcode || "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="Calendar" size={12} /> Actualizado:{" "}
                {product?.lastUpdated
                  ? product.lastUpdated.toLocaleDateString("es-ES")
                  : "—"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/provider/inventory")} iconName="ArrowLeft" iconPosition="left">
            Volver al Inventario
          </Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} iconName="Edit" iconPosition="left">
              Editar Producto
            </Button>
          )}
        </div>
      </div>

      {/* Info + Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <ProductInfoForm product={product} isEditing={isEditing} onSave={handleSave} onCancel={handleCancel} />
        </div>
        <div>
          <StockManagementPanel
            product={product}
            onStockAdjustment={handleStockAdjustment}
            onCreateOrder={handleCreateOrder}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-lg">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium ${
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "movements" && <MovementHistoryTab productId={product?.id || product?.sku} />}
          {activeTab === "orders" && <OrderAssociationsTab productId={product?.id || product?.sku} />}
          {activeTab === "suppliers" && <SupplierInfoTab productId={product?.id || product?.sku} />}
        </div>
      </div>
    </div>
  );
}
