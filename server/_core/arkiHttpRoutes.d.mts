import type { Express, Request, Response } from 'express';
export function registerArkiStorageRoutes(
  app: Express,
  options: {
    storage: any;
    getAuthenticatedUser: (
      req: Request,
      res: Response
    ) => Promise<any>;
    enabled?: boolean;
  }
): void;
