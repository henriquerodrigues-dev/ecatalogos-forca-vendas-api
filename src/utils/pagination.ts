/**
 * Calcula os parâmetros de paginação para consultas no banco de dados.
 * 
 * @param page - Número da página atual (padrão: 1)
 * @param limit - Quantidade de itens por página (padrão: 10)
 * @returns Objeto com `skip` (itens a pular) e `take` (itens a pegar)
 */
export function getPaginationParams(page = 1, limit = 10) {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  return { skip, take };
}