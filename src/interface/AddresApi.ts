export interface GooglePlaceDetailsResponse {
  result: {
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    address_components: AddressComponent[];
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}