import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
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

/** DTO para criação/atualização de SKU */
export class SKUCreateDTO {
  @IsOptional()
  id?: number; // ID para atualização, opcional na criação

  @IsString()
  @IsNotEmpty()
  size: string; // Tamanho (ex: P, M, G)

  @IsNumber()
  stock: number; // Quantidade em estoque

  @IsNumber()
  price: number; // Preço

  @IsString()
  @IsNotEmpty()
  code: string; // Código único do SKU

  @IsOptional()
  @IsNumber()
  min_quantity?: number; // Quantidade mínima para compra (opcional)

  @IsNumber()
  multiple_quantity: number; // Quantidade múltipla para compra
}

/** DTO para variantes do produto (ex: cores, estilos) */
export class VariantDTO {
  @IsOptional()
  id?: number; // ID para atualização, opcional

  @IsString()
  @IsNotEmpty()
  name: string; // Nome da variante

  @IsOptional()
  hex_code?: string; // Código hexadecimal da cor (opcional)

  @ValidateNested({ each: true })
  @Type(() => SKUCreateDTO)
  skus: SKUCreateDTO[]; // Lista de SKUs da variante
}

/** DTO principal para criação/atualização de produto */
export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string; // Nome do produto

  @IsString()
  @IsNotEmpty()
  reference: string; // Referência interna ou SKU global

  @IsEnum(ProductType)
  type: ProductType; // Tipo do produto

  @IsEnum(ProductGender)
  gender: ProductGender; // Gênero do produto

  @IsNotEmpty()
  prompt_delivery: boolean; // Indica entrega rápida

  @IsNumber()
  company_id: number; // Empresa dona do produto

  @IsNumber()
  brand_id: number; // Marca do produto

  @IsNumber()
  category_id: number; // Categoria

  @IsOptional()
  subcategory_id?: number; // Subcategoria (opcional)

  @ValidateNested({ each: true })
  @Type(() => VariantDTO)
  variants: VariantDTO[]; // Variantes do produto
}
