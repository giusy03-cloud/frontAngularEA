export interface FavoriteList {
  id?: number;
  name: string;
  userId: number;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  capabilityToken?: string;
  items?: FavoriteListItem[];
}

export interface FavoriteListItem {
  id?: number;
  eventId: number;
}
