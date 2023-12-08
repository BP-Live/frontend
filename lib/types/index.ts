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
  location: string;
}

export interface Location {
  lat: number;
  lng: number;
}
