export interface RestaurantJson {
  progress?: number;
  metadata?: Metadata;
  pros?: string[];
  cons?: string[];
  competitors?: Location[];
  premises?: Premise[];
}

export interface Premise {
  lat: number;
  lng: number;
  adress: string;
  area: number;
}

export interface Metadata {
  type: string;
  name: string;
  location: { lat: number; lng: number };
  location_name: string;
}

export interface Location {
  lat: number;
  lng: number;
  distance: number;
  location: number;
}

export type BusinessHeatmap = {
  [key: string]: [[number, number, string, number]];
};

export type BusinessCategories = {
  id: string;
  category: string;
};
