import prisma from '../database/prismaClient';
import { getPaginationParams } from '../utils/pagination';
import { capitalizeWords } from '../utils/capitalize';

class ProductService {
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

  async listDeleted(query: any) {
    const { page = 1, limit = 10 } = query;
    const { skip, take } = getPaginationParams(page, limit);

    return prisma.products.findMany({
      where: {
        NOT: { deleted_at: null }
      },
      skip,
      take
    });
  }

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
                price_tables_skus: {
                  include: { price_tables: true }
                }
              }
            }
          }
        }
      }
    });
  }

  async create(data: any) {
    const { variants, ...productData } = data;

    const createdProduct = await prisma.products.create({
      data: {
        ...productData,
        variants: {
          create: variants?.map((variant: any) => ({
            name: variant.name,
            hex_code: variant.hex_code,
            skus: {
              create: variant.skus.map((sku: any) => ({
                ...sku
              }))
            }
          })) || []
        }
      }
    });

    return createdProduct;
  }

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
      await prisma.variants.deleteMany({ where: { product_id: id } });

      for (const variant of variants) {
        await prisma.variants.create({
          data: {
            name: variant.name,
            hex_code: variant.hex_code,
            product_id: id,
            skus: {
              create: variant.skus.map((sku: any) => ({
                ...sku
              }))
            }
          }
        });
      }
    }

    return updatedProduct;
  }

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

  async getDeleted(id: number) {
    return prisma.products.findFirst({
      where: { id, NOT: { deleted_at: null } }
    });
  }

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

  async filters() {
    const brandsRaw = await prisma.$queryRaw<any[]>`
      SELECT 
        b.id, 
        b.name, 
        COUNT(p.id) as quantity
      FROM 
        brands b
      LEFT JOIN 
        products p ON b.id = p.brand_id AND p.deleted_at IS NULL
      GROUP BY 
        b.id, b.name
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
            FROM 
              subcategories sc
            LEFT JOIN 
              products scp ON sc.id = scp.subcategory_id AND scp.deleted_at IS NULL
            WHERE 
              sc.category_id = c.id
            GROUP BY 
              sc.id, sc.name
          ) AS sub
        ) as subcategories
      FROM 
        categories c
      LEFT JOIN 
        products p ON c.id = p.category_id AND p.deleted_at IS NULL
      GROUP BY 
        c.id, c.name
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
