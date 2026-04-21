export interface StockMovement {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  stock_after: number;
  reason: string;
  supplier_id?: string;
  client_id?: string;
  created_at: Date;
}
