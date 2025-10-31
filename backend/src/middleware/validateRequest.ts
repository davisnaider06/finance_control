import { Request, Response, NextFunction } from 'express';
// MUDANÇA: Importar 'z' e 'ZodError' explicitamente
import { z, ZodError } from 'zod';

/**
 * Middleware para validar a requisição (body, params, query)
 * usando um schema Zod.
 */
export const validateRequest =
  // MUDANÇA: Usar 'z.ZodObject<any>' em vez de 'z.AnyZodObject'
  (schema: z.ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse e valida
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      return next();
    } catch (error) { // 'error' é do tipo 'unknown'
      
      // Se a validação falhar (ZodError)
      if (error instanceof ZodError) {
        // MUDANÇA 2: 'ZodError' não tem '.errors'. 
        // Usamos '.flatten().fieldErrors' para formatar a resposta.
        return res.status(400).json({
          message: 'Erro de validação',
          errors: error.flatten().fieldErrors,
        });
      }
      
      // Outros erros
      console.error('Erro inesperado no middleware de validação:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };

