/**
 * ProductDTO.ts
 * Data Transfer Object de criação/atualização de produto.
 * Define a estrutura esperada na requisição POST/PUT /products
 */

export interface VariantDTO {
  name: string;
  hex_code?: string;
  skus: SKUCreateDTO[];
}

export interface SKUCreateDTO {
  size: string;
  stock: number;
  price: number;
  code: string;
  min_quantity?: number;
  multiple_quantity: number;
  erpId?: string;
  cest?: string;
  height?: number;
  length?: number;
  ncm?: string;
  weight?: number;
  width?: number;
}

export interface ProductDTO {
  name: string;
  reference: string;
  type: 'NACIONAL' | 'IMPORTADO';
  gender: 'MASCULINO' | 'FEMININO' | 'INFANTIL' | 'JUVENIL' | 'UNISSEX' | 'FAT' | 'OUTRO';
  prompt_delivery: boolean;
  company_id: number;
  brand_id: number;
  category_id: number;
  subcategory_id?: number;
  description?: string;
  erp_id?: string;
  deadline_id?: number;
  composition_data?: string;
  technical_information?: string;
  open_grid?: boolean;
  ipi?: number;
  is_discontinued?: boolean;
  is_launch?: boolean;
  is_visible?: boolean;
  colection?: string;
  st?: number;
  variants: VariantDTO[];
}