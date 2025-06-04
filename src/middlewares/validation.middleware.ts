import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Middleware para validar DTOs usando class-validator e class-transformer.
 * 
 * @param dtoClass - Classe do DTO a ser validada
 * @returns Middleware para Express
 */
export function validateDTO(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Transforma o corpo da requisição em uma instância da classe DTO
    const dto = plainToInstance(dtoClass, req.body);

    // Valida a instância do DTO
    const errors = await validate(dto);

    if (errors.length > 0) {
      // Extrai mensagens de erro das constraints de validação
      const errorMessages = errors.flatMap(error =>
        Object.values(error.constraints || {})
      );

      // Retorna 400 Bad Request com mensagens de erro
      return res.status(400).json({ errors: errorMessages });
    }

    // Substitui o corpo da requisição pelo DTO validado (transformado)
    req.body = dto;

    // Continua para o próximo middleware ou controlador
    next();
  };
}
