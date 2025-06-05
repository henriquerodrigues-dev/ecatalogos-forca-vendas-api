import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

/** Tipos possíveis de produto */
export enum ProductType {
  NACIONAL = 'NACIONAL',
  IMPORTADO = 'IMPORTADO'
}

/** Gêneros possíveis para o produto */
export enum ProductGender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  INFANTIL = 'INFANTIL',
  JUVENIL = 'JUVENIL',
  UNISSEX = 'UNISSEX',
  FAT = 'FAT',
  OUTRO = 'OUTRO'
}

/** DTO para criação de SKU */
export class SKUCreateDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  stock: number;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsNumber()
  min_quantity?: number;

  @IsNumber()
  multiple_quantity: number;

  // Campos opcionais adicionais
  @IsOptional()
  @IsString()
  erpId?: string;

  @IsOptional()
  @IsString()
  cest?: string;

  @IsOptional()
  @IsString()
  ncm?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  width?: number;
}

/** DTO para variantes do produto */
export class VariantDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  hex_code?: string;

  @ValidateNested({ each: true })
  @Type(() => SKUCreateDTO)
  skus: SKUCreateDTO[];
}

/** DTO principal para criação de produto */
export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsEnum(ProductGender)
  gender: ProductGender;

  @IsBoolean()
  prompt_delivery: boolean;

  @IsOptional()
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsString()
  erp_id?: string;

  @IsOptional()
  @IsNumber()
  deadline_id?: number;

  @IsNumber()
  brand_id: number;

  @IsNumber()
  category_id: number;

  @IsOptional()
  @IsNumber()
  subcategory_id?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => VariantDTO)
  variants: VariantDTO[];
}
