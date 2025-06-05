import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Recursivamente extrai mensagens de erro do class-validator
 */
function extractErrors(errors: any[]): string[] {
  return errors.flatMap(error => {
    const constraints = Object.values(error.constraints || {});
    const childrenErrors = error.children ? extractErrors(error.children) : [];
    return [...constraints, ...childrenErrors];
  });
}

/**
 * Middleware para validar dados do corpo da requisição contra um DTO.
 */
export function validateDTO(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);

    const errors = await validate(dto, {
      whitelist: true,               // remove propriedades extras
      forbidNonWhitelisted: true,   // gera erro se encontrar propriedades não listadas
      forbidUnknownValues: true,    // previne objetos inválidos
      validationError: { target: false } // evita retornar o DTO no erro
    });

    if (errors.length > 0) {
      const errorMessages = extractErrors(errors);
      return res.status(400).json({ errors: errorMessages });
    }

    req.body = dto;
    next();
  };
}
