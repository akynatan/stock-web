import { City } from './City';

export interface Client {
  id: string;
  name: string;
  document: string;
  tel: string;
  tel2: string;
  city_id: string;
  city: City;
  neighborhood: string;
  street: string;
  cep: string;
  number: string;
  complement: string;
  mail: string;
  note: string;
  created_at: Date;
  updated_at: Date;
  image_url?: string;
}
