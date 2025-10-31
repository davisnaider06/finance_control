// Este ficheiro permite-nos adicionar propriedades customizadas ao objeto Request do Express
// de forma segura com o TypeScript.

// Importamos o tipo original do Express
import { Request } from 'express';

// Declaramos uma nova interface que estende a original
declare global {
  namespace Express {
    export interface Request {
      // Adicionamos a propriedade 'userId', que será um número.
      // O '?' torna-a opcional, pois nem todas as requests terão um userId.
      userId?: number;
      user?: JwtPayload & { id: number };
    }
  }
}

