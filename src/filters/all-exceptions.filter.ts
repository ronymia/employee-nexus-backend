import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { Response } from 'express';
import { TGenericErrorResponse } from '../interfaces/error';
import { Prisma } from 'generated/prisma';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType<GqlContextType>();

    // Handle GraphQL context
    if (contextType === 'graphql') {
      return this.handleGraphQLException(exception, host);
    }

    // Handle HTTP context (REST)
    return this.handleHttpException(exception, host);
  }

  // ============ HTTP EXCEPTION HANDLER ============
  private handleHttpException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const errorResponse = this.buildErrorResponse(exception);

    // Log error
    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(errorResponse.statusCode).json({
      success: false,
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  // ============ GRAPHQL EXCEPTION HANDLER ============
  private handleGraphQLException(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    const errorResponse = this.buildErrorResponse(exception);

    // Log error
    this.logger.error({
      timestamp: new Date().toISOString(),
      operation: info?.fieldName,
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // GraphQL will wrap this in its error format
    throw new HttpException(errorResponse, errorResponse.statusCode);
  }

  // ============ BUILD ERROR RESPONSE ============
  private buildErrorResponse(exception: unknown): TGenericErrorResponse {
    // 1. Handle HttpException (NestJS exceptions)
    if (exception instanceof HttpException) {
      return this.handleHttpExceptionType(exception);
    }

    // 2. Handle Prisma Errors
    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception);
    }

    // 3. Handle Generic Errors
    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || 'Internal server error',
        errors: [
          {
            path: 'server',
            message: exception.message,
          },
        ],
      };
    }

    // 4. Unknown error
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      errors: [
        {
          path: 'server',
          message: 'Unknown error',
        },
      ],
    };
  }

  // ============ HANDLE HTTP EXCEPTION ============
  private handleHttpExceptionType(
    exception: HttpException,
  ): TGenericErrorResponse {
    const status = exception.getStatus();
    const response = exception.getResponse();

    // Handle validation errors (class-validator)
    if (status === HttpStatus.BAD_REQUEST && typeof response === 'object') {
      const validationErrors = (response as any).message;

      if (Array.isArray(validationErrors)) {
        return {
          statusCode: status,
          message: 'Validation failed',
          errors: validationErrors.map((error: string) => ({
            path: 'validation',
            message: error,
          })),
        };
      }
    }

    // Standard HTTP exception
    return {
      statusCode: status,
      message:
        typeof response === 'string'
          ? response
          : (response as any).message || exception.message,
      errors: [
        {
          path: 'http',
          message:
            typeof response === 'string'
              ? response
              : (response as any).message || exception.message,
        },
      ],
    };
  }

  // ============ HANDLE PRISMA ERRORS ============
  private isPrismaError(
    exception: unknown,
  ): exception is Prisma.PrismaClientKnownRequestError {
    // Check by instance
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError
    ) {
      return true;
    }

    // Check by error message pattern (fallback for cases where instanceof doesn't work)
    if (exception instanceof Error) {
      const message = exception.message;
      return (
        message.includes('Invalid `prisma.') ||
        message.includes('Unique constraint failed') ||
        message.includes('Foreign key constraint failed') ||
        message.includes('Record to update not found') ||
        message.includes('Record to delete does not exist')
      );
    }

    return false;
  }

  private handlePrismaError(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientValidationError
      | Error,
  ): TGenericErrorResponse {
    // Known Prisma errors with error codes
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception);
    }

    // Validation errors
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database validation failed',
        errors: [
          {
            path: 'database',
            message: this.cleanPrismaMessage(exception.message),
          },
        ],
      };
    }

    // Parse error from message if it's a generic Error with Prisma message
    if (exception instanceof Error) {
      return this.parsePrismaErrorMessage(exception.message);
    }

    // Unknown Prisma errors
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error occurred',
      errors: [
        {
          path: 'database',
          message: 'An unexpected database error occurred',
        },
      ],
    };
  }

  // ============ PARSE PRISMA ERROR FROM MESSAGE ============
  private parsePrismaErrorMessage(message: string): TGenericErrorResponse {
    // Extract the actual error from the verbose Prisma message
    const cleanMessage = this.cleanPrismaMessage(message);

    // Unique constraint
    if (message.includes('Unique constraint failed')) {
      const fieldMatch = message.match(/\(`([^`]+)`.*`([^`]+)`\)/);
      const field = fieldMatch ? fieldMatch[1] : 'field';

      return {
        statusCode: HttpStatus.CONFLICT,
        message: `${field} already exists`,
        errors: [
          {
            path: field,
            message: `A record with this ${field} already exists`,
          },
        ],
      };
    }

    // Record not found
    if (
      message.includes('Record to update not found') ||
      message.includes('Record to delete does not exist')
    ) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Record not found',
        errors: [
          {
            path: 'database',
            message: 'The requested record does not exist',
          },
        ],
      };
    }

    // Foreign key constraint
    if (message.includes('Foreign key constraint failed')) {
      const fieldMatch = message.match(/on the field[s]?: `([^`]+)`/);
      const field = fieldMatch ? fieldMatch[1] : 'field';

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid reference',
        errors: [
          {
            path: field,
            message: `Referenced ${field} does not exist`,
          },
        ],
      };
    }

    // Generic Prisma error
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Database operation failed',
      errors: [
        {
          path: 'database',
          message: cleanMessage,
        },
      ],
    };
  }

  // ============ CLEAN PRISMA ERROR MESSAGE ============
  private cleanPrismaMessage(message: string): string {
    // Extract only the relevant error message, removing file paths and invocation details
    const lines = message.split('\n');

    // Find the actual error message (usually the last non-empty line)
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (
        line &&
        !line.startsWith('Invalid `') &&
        !line.includes('.ts:') &&
        !line.match(/^\d+/) &&
        !line.startsWith('→')
      ) {
        return line;
      }
    }

    return message;
  }

  // ============ HANDLE PRISMA KNOWN ERRORS ============
  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): TGenericErrorResponse {
    const target = exception.meta?.target as string[] | undefined;
    const field = target?.[0] || 'field';

    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `${field} already exists`,
          errors: [
            {
              path: field,
              message: `A record with this ${field} already exists`,
            },
          ],
        };

      case 'P2025': // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          errors: [
            {
              path: 'database',
              message: 'The requested record does not exist',
            },
          ],
        };

      case 'P2003': // Foreign key constraint failed
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference',
          errors: [
            {
              path: field,
              message: `Referenced ${field} does not exist`,
            },
          ],
        };

      case 'P2014': // Relation violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cannot delete record with existing relations',
          errors: [
            {
              path: 'database',
              message:
                'This record has related data and cannot be deleted. Remove related records first.',
            },
          ],
        };

      case 'P2000': // Value too long
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Value too long',
          errors: [
            {
              path: field,
              message: `Value for ${field} is too long`,
            },
          ],
        };

      case 'P2011': // Null constraint violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Required field missing',
          errors: [
            {
              path: field,
              message: `${field} is required`,
            },
          ],
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database operation failed',
          errors: [
            {
              path: 'database',
              message: exception.message,
            },
          ],
        };
    }
  }
}
