import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from ".@/components/AppIcon";
import Button from "@/components/ui/Button";
import { getAllMocksForCurrentBusiness } from "../../utils/mockData";

// Business-specific dashboard components
const PharmacyDashboard = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <p className="text-2xl font-bold">${data?.kpis?.ventasHoy}</p>
            </div>
            <Icon name="DollarSign" className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recetas Activas</p>
              <p className="text-2xl font-bold">{data?.kpis?.ordenesActivas}</p>
            </div>
            <Icon name="FileText" className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Fill Rate</p>
            <p className="text-2xl font-bold">{data?.kpis?.fillRate}%</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Medicamento Top</p>
            <p className="text-lg font-semibold">{data?.kpis?.topSKU}</p>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Catálogo de Medicamentos</h3>
          <Button onClick={() => navigate("/publish/new")}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Publicar Producto
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">B2C</th>
                <th className="px-4 py-3 text-left">B2B</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.slice(0, 8)?.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-mono text-sm">{product?.sku}</td>
                  <td className="px-4 py-3">{product?.name}</td>
                  <td className="px-4 py-3">${product?.price}</td>
                  <td className="px-4 py-3">{product?.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product?.b2c ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product?.b2c ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product?.b2b ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product?.b2b ? 'Sí' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Órdenes Recientes</h3>
        </div>
        <div className="p-4 space-y-3">
          {data?.orders?.slice(0, 5)?.map((order, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{order?.id}</p>
                <p className="text-sm text-muted-foreground">{order?.client}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order?.total}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order?.status === 'Completado' ? 'bg-green-100 text-green-800' :
                  order?.status === 'Procesando'? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {order?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LabDashboard = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* KPI Cards for Lab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <p className="text-2xl font-bold">${data?.kpis?.ventasHoy}</p>
            </div>
            <Icon name="DollarSign" className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estudios Activos</p>
              <p className="text-2xl font-bold">{data?.kpis?.ordenesActivas}</p>
            </div>
            <Icon name="FlaskConical" className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Fill Rate</p>
            <p className="text-2xl font-bold">{data?.kpis?.fillRate}%</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Reactivo Top</p>
            <p className="text-lg font-semibold">{data?.kpis?.topSKU}</p>
          </div>
        </div>
      </div>
      {/* Services Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Estudios y Reactivos</h3>
          <Button onClick={() => navigate("/publish/new")}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Publicar Servicio
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Preparación</th>
                <th className="px-4 py-3 text-left">Tiempo</th>
                <th className="px-4 py-3 text-left">Precio</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.slice(0, 6)?.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-mono text-sm">{product?.sku}</td>
                  <td className="px-4 py-3">{product?.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">8 hrs ayuno</td>
                  <td className="px-4 py-3 text-sm">2-4 hrs</td>
                  <td className="px-4 py-3">${product?.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Appointments Calendar Preview */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Agenda de Hoy</h3>
        </div>
        <div className="p-4 space-y-3">
          {data?.appointments?.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{appointment?.who}</p>
                <p className="text-sm text-muted-foreground">{appointment?.service}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{appointment?.when?.split(' ')?.[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OpticsDashboard = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <p className="text-2xl font-bold">${data?.kpis?.ventasHoy}</p>
            </div>
            <Icon name="DollarSign" className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Citas Activas</p>
              <p className="text-2xl font-bold">{data?.kpis?.ordenesActivas}</p>
            </div>
            <Icon name="Eye" className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Fill Rate</p>
            <p className="text-2xl font-bold">{data?.kpis?.fillRate}%</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Producto Top</p>
            <p className="text-lg font-semibold">{data?.kpis?.topSKU}</p>
          </div>
        </div>
      </div>
      {/* Catalog Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Catálogo Óptico</h3>
          <Button onClick={() => navigate("/publish/new")}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Publicar Producto
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Publicado</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.slice(0, 8)?.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-mono text-sm">{product?.sku}</td>
                  <td className="px-4 py-3">{product?.name}</td>
                  <td className="px-4 py-3">${product?.price}</td>
                  <td className="px-4 py-3">{product?.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product?.b2c || product?.b2b ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product?.b2c || product?.b2b ? 'Sí' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Vision Appointments */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Citas de Hoy</h3>
        </div>
        <div className="p-4 space-y-3">
          {data?.appointments?.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{appointment?.who}</p>
                <p className="text-sm text-muted-foreground">{appointment?.service}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{appointment?.when?.split(' ')?.[1]}</p>
                <Button size="sm" variant="outline">Ver Detalles</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClinicDashboardPro = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
              <p className="text-2xl font-bold">${data?.kpis?.ventasHoy}</p>
            </div>
            <Icon name="DollarSign" className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consultas Activas</p>
              <p className="text-2xl font-bold">{data?.kpis?.ordenesActivas}</p>
            </div>
            <Icon name="Users" className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Ocupación</p>
            <p className="text-2xl font-bold">{data?.kpis?.fillRate}%</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Servicio Top</p>
            <p className="text-lg font-semibold">{data?.kpis?.topService}</p>
          </div>
        </div>
      </div>
      {/* Services Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Servicios Médicos</h3>
          <Button onClick={() => navigate("/publish/new")}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Publicar Servicio
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Servicio</th>
                <th className="px-4 py-3 text-left">Duración</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Disponible</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.slice(0, 8)?.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-mono text-sm">{product?.sku}</td>
                  <td className="px-4 py-3">{product?.name}</td>
                  <td className="px-4 py-3 text-sm">30 min</td>
                  <td className="px-4 py-3">${product?.price}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Sí
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Monthly Calendar Preview */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Agenda del Mes</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
            <div className="font-medium text-muted-foreground">Dom</div>
            <div className="font-medium text-muted-foreground">Lun</div>
            <div className="font-medium text-muted-foreground">Mar</div>
            <div className="font-medium text-muted-foreground">Mié</div>
            <div className="font-medium text-muted-foreground">Jue</div>
            <div className="font-medium text-muted-foreground">Vie</div>
            <div className="font-medium text-muted-foreground">Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 6;
              const isToday = day === new Date()?.getDate();
              const hasAppointments = [5, 8, 12, 15, 20, 25]?.includes(day);
              
              return (
                <div key={i} className={`p-2 text-center text-sm border rounded ${
                  day > 0 && day <= 31 ? 'bg-background' : 'bg-muted/30'
                } ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>
                  {day > 0 && day <= 31 ? day : ''}
                  {hasAppointments && day > 0 && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DistributorDashboard = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <p className="text-2xl font-bold">${data?.kpis?.ventasHoy}</p>
            </div>
            <Icon name="DollarSign" className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Órdenes B2B</p>
              <p className="text-2xl font-bold">{data?.kpis?.ordenesActivas}</p>
            </div>
            <Icon name="Package" className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Fill Rate</p>
            <p className="text-2xl font-bold">{data?.kpis?.fillRate}%</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Producto Top</p>
            <p className="text-lg font-semibold">{data?.kpis?.topSKU}</p>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Catálogo B2B</h3>
          <Button onClick={() => navigate("/publish/new")}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Publicar Producto
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">B2B</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.slice(0, 8)?.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-mono text-sm">{product?.sku}</td>
                  <td className="px-4 py-3">{product?.name}</td>
                  <td className="px-4 py-3">${product?.price}</td>
                  <td className="px-4 py-3">{product?.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product?.b2b ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product?.b2b ? 'Sí' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B2B Supply Chain */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Abastecimiento B2B</h3>
        </div>
        <div className="p-4 space-y-3">
          {data?.supply?.map((supplyItem, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{supplyItem?.id}</p>
                <p className="text-sm text-muted-foreground">{supplyItem?.provider} - {supplyItem?.product}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Cant: {supplyItem?.quantity}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  supplyItem?.status === 'Completado' ? 'bg-green-100 text-green-800' :
                  supplyItem?.status === 'Procesando'? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {supplyItem?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InsurerDashboard = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Primas Hoy</p>
              <p className="text-2xl font-bold">${data?.kpis?.ventasHoy}</p>
            </div>
            <Icon name="DollarSign" className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Autorizaciones</p>
              <p className="text-2xl font-bold">{data?.kpis?.ordenesActivas}</p>
            </div>
            <Icon name="ShieldCheck" className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Ratio Aprobación</p>
            <p className="text-2xl font-bold">{data?.kpis?.fillRate}%</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Plan Top</p>
            <p className="text-lg font-semibold">{data?.kpis?.topSKU}</p>
          </div>
        </div>
      </div>

      {/* Authorizations Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Autorizaciones y Siniestros</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Procedimiento</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.authorizations?.map((auth, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-mono text-sm">{auth?.id}</td>
                  <td className="px-4 py-3">{auth?.patient}</td>
                  <td className="px-4 py-3">{auth?.procedure}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      auth?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      auth?.status === 'denied'? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {auth?.status === 'approved' ? 'Aprobado' :
                       auth?.status === 'denied' ? 'Denegado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline">Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claims Summary */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Siniestros Recientes</h3>
        </div>
        <div className="p-4 space-y-3">
          {data?.claims?.map((claim, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{claim?.id}</p>
                <p className="text-sm text-muted-foreground">{claim?.patient}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${claim?.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  claim?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {claim?.status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BusinessTypeDashboardHub = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusinessData = () => {
      try {
        const data = getAllMocksForCurrentBusiness();
        setBusinessData(data);
      } catch (error) {
        console.error("Error loading business data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, []);

  const renderDashboard = () => {
    if (!businessData) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Icon name="Building" className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h2 className="text-xl font-semibold">Configure su Negocio</h2>
              <p className="text-muted-foreground">Defina el tipo de negocio para ver el dashboard especializado</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/provider-profile-setup")}
              >
                <Icon name="Settings" className="h-4 w-4 mr-2" />
                Configurar Ahora
              </Button>
            </div>
          </div>
        </div>
      );
    }

    const businessType = businessData?.context?.businessType?.toLowerCase() || "";

    if (businessType?.includes("farmacia")) {
      return <PharmacyDashboard data={businessData} />;
    } else if (businessType?.includes("laboratorio")) {
      return <LabDashboard data={businessData} />;
    } else if (businessType?.includes("óptica") || businessType?.includes("optica") || businessType?.includes("visión")) {
      return <OpticsDashboard data={businessData} />;
    } else if (businessType?.includes("consultorio") || businessType?.includes("centro") || businessType?.includes("salud")) {
      return <ClinicDashboardPro data={businessData} />;
    } else if (businessType?.includes("distribuidor") || businessType?.includes("equipo") || businessType?.includes("insumo")) {
      return <DistributorDashboard data={businessData} />;
    } else if (businessType?.includes("seguro")) {
      return <InsurerDashboard data={businessData} />;
    } else {
      return <PharmacyDashboard data={businessData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Icon name="Loader" className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Panel {businessData?.context?.businessType || "Principal"}
          </h1>
          <p className="text-muted-foreground">
            {businessData?.context?.businessName} - {businessData?.context?.operationCategory}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/provider-profile-setup")}>
            <Icon name="Settings" className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={() => navigate("/publish/new")}>
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      {/* Dynamic Dashboard Content */}
      {renderDashboard()}

      {/* Quick Actions */}
      <div className="mt-8 bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/provider/products")}
            className="h-auto p-4 flex-col"
          >
            <Icon name="Package2" className="h-6 w-6 mb-2" />
            <span>Gestionar Productos</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/provider/orders")}
            className="h-auto p-4 flex-col"
          >
            <Icon name="ShoppingCart" className="h-6 w-6 mb-2" />
            <span>Ver Pedidos</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/provider/uploads")}
            className="h-auto p-4 flex-col"
          >
            <Icon name="Upload" className="h-6 w-6 mb-2" />
            <span>Cargas Masivas</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/provider/analytics")}
            className="h-auto p-4 flex-col"
          >
            <Icon name="LineChart" className="h-6 w-6 mb-2" />
            <span>Analíticas</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessTypeDashboardHub;