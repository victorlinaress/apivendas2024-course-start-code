import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/erros/app-erros'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return res.status((err as AppError).statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
