import { City } from './City';

export interface Supplier {
  id: string;
  name_social_reason: string;
  name_fantasy: string;
  cnpj: string;
  tel: string;
  tel2: string;
  domain: string;
  city_id: string;
  city: City;
  neighborhood: string;
  street: string;
  cep: string;
  number: string;
  complement: string;
  representative_name: string;
  mail: string;
  mail2: string;
  logo: string;
  logo_url: string;
  note: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  image_url?: string;
}
