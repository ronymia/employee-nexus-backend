# GraphQL PubSub Implementation Plan

## Objective

Implement GraphQL subscriptions using `graphql-ws` to enable real-time communication in the Employee Nexus backend.

---

## Steps to Implement

### 1. Install Required Dependencies

- Ensure `graphql-ws` is installed (already completed).
- Verify `@nestjs/graphql` and `@nestjs/platform-socket.io` are installed.

### 2. Configure WebSocket Server

- Update `src/app.module.ts` to configure the WebSocket server for GraphQL subscriptions.
- Use `GraphQLModule.forRoot` with `subscriptions` configuration:
  ```typescript
  GraphQLModule.forRoot({
    subscriptions: {
      'graphql-ws': true,
    },
  });
  ```

### 3. Create PubSub Service

- Add a `PubSubService` to manage event publishing and subscriptions.
- Use `graphql-subscriptions`'s `PubSub` class:

  ```typescript
  import { Injectable } from '@nestjs/common';
  import { PubSub } from 'graphql-subscriptions';

  @Injectable()
  export class PubSubService {
    private pubSub = new PubSub();

    async publish(triggerName: string, payload: any) {
      await this.pubSub.publish(triggerName, payload);
    }

    async subscribe(triggerName: string) {
      return this.pubSub.asyncIterator(triggerName);
    }
  }
  ```

### 4. Add Subscription Resolvers

- Define subscription resolvers in the appropriate module (e.g., `designations.resolver.ts`).
- Example:

  ```typescript
  @Resolver()
  export class DesignationsResolver {
    constructor(private readonly pubSubService: PubSubService) {}

    @Subscription(() => Designation, {
      filter: (payload, variables) =>
        payload.businessId === variables.businessId,
    })
    designationAdded(@Args('businessId') businessId: string) {
      return this.pubSubService.subscribe('designationAdded');
    }
  }
  ```

### 5. Publish Events

- Publish events in the service layer (e.g., `designations.service.ts`) when a relevant action occurs.
- Example:
  ```typescript
  async createDesignation(createDesignationDto: CreateDesignationDto) {
    const designation = await this.prisma.designation.create({ data: createDesignationDto });
    await this.pubSubService.publish('designationAdded', { designationAdded: designation });
    return designation;
  }
  ```

### 6. Test Subscriptions

- Use GraphQL Playground or a WebSocket client to test subscriptions.
- Example subscription query:
  ```graphql
  subscription OnDesignationAdded($businessId: String!) {
    designationAdded(businessId: $businessId) {
      id
      name
    }
  }
  ```

---

## Additional Notes

- Ensure proper authentication for WebSocket connections.
- Use `@RequirePermissions` guards to secure subscription resolvers.
- Monitor WebSocket connections for performance and scalability.

---

## Next Steps

1. Implement the `PubSubService`.
2. Add subscription resolvers for key modules (e.g., `designations`, `payroll`).
3. Test end-to-end functionality with a WebSocket client.

---

## Frontend Implementation

### 1. Install Required Dependencies

- Install `graphql-ws` for WebSocket communication:
  ```bash
  yarn add graphql-ws
  ```
- Ensure `@apollo/client` is installed for GraphQL operations.

### 2. Configure WebSocket Link

- Create a WebSocket link using `graphql-ws`:

  ```typescript
  import { createClient } from 'graphql-ws';
  import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
  import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
  import { getMainDefinition } from '@apollo/client/utilities';

  const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });

  const wsLink = new GraphQLWsLink(
    createClient({ url: 'ws://localhost:3000/graphql' }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
  ```

### 3. Create Subscription Hook

- Create a custom React hook for subscriptions:

  ```typescript
  import { gql, useSubscription } from '@apollo/client';

  const DESIGNATION_ADDED_SUBSCRIPTION = gql`
    subscription OnDesignationAdded($businessId: String!) {
      designationAdded(businessId: $businessId) {
        id
        name
      }
    }
  `;

  export const useDesignationAdded = (businessId: string) => {
    const { data, loading, error } = useSubscription(
      DESIGNATION_ADDED_SUBSCRIPTION,
      {
        variables: { businessId },
      },
    );

    return { data, loading, error };
  };
  ```

### 4. Integrate Subscription in Component

- Use the custom hook in a React component:

  ```typescript
  import React, { useEffect } from 'react';
  import { useDesignationAdded } from './hooks/useDesignationAdded';

  const DesignationList = ({ businessId }: { businessId: string }) => {
    const { data, loading, error } = useDesignationAdded(businessId);

    useEffect(() => {
      if (data) {
        console.log('New designation added:', data.designationAdded);
      }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <div>Listening for new designations...</div>;
  };

  export default DesignationList;
  ```

### 5. Test Frontend Integration

- Run the frontend application and ensure the WebSocket connection is established.
- Trigger a `designationAdded` event from the backend and verify the frontend receives the update.

---
