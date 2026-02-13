/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

interface IStandardErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  path: string;
}

export const graphqlErrorFormatter = (
  error: GraphQLError,
  formatErrorOptions?: any,
): GraphQLFormattedError => {
  console.log({ error, formatErrorOptions });
  if (!error.extensions?.success && error.extensions?.statusCode === 409) {
    // If the error already has our standard format, return it as is
    return {
      message: error.message,
      extensions: {
        success: error.extensions?.success || false,
        statusCode: error.extensions?.statusCode || 500,
        errors: error.extensions?.errors,
        path: error.extensions?.path,
      },
    };
  }
  const originalError = error.extensions?.originalError as any;
  // console.log({
  //   originalError,
  //   extensions: error.extensions,
  //   error: error.message,
  // });

  // Extract status code
  const statusCode = getStatusCode(error, originalError);

  // Extract message
  // const message =
  //   error.message || originalError?.message || 'Internal server error';

  // Extract validation errors if present
  const fieldErrors = extractFieldErrors(error, originalError);

  const standardResponse: IStandardErrorResponse = {
    success: false,
    statusCode,
    message: getMainErrorMessage(error, fieldErrors),
    errors: fieldErrors,
    path: error.path?.join('.') || 'graphql',
  };
  // console.log({ errors: fieldErrors });
  return {
    message: standardResponse.message,
    extensions: {
      success: standardResponse.success,
      statusCode: standardResponse.statusCode,
      errors: standardResponse.errors,
      path: standardResponse.path,
    },
    locations: error.locations,
    path: error.path,
  };
};

function getStatusCode(error: GraphQLError, originalError: any): number {
  // Check for validation errors
  if (
    error.extensions?.code === 'BAD_USER_INPUT' ||
    error.message.includes('Expected non-nullable type') ||
    error.message.includes('Variable')
  ) {
    return 422; // Unprocessable Entity for validation errors
  }

  return (
    error.extensions?.statusCode ||
    originalError?.statusCode ||
    (error.extensions?.code === 'UNAUTHENTICATED' ? 401 : 500)
  );
}

function extractFieldErrors(
  error: GraphQLError,
  originalError: any,
): Array<{ field: string; message: string }> | undefined {
  // Handle GraphQL validation errors
  if (
    error.extensions?.code === 'BAD_USER_INPUT' &&
    error.message.includes('Variable')
  ) {
    const fieldMatch = error.message.match(/"([^"]+)"/g);
    if (fieldMatch && fieldMatch.length >= 2) {
      // const variableName = fieldMatch[0].replace(/"/g, '');
      const fieldPath = fieldMatch[1].replace(/"/g, '');

      // Extract field name from path like "requestAttendanceInput.punchRecords[0].projectId"
      const field = fieldPath.split('.').slice(1).join('.');

      return [
        {
          field: field || fieldPath,
          message: error.message,
        },
      ];
    }
  }

  // Handle original error validation errors
  if (originalError?.errors) {
    return originalError.errors.map((err: any) => ({
      field: err.path || 'unknown',
      message: err.message || 'Validation error',
    }));
  }

  return undefined;
}

function getMainErrorMessage(
  error: GraphQLError,
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

    // Create dynamic message based on number of fields
    if (fieldNames.length === 1) {
      return `${fieldNames[0]} is required`;
    } else {
      const lastField = fieldNames.pop();
      return `${fieldNames.join(', ')} and ${lastField} are required`;
    }
  }

  return error.message || 'Internal server error';
}
