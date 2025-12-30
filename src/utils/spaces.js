// src/utils/spaces.js

/**
 * Mock spaces data for development
 */
export const mockSpaces = [
  {
    id: 'SP-001',
    name: 'Consultorio 1',
    type: 'Consultorio',
    capacity: 1,
    hourlyRate: 25,
    amenities: ['WiFi', 'Lavamanos'],
    status: 'Disponible',
    location: 'Piso 1, Ala Norte',
    floor: '1',
    wing: 'Norte',
    photos: [],
    description: 'Consultorio equipado para consultas generales',
    equipment: ['Escritorio', 'Silla médica', 'Camilla'],
    createdAt: '2024-08-15',
    isPublished: true
  },
  {
    id: 'SP-002',
    name: 'Consultorio 2',
    type: 'Consultorio',
    capacity: 1,
    hourlyRate: 25,
    amenities: ['WiFi'],
    status: 'Disponible',
    location: 'Piso 1, Ala Norte',
    floor: '1',
    wing: 'Norte',
    photos: [],
    description: 'Consultorio básico para consultas',
    equipment: ['Escritorio', 'Silla médica'],
    createdAt: '2024-08-20',
    isPublished: true
  },
  {
    id: 'SP-003',
    name: 'Sala de Procedimientos',
    type: 'Procedimientos',
    capacity: 2,
    hourlyRate: 60,
    amenities: ['Esterilización', 'Monitor'],
    status: 'Mantenimiento',
    location: 'Piso 2, Ala Sur',
    floor: '2',
    wing: 'Sur',
    photos: [],
    description: 'Sala equipada para procedimientos menores',
    equipment: ['Camilla especial', 'Lámpara quirúrgica', 'Mesa de instrumentos'],
    createdAt: '2024-08-10',
    isPublished: true
  },
  {
    id: 'SP-004',
    name: 'Booth Teleconsulta 1',
    type: 'Teleconsulta booth',
    capacity: 1,
    hourlyRate: 20,
    amenities: ['WiFi', 'Cámara HD', 'Audio profesional'],
    status: 'Disponible',
    location: 'Piso 1, Ala Oeste',
    floor: '1',
    wing: 'Oeste',
    photos: [],
    description: 'Espacio para teleconsultas con tecnología avanzada',
    equipment: ['Computadora', 'Cámara 4K', 'Micrófono'],
    createdAt: '2024-09-01',
    isPublished: true
  },
  {
    id: 'SP-005',
    name: 'Sala de Rehabilitación',
    type: 'Rehabilitación',
    capacity: 3,
    hourlyRate: 45,
    amenities: ['Equipos de fisioterapia', 'Espejos', 'Colchonetas'],
    status: 'Ocupado',
    location: 'Piso 3, Ala Este',
    floor: '3',
    wing: 'Este',
    photos: [],
    description: 'Sala amplia para terapias de rehabilitación',
    equipment: ['Equipos de ejercicio', 'Camillas de terapia', 'Espejos grandes'],
    createdAt: '2024-07-25',
    isPublished: true
  }
];

/**
 * Mock bookings data for development
 */
export const mockBookings = [
  {
    id: 'BK-001',
    spaceId: 'SP-001',
    spaceName: 'Consultorio 1',
    date: '2024-09-05',
    startTime: '09:00',
    endTime: '10:00',
    professional: 'Dr. Pérez',
    usage: 'Consulta cardiológica',
    status: 'confirmada',
    notes: 'Paciente con seguimiento',
    totalCost: 25,
    createdAt: '2024-09-03T10:00:00Z',
    contactInfo: 'dr.perez@email.com'
  },
  {
    id: 'BK-002',
    spaceId: 'SP-004',
    spaceName: 'Booth Teleconsulta 1',
    date: '2024-09-05',
    startTime: '14:00',
    endTime: '15:00',
    professional: 'Dra. López',
    usage: 'Teleconsulta dermatología',
    status: 'pendiente',
    notes: 'Primera consulta virtual',
    totalCost: 20,
    createdAt: '2024-09-04T08:30:00Z',
    contactInfo: 'dra.lopez@email.com'
  },
  {
    id: 'BK-003',
    spaceId: 'SP-005',
    spaceName: 'Sala de Rehabilitación',
    date: '2024-09-06',
    startTime: '10:00',
    endTime: '12:00',
    professional: 'Lic. Martínez',
    usage: 'Fisioterapia post-operatoria',
    status: 'confirmada',
    notes: 'Sesión de 2 horas',
    totalCost: 90,
    createdAt: '2024-09-02T16:20:00Z',
    contactInfo: 'lic.martinez@email.com'
  }
];

/**
 * Available space types
 */
export const spaceTypes = [
  'Consultorio',
  'Procedimientos',
  'Teleconsulta booth',
  'Rehabilitación'
];

/**
 * Available space statuses
 */
export const spaceStatuses = [
  'Disponible',
  'Reservado',
  'Mantenimiento',
  'Ocupado'
];

