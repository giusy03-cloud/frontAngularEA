export interface Booking {
  id: number;          // UUID o stringa
  userId: string;
  eventId: string;
  bookingTime: string;        // o Date/Time, secondo come salvi nel backend
}
