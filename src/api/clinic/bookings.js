// src/api/clinic/bookings.js
import { createMockClient } from "@/api/_mockBase"; // Utilizamos la base de mock para simular las reservas

// Creamos un cliente mock para las reservas con datos iniciales simulados
const client = createMockClient("healtng_bookings_v1", {
  seed: [
    // Datos de prueba de reservas
    {
      id: "booking-001",
      spaceId: "space-001", // ID del espacio
      patientName: "Juan Pérez",
      professional: "Dr. Carlos Martínez",
      status: "reservado",
      date: "2025-05-01T09:00:00Z", // Fecha y hora de la reserva
      totalCost: 30.0, // Costo de la reserva
      startTime: "09:00", // Hora de inicio
      endTime: "10:00", // Hora de fin
      description: "Consulta general",
    },
    {
      id: "booking-002",
      spaceId: "space-002",
      patientName: "Ana Gómez",
      professional: "Dr. Patricia Sánchez",
      status: "reservado",
      date: "2025-05-01T11:00:00Z",
      totalCost: 40.0,
      startTime: "11:00",
      endTime: "12:00",
      description: "Rayos X",
    },
  ],
  indexKey: "id", // Usamos el ID como clave única para cada reserva
});

// Función para obtener todas las reservas
export async function fetchBookings(filters = {}) {
  const { patientName, spaceId, status, dateFrom, dateTo } = filters;

  return client.list((booking) => {
    let ok = true;

    // Filtros opcionales
    if (patientName) ok = ok && booking.patientName.toLowerCase().includes(patientName.toLowerCase());
    if (spaceId) ok = ok && booking.spaceId === spaceId;
    if (status) ok = ok && booking.status === status;
    if (dateFrom) ok = ok && new Date(booking.date) >= new Date(dateFrom);
    if (dateTo) ok = ok && new Date(booking.date) <= new Date(dateTo);

    return ok;
  });
}

// Función para obtener una reserva por ID
export async function getBookingById(id) {
  return client.get(id);
}

// Función para crear una nueva reserva
export async function createBooking(payload) {
  return client.create(payload);
}

// Función para actualizar una reserva existente
export async function updateBooking(id, patch) {
  return client.update(id, patch);
}

// Función para eliminar una reserva
export async function deleteBooking(id) {
  return client.remove(id);
}

// Función para obtener las reservas de un espacio específico
export async function fetchBookingsBySpace(spaceId) {
  return fetchBookings({ spaceId });
}

// Función para obtener las reservas de un paciente específico
export async function fetchBookingsByPatient(patientName) {
  return fetchBookings({ patientName });
}
