// Spaces management utility functions and mock data

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
 * Available amenities for spaces
 */
export const availableAmenities = [
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
 * @param {string} aStart - Start time of first range (HH:MM format)
 * @param {string} aEnd - End time of first range (HH:MM format)
 * @param {string} bStart - Start time of second range (HH:MM format)
 * @param {string} bEnd - End time of second range (HH:MM format)
 * @returns {boolean} - True if ranges overlap
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
 * @param {string} spaceId - Space ID to check
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {string} excludeBookingId - Booking ID to exclude from conflict check
 * @returns {Array} - Array of conflicting bookings
 */
export const checkBookingConflicts = (spaceId, date, startTime, endTime, excludeBookingId = null) => {
  return mockBookings?.filter(booking => {
    if (booking?.id === excludeBookingId) return false;
    if (booking?.spaceId !== spaceId) return false;
    if (booking?.date !== date) return false;
    if (booking?.status === 'cancelada') return false;

    return isOverlapping(startTime, endTime, booking?.startTime, booking?.endTime);
  });
};

/**
 * Calculate booking duration in hours
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} - Duration in hours
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
 * @param {number} hourlyRate - Hourly rate for the space
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} - Total cost
 */
export const calculateBookingCost = (hourlyRate, startTime, endTime) => {
  const duration = calculateBookingDuration(startTime, endTime);
  return duration * hourlyRate;
};

/**
 * Filter spaces based on criteria
 * @param {Array} spaces - Array of spaces
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered spaces
 */
export const filterSpaces = (spaces = [], filters = {}) => {
  let filteredSpaces = [...spaces];

  // Filter by search term
  if (filters?.search) {
    const searchLower = filters?.search?.toLowerCase();
    filteredSpaces = filteredSpaces?.filter(space =>
      space?.name?.toLowerCase()?.includes(searchLower) ||
      space?.id?.toLowerCase()?.includes(searchLower) ||
      space?.type?.toLowerCase()?.includes(searchLower) ||
      space?.location?.toLowerCase()?.includes(searchLower)
    );
  }

  // Filter by type
  if (filters?.type && filters?.type !== 'all') {
    filteredSpaces = filteredSpaces?.filter(space =>
      space?.type === filters?.type
    );
  }

  // Filter by status
  if (filters?.status && filters?.status !== 'all') {
    filteredSpaces = filteredSpaces?.filter(space =>
      space?.status === filters?.status
    );
  }

  // Filter by availability for a specific date/time
  if (filters?.date && filters?.startTime && filters?.endTime) {
    filteredSpaces = filteredSpaces?.filter(space => {
      if (space?.status !== 'Disponible') return false;
      
      const conflicts = checkBookingConflicts(
        space?.id,
        filters?.date,
        filters?.startTime,
        filters?.endTime
      );
      
      return conflicts?.length === 0;
    });
  }

  return filteredSpaces;
};

/**
 * Get bookings for a specific date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} - Bookings in the date range
 */
export const getBookingsInDateRange = (startDate, endDate) => {
  return mockBookings?.filter(booking => {
    const bookingDate = new Date(booking.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bookingDate >= start && bookingDate <= end;
  });
};

/**
 * Get today's bookings
 * @returns {Array} - Today's bookings
 */
export const getTodaysBookings = () => {
  const today = new Date()?.toISOString()?.split('T')?.[0];
  return mockBookings?.filter(booking => booking?.date === today);
};

/**
 * Get space utilization percentage
 * @param {string} spaceId - Space ID
 * @param {string} startDate - Start date for calculation
 * @param {string} endDate - End date for calculation
 * @returns {number} - Utilization percentage (0-100)
 */
export const getSpaceUtilization = (spaceId, startDate, endDate) => {
  const bookings = mockBookings?.filter(booking => {
    if (booking?.spaceId !== spaceId) return false;
    if (booking?.status === 'cancelada') return false;
    
    const bookingDate = new Date(booking.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bookingDate >= start && bookingDate <= end;
  });

  // Calculate total booked hours
  const totalBookedHours = bookings?.reduce((total, booking) => {
    return total + calculateBookingDuration(booking?.startTime, booking?.endTime);
  }, 0);

  // Assume 8 hours per day availability (8:00-18:00)
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const daysDiff = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
  const totalAvailableHours = daysDiff * 10; // 10 hours per day

  return Math.min(100, (totalBookedHours / totalAvailableHours) * 100);
};

/**
 * Generate time slots for booking
 * @param {string} startHour - Start hour (e.g., '08')
 * @param {string} endHour - End hour (e.g., '18')
 * @param {number} interval - Interval in minutes (default: 30)
 * @returns {Array} - Array of time slots in HH:MM format
 */
export const generateTimeSlots = (startHour = '08', endHour = '18', interval = 30) => {
  const slots = [];
  const start = parseInt(startHour);
  const end = parseInt(endHour);
  
  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeSlot = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
      slots?.push(timeSlot);
    }
  }
  
  return slots;
};

/**
 * Get status color for UI components
 * @param {string} status - Status string
 * @returns {string} - CSS color class
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'disponible':
      return 'text-green-600 bg-green-100';
    case 'reservado':
      return 'text-blue-600 bg-blue-100';
    case 'ocupado':
      return 'text-red-600 bg-red-100';
    case 'mantenimiento':
      return 'text-orange-600 bg-orange-100';
    case 'confirmada':
      return 'text-green-600 bg-green-100';
    case 'pendiente':
      return 'text-yellow-600 bg-yellow-100';
    case 'cancelada':
      return 'text-gray-600 bg-gray-100';
    case 'completada':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
  return `${currency}${amount?.toFixed(2)}`;
};

/**
 * Format time range for display
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {string} - Formatted time range
 */
export const formatTimeRange = (startTime, endTime) => {
  return `${startTime} - ${endTime}`;
};

/**
 * Validate booking form data
 * @param {Object} bookingData - Booking form data
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateBookingData = (bookingData) => {
  const errors = {};

  if (!bookingData?.spaceId) {
    errors.spaceId = 'Selecciona un espacio';
  }

  if (!bookingData?.date) {
    errors.date = 'Selecciona una fecha';
  }

  if (!bookingData?.startTime) {
    errors.startTime = 'Selecciona hora de inicio';
  }

  if (!bookingData?.endTime) {
    errors.endTime = 'Selecciona hora de fin';
  }

  if (bookingData?.startTime && bookingData?.endTime) {
    if (bookingData?.startTime >= bookingData?.endTime) {
      errors.endTime = 'La hora de fin debe ser posterior al inicio';
    }
  }

  if (!bookingData?.professional?.trim()) {
    errors.professional = 'Indica el profesional responsable';
  }

  if (!bookingData?.usage?.trim()) {
    errors.usage = 'Describe el uso previsto';
  }

  // Check for conflicts
  if (bookingData?.spaceId && bookingData?.date && bookingData?.startTime && bookingData?.endTime) {
    const conflicts = checkBookingConflicts(
      bookingData?.spaceId,
      bookingData?.date,
      bookingData?.startTime,
      bookingData?.endTime,
      bookingData?.id
    );

    if (conflicts?.length > 0) {
      errors.conflict = 'Existe un conflicto de horario con otra reserva';
    }
  }

  return {
    isValid: Object.keys(errors)?.length === 0,
    errors
  };
};

function isSlotAvailable(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: isSlotAvailable is not implemented yet.', args);
  return null;
}

export { isSlotAvailable };