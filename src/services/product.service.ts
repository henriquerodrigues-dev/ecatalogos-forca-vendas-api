import prisma from '../database/prismaClient';
import { getPaginationParams } from '../utils/pagination';
import { capitalizeWords } from '../utils/capitalize';

class ProductService {
  /**
   * Lista produtos ativos com paginação, filtro de busca e variantes com SKUs e price tables.
   * Filtra variantes que possuem SKUs com price tables consistentes.
   */
  async list(query: any) {
    const { page = 1, limit = 10, search } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where = {
      deleted_at: null,
      variants: {
        some: {
          skus: {
            every: {
              price_tables_skus: { some: {} }
            }
          }
        }
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const products = await prisma.products.findMany({
      where,
      skip,
      take,
      include: {
        brands: true,
        categories: true,
        subcategories: true,
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: {
                  include: {
                    price_tables: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Filtra variantes garantindo SKUs com price_tables_skus consistentes
    const filteredProducts = products
      .map(product => {
        const filteredVariants = product.variants.filter(variant => {
          const skuTables = variant.skus.map(sku =>
            sku.price_tables_skus.map(pt => pt.price_table_id).sort()
          );
          const first = JSON.stringify(skuTables[0]);
          const allSame = skuTables.every(tables => JSON.stringify(tables) === first);
          return allSame && skuTables[0]?.length > 0;
        });

        return {
          ...product,
          variants: filteredVariants
        };
      })
      .filter(product => product.variants.length > 0);

    return filteredProducts;
  }

  /** Lista produtos soft deletados com paginação */
  async listDeleted(query: any) {
    const { page = 1, limit = 10 } = query;
    const { skip, take } = getPaginationParams(page, limit);

    return prisma.products.findMany({
      where: { NOT: { deleted_at: null } },
      skip,
      take
    });
  }

  /** Busca produto ativo pelo ID */
  async get(id: number) {
    if (!id) throw new Error('ID do produto é obrigatório');

    return prisma.products.findFirst({
      where: { id, deleted_at: null },
      include: {
        brands: true,
        categories: true,
        subcategories: true,
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: { include: { price_tables: true } }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Cria um novo produto com suas variantes e SKUs.
   * Atenção: company_id deve existir na tabela companies devido à restrição de chave estrangeira.
   * Caso a empresa não exista, a operação falhará no banco.
   */
  async create(data: any) {
    const { variants = [], company_id, brand_id, ...productData } = data;

    // Valida se company_id é um número válido e positivo
    if (!company_id || typeof company_id !== 'number' || company_id <= 0) {
      throw new Error('company_id inválido ou ausente. Deve existir na tabela companies.');
    }

    // Cria o produto no banco junto com variantes e SKUs em nested create
    // OBS: Se company_id não existir na tabela companies, o banco irá retornar erro de FK
    return prisma.products.create({
      data: {
        reference: productData.reference,
        name: productData.name,
        description: productData.description || null,
        type: productData.type,
        gender: productData.gender,
        prompt_delivery: productData.prompt_delivery,
        company_id,          // chave estrangeira obrigatória (deve existir no banco)
        brand_id,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id || null,
        erp_id: productData.erp_id || null,
        deadline_id: productData.deadline_id || null,
        variants: {
          create: variants.map((variant: any) => ({
            name: variant.name,
            hex_code: variant.hex_code,
            skus: {
              create: variant.skus.map((sku: any) => ({
                size: sku.size,
                stock: sku.stock,
                price: sku.price,
                code: sku.code,
                min_quantity: sku.min_quantity || 1,
                multiple_quantity: sku.multiple_quantity || 1,
                erpId: sku.erpId || null,
                cest: sku.cest || null,
                ncm: sku.ncm || null,
                height: sku.height || null,
                length: sku.length || null,
                weight: sku.weight || null,
                width: sku.width || null,
              })),
            },
          })),
        },
      },
      include: {
        variants: {
          include: {
            skus: true,
          },
        },
      },
    });
  }

  /** Atualiza produto e suas variantes (substitui variantes atuais) */
  async update(id: number, data: any) {
    const productExists = await prisma.products.findFirst({
      where: { id, deleted_at: null }
    });
    if (!productExists) return null;

    const { variants, ...productData } = data;

    const updatedProduct = await prisma.products.update({
      where: { id },
      data: productData
    });

    if (variants) {
      // Remove variantes antigas
      await prisma.variants.deleteMany({ where: { product_id: id } });

      // Cria variantes novas
      for (const variant of variants) {
        await prisma.variants.create({
          data: {
            name: variant.name,
            hex_code: variant.hex_code,
            product_id: id,
            skus: {
              create: variant.skus.map((sku: any) => ({ ...sku }))
            }
          }
        });
      }
    }

    return updatedProduct;
  }

  /** Marca produto como deletado (soft delete) */
  async softDelete(id: number) {
    const productExists = await prisma.products.findFirst({
      where: { id, deleted_at: null }
    });
    if (!productExists) return null;

    await prisma.products.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    return true;
  }

  /** Busca produto soft deletado pelo ID */
  async getDeleted(id: number) {
    return prisma.products.findFirst({
      where: { id, NOT: { deleted_at: null } }
    });
  }

  /** Conta produtos ativos com filtro de busca */
  async count(query: any = {}) {
    const { search } = query;

    const where = {
      deleted_at: null,
      variants: {
        some: {
          skus: {
            every: {
              price_tables_skus: { some: {} }
            }
          }
        }
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    return prisma.products.count({ where });
  }

  /**
   * Retorna dados agregados para filtros da UI:
   * - marcas, categorias (com subcategorias), tipos, gêneros e prompt_delivery
   */
  async filters() {
    const brandsRaw = await prisma.$queryRaw<any[]>`
      SELECT 
        b.id, 
        b.name, 
        COUNT(p.id) as quantity
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id AND p.deleted_at IS NULL
      GROUP BY b.id, b.name
    `;

    const brands = brandsRaw.map(b => ({
      id: b.id,
      name: capitalizeWords(b.name),
      quantity: Number(b.quantity)
    }));

    const rawCategories = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        c.id,
        c.name,
        COUNT(p.id) as quantity,
        (
          SELECT 
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', sub.id,
                'name', sub.name,
                'quantity', sub.quantity
              )
            )
          FROM (
            SELECT 
              sc.id,
              sc.name,
              COUNT(scp.id) as quantity
            FROM subcategories sc
            LEFT JOIN products scp ON sc.id = scp.subcategory_id AND scp.deleted_at IS NULL
            WHERE sc.category_id = c.id
            GROUP BY sc.id, sc.name
          ) AS sub
        ) as subcategories
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
      GROUP BY c.id, c.name
    `);

    const categories = rawCategories.map((cat: any) => ({
      name: capitalizeWords(cat.name),
      quantity: Number(cat.quantity),
      subcategories: typeof cat.subcategories === 'string'
        ? JSON.parse(cat.subcategories).map((sub: any) => ({
            name: capitalizeWords(sub.name),
            quantity: Number(sub.quantity)
          }))
        : []
    }));

    const typesRaw = await prisma.products.groupBy({
      by: ['type'],
      where: { deleted_at: null },
      _count: { _all: true }
    });
    const types = typesRaw.map(t => ({
      name: capitalizeWords(t.type),
      quantity: Number(t._count._all)
    }));

    const gendersRaw = await prisma.products.groupBy({
      by: ['gender'],
      where: { deleted_at: null },
      _count: { _all: true }
    });
    const genders = gendersRaw.map(g => ({
      name: capitalizeWords(g.gender ?? ''),
      quantity: Number(g._count._all)
    }));

    const promptDelivery = {
      true: Number(await prisma.products.count({ where: { prompt_delivery: true, deleted_at: null } })),
      false: Number(await prisma.products.count({ where: { prompt_delivery: false, deleted_at: null } }))
    };

    return {
      brands,
      categories,
      types,
      genders,
      promptDelivery
    };
  }
}

export default new ProductService();
