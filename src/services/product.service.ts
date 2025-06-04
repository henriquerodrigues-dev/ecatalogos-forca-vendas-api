import prisma from '../database/prismaClient';

class ProductService {
  /**
   * Listar produtos ativos com filtros opcionais e paginação.
   * Filtra produtos que não foram soft-deletados e que possuem variantes e SKUs com price_tables associados.
   * @param query - Objeto com parâmetros: page, limit, search
   */
  async list(query: any) {
    const { page = 1, limit = 10, search } = query;

    // Condição para busca (filtro por nome e descrição)
    const where = {
      deleted_at: null, // produtos não deletados
      variants: {
        some: {
          skus: {
            every: {
              price_tables_skus: { some: {} } // Garante que cada SKU tem pelo menos um price_table associado
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

    // Busca produtos com paginação e inclui relacionamentos importantes
    const products = await prisma.products.findMany({
      where,
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      include: {
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

    return products;
  }

  /**
   * Busca um produto ativo pelo ID, incluindo relacionamentos detalhados.
   * @param id - ID do produto
   */
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

  /**
   * Cria um novo produto com suas variantes e SKUs associados.
   * @param data - Dados do produto, incluindo variantes e SKUs
   */
  async create(data: any) {
    const { variants, ...productData } = data;

    // Cria o produto principal junto com suas variantes e SKUs aninhados
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

  /**
   * Atualiza um produto existente.
   * Para variantes e SKUs, a estratégia é apagar todas e recriar para simplificar.
   * @param id - ID do produto
   * @param data - Dados atualizados do produto
   */
  async update(id: number, data: any) {
    // Verifica se produto existe e não está deletado
    const productExists = await prisma.products.findFirst({
      where: { id, deleted_at: null }
    });
    if (!productExists) return null;

    const { variants, ...productData } = data;

    // Atualiza dados básicos do produto
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: productData
    });

    // Se houver variantes, apaga as antigas e cria as novas
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

  /**
   * Realiza soft delete de um produto, setando deleted_at para a data atual.
   * @param id - ID do produto
   */
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

  /**
   * Lista produtos que foram soft deletados (deleted_at != null), com paginação.
   * @param query - Parâmetros de paginação: page, limit
   */
  async listDeleted(query: any) {
    const { page = 1, limit = 10 } = query;

    return prisma.products.findMany({
      where: {
        NOT: { deleted_at: null }
      },
      skip: (page - 1) * Number(limit),
      take: Number(limit)
    });
  }

  /**
   * Busca produto soft deletado pelo ID.
   * @param id - ID do produto
   */
  async getDeleted(id: number) {
    return prisma.products.findFirst({
      where: { id, NOT: { deleted_at: null } }
    });
  }

  /**
   * Conta o total de produtos ativos com filtros opcionais.
   * @param query - Parâmetros opcionais de filtro, ex: search
   */
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
   * Busca dados para filtros com contadores para UI (ex: marcas, categorias, tipos).
   * Usa queries SQL brutas para obter contagens e agrupamentos complexos.
   */
  async filters() {
    // Função para capitalizar cada palavra
    function capitalizeWords(str: string) {
      return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

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
