// src/utils/shipmentsMock.js
let mockShipments = [
  {
    id: 'ENV-2025-006',
    orderId: 'PED-2025-050',
    destination: 'Hospital Clínico San Carlos, Madrid',
    method: 'Standard',
    status: 'pending', // pending | in_transit | delivered | late
    eta: '2025-01-17',
    tracking: 'TRK-ESP-987654321',
  },
  {
    id: 'ENV-2025-005',
    orderId: 'PED-2025-049',
    destination: 'Hospital La Paz, Madrid',
    method: 'Express',
    status: 'in_transit',
    eta: '2025-01-16',
    tracking: 'TRK-ESP-123456789',
  },
  {
    id: 'ENV-2025-004',
    orderId: 'PED-2025-048',
    destination: "Hospital Virgen del Rocío, Sevilla",
    method: 'Same-Day',
    status: 'late',
    eta: '2025-01-10',
    tracking: 'TRK-ESP-456789123',
  },
  {
    id: 'ENV-2025-003',
    orderId: 'PED-2025-047',
    destination: "Hospital Vall d'Hebron, Barcelona",
    method: 'Overnight',
    status: 'pending',
    eta: '2025-01-15',
    tracking: 'TRK-ESP-321654987',
  },
  {
    id: 'ENV-2025-002',
    orderId: 'PED-2025-046',
    destination: 'Clínica Univ. Navarra, Pamplona',
    method: 'Standard',
    status: 'delivered',
    eta: '2025-01-11',
    tracking: 'TRK-ESP-741852963',
  },
];

export function getShipments() {
  return [...(mockShipments || [])];
}

export function setShipments(next) {
  if (Array.isArray(next)) mockShipments = [...next];
  return getShipments();
}
