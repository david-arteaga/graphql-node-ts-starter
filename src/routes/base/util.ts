import { RequestHandler, Request, Response, NextFunction } from "express";

export const catch_async = (handler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next)
    } catch (e) {
      res.sendStatus(500)
    }
  }
