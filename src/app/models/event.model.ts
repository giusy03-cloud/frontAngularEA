export interface Event {
  id?: number;  // opzionale in creazione
  name: string;
  description?: string;
  startDate: string; // LocalDateTime come ISO stringa, es. "2025-07-10T12:00:00"
  endDate: string;
  location: string;
  organizerId: number;
  price?: number;
  capacity?: number;
  status: string; // o usa enum EventStatus se definito in frontend
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}
