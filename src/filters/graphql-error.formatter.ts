import { GraphQLError, GraphQLFormattedError } from 'graphql';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const graphqlErrorFormatter = (
  error: GraphQLError,
): GraphQLFormattedError => {
  const originalError = error.extensions?.originalError as any;

  // Extract status code
  const statusCode =
    error.extensions?.statusCode ||
    originalError?.statusCode ||
    error.extensions?.code ||
    500;

  // Extract message
  const message =
    error.message || originalError?.message || 'Internal server error';

  // Extract validation errors if present
  const errors = originalError?.errors || [
    {
      path: error.path?.join('.') || 'graphql',
      message: message,
    },
  ];

  return {
    message,
    extensions: {
      statusCode,
      code: error.extensions?.code,
      errors,
      timestamp: dayjs.utc().toISOString(),
    },
    locations: error.locations,
    path: error.path,
  };
};
