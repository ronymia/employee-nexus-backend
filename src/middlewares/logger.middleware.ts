import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new ConsoleLogger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    // this.logger.log('Request...', req.headers);
    this.logger.log('token', req.headers['authorization']);
    next();
  }
}
