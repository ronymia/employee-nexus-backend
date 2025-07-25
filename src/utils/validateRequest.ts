import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

// You can inject this via class instead of using this way
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET || 'your_jwt_secret',
});

export function validateRequest(request: Request): boolean {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing or invalid token');
  }

  const token = authHeader.split(' ')[1];

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = jwtService.verify(token); // throws if invalid or expired
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    request.user = payload; // attach user to request
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
