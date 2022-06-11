import { Brand } from './Brand';
import { Category } from './Category';
import { Manufacturer } from './Manufacturer';
import { Model } from './Model';

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  brand_id?: string;
  brand?: Brand;
  model_id?: string;
  model?: Model;
  category_id?: string;
  category?: Category;
  manufacturer_id?: string;
  manufacturer?: Manufacturer;
  image?: string;
  image_url?: string;
  measure_unit: string;
  created_at: Date;
  updated_at: Date;
}
