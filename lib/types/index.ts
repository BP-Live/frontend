export interface RestaurantJson {
  progress?: number;
  metadata?: Metadata;
  pros?: string[];
  cons?: string[];
  competitors?: Location[];
}

export interface Metadata {
  type: string;
  name: string;
  location: { lat: number; lng: number };
}

export interface Location {
  lat: number;
  lng: number;
  distance: number;
  location: number;
}