/**
 * Amenities list for forms and components
 */
export const amenitiesList = [
  'WiFi',
  'Lavamanos',
  'Esterilización',
  'Monitor',
  'Ecógrafo',
  'Luz indirecta',
  'Cámara HD',
  'Audio profesional',
  'Equipos de fisioterapia',
  'Espejos',
  'Colchonetas',
  'Aire acondicionado',
  'Calefacción',
  'Ventanas',
  'Iluminación natural'
];

/**
 * Booking statuses
 */
export const bookingStatuses = [
  'pendiente',
  'confirmada',
  'cancelada',
  'completada'
];

/**
 * Check if two time ranges overlap
 */
export const isOverlapping = (aStart, aEnd, bStart, bEnd) => {
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr?.split(':')?.map(Number);
    return hours * 60 + minutes;
  };

  const aStartMin = parseTime(aStart);
  const aEndMin = parseTime(aEnd);
  const bStartMin = parseTime(bStart);
  const bEndMin = parseTime(bEnd);

  return aStartMin < bEndMin && bStartMin < aEndMin;
};

/**
 * Check for booking conflicts
 */
export const checkBookingConflicts = (spaceId, date, startTime, endTime, excludeBookingId = null, currentBookings = mockBookings) => {
  return currentBookings?.filter(booking => {
    if (booking?.id === excludeBookingId) return false;
    if (booking?.spaceId !== spaceId) return false;
    if (booking?.date !== date) return false;
    if (booking?.status === 'cancelada') return false;

    return isOverlapping(startTime, endTime, booking?.startTime, booking?.endTime);
  });
};

/**
 * Implementación real de isSlotAvailable para validar disponibilidad
 */
export const isSlotAvailable = (spaceId, date, startTime, endTime, currentBookings = mockBookings) => {
  if (!spaceId || !date || !startTime || !endTime) return false;
  
  const conflicts = checkBookingConflicts(spaceId, date, startTime, endTime, null, currentBookings);
  return conflicts?.length === 0;
};

/**
 * Calculate booking duration in hours
 */
export const calculateBookingDuration = (startTime, endTime) => {
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr?.split(':')?.map(Number);
    return hours + minutes / 60;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  return Math.max(0, end - start);
};

/**
 * Calculate total cost for a booking
 */
export const calculateBookingCost = (hourlyRate, startTime, endTime) => {
  const duration = calculateBookingDuration(startTime, endTime);
  return duration * hourlyRate;
};

/**
 * Filter spaces based on criteria
 */
export const filterSpaces = (spaces = [], filters = {}) => {
  let filteredSpaces = [...spaces];

  if (filters?.search) {
    const searchLower = filters?.search?.toLowerCase();
    filteredSpaces = filteredSpaces?.filter(space =>
      space?.name?.toLowerCase()?.includes(searchLower) ||
      space?.id?.toLowerCase()?.includes(searchLower) ||
      space?.type?.toLowerCase()?.includes(searchLower) ||
      space?.location?.toLowerCase()?.includes(searchLower)
    );
  }

  if (filters?.type && filters?.type !== 'all') {
    filteredSpaces = filteredSpaces?.filter(space => space?.type === filters?.type);
  }

  if (filters?.status && filters?.status !== 'all') {
    filteredSpaces = filteredSpaces?.filter(space => space?.status === filters?.status);
  }

  return filteredSpaces;
};

/**
 * Get today's bookings
 */
export const getTodaysBookings = () => {
  const today = new Date()?.toISOString()?.split('T')?.[0];
  return mockBookings?.filter(booking => booking?.date === today);
};

/**
 * Get space utilization percentage
 */
export const getSpaceUtilization = (spaceId, startDate, endDate) => {
  const bookings = mockBookings?.filter(booking => {
    if (booking?.spaceId !== spaceId || booking?.status === 'cancelada') return false;
    const bookingDate = new Date(booking.date);
    return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
  });

  const totalBookedHours = bookings?.reduce((total, booking) => {
    return total + calculateBookingDuration(booking?.startTime, booking?.endTime);
  }, 0);

  return Math.min(100, (totalBookedHours / 70) * 100); // 70h estimadas por semana
};

/**
 * Generate time slots for booking
 */
export const generateTimeSlots = (startHour = '08', endHour = '18', interval = 30) => {
  const slots = [];
  for (let hour = parseInt(startHour); hour < parseInt(endHour); hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

/**
 * Get status color for UI components
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'disponible':
    case 'confirmada':
      return 'text-green-600 bg-green-100';
    case 'reservado':
    case 'completada':
      return 'text-blue-600 bg-blue-100';
    case 'ocupado':
      return 'text-red-600 bg-red-100';
    case 'mantenimiento':
      return 'text-orange-600 bg-orange-100';
    case 'pendiente':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount, currency = '$') => {
  return `${currency}${amount?.toFixed(2)}`;
};