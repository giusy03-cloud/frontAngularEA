export interface Booking {
  id?: number;         // opzionale se può mancare
  userId: number;
  eventId: number;
  bookingTime?: string;
}
