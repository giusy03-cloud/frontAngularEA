export interface Review {
  id?: number;          // optional per creazione
  eventId: number;
  userId: number;
  rating: number;
  comment: string;
}
