import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enumeração para tipos de produto
 */
export enum ProductType {
  NACIONAL = 'NACIONAL',
  IMPORTADO = 'IMPORTADO'
}

/**
 * Enumeração para gêneros de produto
 */
export enum ProductGender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  INFANTIL = 'INFANTIL',
  JUVENIL = 'JUVENIL',
  UNISSEX = 'UNISSEX',
  FAT = 'FAT',
  OUTRO = 'OUTRO'
}

/**
 * DTO para criação/atualização de SKUs
 */
export class SKUCreateDTO {
  @IsOptional()
  id?: number; // Usado para atualização, pode estar ausente na criação

  @IsString()
  @IsNotEmpty()
  size: string; // Tamanho do SKU (ex: P, M, G)

  @IsNumber()
  stock: number; // Quantidade em estoque

  @IsNumber()
  price: number; // Preço do SKU

  @IsString()
  @IsNotEmpty()
  code: string; // Código SKU único

  @IsOptional()
  @IsNumber()
  min_quantity?: number; // Quantidade mínima para compra (opcional)

  @IsNumber()
  multiple_quantity: number; // Múltiplo de quantidade (ex: 1, 5, 10)

  // Pode adicionar mais campos conforme necessidade
}

/**
 * DTO para variantes de produtos (ex: cores, estilos)
 */
export class VariantDTO {
  @IsOptional()
  id?: number; // Para atualização, opcional

  @IsString()
  @IsNotEmpty()
  name: string; // Nome da variante (ex: Vermelho, Azul)

  @IsOptional()
  hex_code?: string; // Código hexadecimal da cor (opcional)

  @ValidateNested({ each: true })
  @Type(() => SKUCreateDTO)
  skus: SKUCreateDTO[]; // Lista de SKUs para esta variante
}

/**
 * DTO principal para criação/atualização de produtos
 */
export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string; // Nome do produto

  @IsString()
  @IsNotEmpty()
  reference: string; // Referência do produto (SKU global, código interno)

  @IsEnum(ProductType)
  type: ProductType; // Tipo do produto (nacional/importado)

  @IsEnum(ProductGender)
  gender: ProductGender; // Gênero do produto

  @IsNotEmpty()
  prompt_delivery: boolean; // Indica se tem entrega rápida (true/false)

  @IsNumber()
  company_id: number; // ID da empresa dona do produto

  @IsNumber()
  brand_id: number; // ID da marca

  @IsNumber()
  category_id: number; // ID da categoria

  @IsOptional()
  subcategory_id?: number; // ID da subcategoria (opcional)

  // Pode adicionar outros campos com validações conforme necessário

  @ValidateNested({ each: true })
  @Type(() => VariantDTO)
  variants: VariantDTO[]; // Lista de variantes do produto
}
