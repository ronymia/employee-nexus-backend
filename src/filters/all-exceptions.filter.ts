/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

interface IStandardErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const isHttp = host.getType() === 'http';
    const status = this.getStatusCode(exception);
    const fieldErrors = this.getFieldErrors(exception);

    const errorResponse: IStandardErrorResponse = {
      success: false,
      statusCode: status,
      message: this.getErrorMessage(exception, fieldErrors),
      errors: fieldErrors,
      path: isHttp ? request?.url : gqlHost.getInfo()?.fieldName || 'graphql',
    };

    // Log error for debugging
    console.error('Exception caught:', {
      type: exception?.constructor?.name,
      message: errorResponse.message,
      statusCode: status,
      path: errorResponse.path,
      errors: fieldErrors,
    });

    throw new GraphQLError(errorResponse.message, {
      extensions: {
        success: errorResponse.success,
        statusCode: errorResponse.statusCode,
        errors: errorResponse.errors,
        path: errorResponse.path,
      },
    });
  }

  private getErrorMessage(
    exception: unknown,
    fieldErrors?: Array<{ field: string; message: string }>,
  ): string {
    if (fieldErrors && fieldErrors.length > 0) {
      // Extract field names dynamically and create human-readable message
      const fieldNames = fieldErrors.map((err) => {
        let field = err.field;

        // Extract field name from array notation like "punchRecords[0].projectId"
        if (field.includes('[') && field.includes(']')) {
          field = field.split('.').pop() || field;
        }

        // Remove 'Id' suffix and convert camelCase to readable text
        if (field.endsWith('Id')) {
          field = field.replace(/Id$/, '');
        }

        // Convert camelCase to readable format
        const readableField = field
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase()
          .trim();

        return readableField;
      });

      // Determine message type based on error
      const isRequiredError = fieldErrors.some(
        (err) =>
          err.message.includes('Expected non-nullable type') ||
          err.message.includes('required'),
      );
      const isExistsError = fieldErrors.some((err) =>
        err.message.includes('already exists'),
      );

      // Create dynamic message based on error type and number of fields
      if (fieldNames.length === 1) {
        if (isRequiredError) {
          return `${fieldNames[0]} is required`;
        } else if (isExistsError) {
          return `${fieldNames[0]} already exists`;
        }
        return `${fieldNames[0]} is invalid`;
      } else {
        const lastField = fieldNames.pop();
        if (isRequiredError) {
          return `${fieldNames.join(', ')} and ${lastField} are required`;
        } else if (isExistsError) {
          return `${fieldNames.join(', ')} and ${lastField} already exist`;
        }
        return `${fieldNames.join(', ')} and ${lastField} are invalid`;
      }
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : response['message'] || 'An error occurred';
    }
    return 'Internal server error';
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    // Handle GraphQL validation errors
    if (exception && typeof exception === 'object' && 'message' in exception) {
      const errorMessage = (exception as any).message;
      if (errorMessage && errorMessage.includes('Expected non-nullable type')) {
        return HttpStatus.UNPROCESSABLE_ENTITY; // 422 for validation errors
      }
    }

    // Handle Prisma errors
    if (exception && typeof exception === 'object' && 'code' in exception) {
      const prismaError = exception as any;
      switch (prismaError.code) {
        case 'P2002':
          return HttpStatus.CONFLICT; // Unique constraint
        case 'P2025':
          return HttpStatus.NOT_FOUND; // Record not found
        case 'P2003':
          return HttpStatus.BAD_REQUEST; // Foreign key constraint
        default:
          return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getFieldErrors(
    exception: unknown,
  ): Array<{ field: string; message: string }> | undefined {
    // Handle GraphQL validation errors
    if (exception && typeof exception === 'object' && 'message' in exception) {
      const errorMessage = (exception as any).message;
      if (errorMessage && errorMessage.includes('Expected non-nullable type')) {
        const fieldMatch = errorMessage.match(/"([^"]+)"/g);
        if (fieldMatch && fieldMatch.length >= 2) {
          const fieldPath = fieldMatch[1].replace(/"/g, '');
          const field = fieldPath.split('.').slice(1).join('.');

          return [
            {
              field: field || fieldPath,
              message: errorMessage,
            },
          ];
        }
      }
    }

    // Handle HTTP Exception validation errors
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (
        typeof response === 'object' &&
        response['message'] instanceof Array
      ) {
        return response['message'].map((msg: any) => ({
          field: msg.property || 'unknown',
          message: msg.constraints
            ? Object.values(msg.constraints).join(', ')
            : msg,
        }));
      }
    }

    // Handle Prisma errors
    if (exception && typeof exception === 'object' && 'code' in exception) {
      const prismaError = exception as any;
      switch (prismaError.code) {
        case 'P2002':
          return [
            {
              field: prismaError.meta?.target?.[0] || 'unknown',
              message: 'This value already exists',
            },
          ];
        case 'P2025':
          return [
            {
              field: 'id',
              message: 'Record not found',
            },
          ];
        case 'P2003':
          return [
            {
              field: prismaError.meta?.field_name || 'unknown',
              message: 'Invalid reference to related record',
            },
          ];
      }
    }

    return undefined;
  }
}
