import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Middleware para validar dados do corpo da requisição contra um DTO.
 * Usa class-transformer para converter e class-validator para validar.
 * 
 * @param dtoClass - Classe do DTO para validação
 * @returns Middleware Express
 */
export function validateDTO(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Converte req.body em instância do DTO
    const dto = plainToInstance(dtoClass, req.body);

    // Valida a instância
    const errors = await validate(dto);

    if (errors.length > 0) {
      // Extrai mensagens das falhas de validação
      const errorMessages = errors.flatMap(error =>
        Object.values(error.constraints || {})
      );

      return res.status(400).json({ errors: errorMessages });
    }

    // Sobrescreve o corpo da requisição com o DTO validado
    req.body = dto;

    next();
  };
}
