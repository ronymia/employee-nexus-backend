import { GraphQLError, GraphQLFormattedError } from 'graphql';

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
      timestamp: new Date().toISOString(),
    },
    locations: error.locations,
    path: error.path,
  };
};
