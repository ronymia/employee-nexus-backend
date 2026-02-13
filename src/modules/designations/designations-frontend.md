# Frontend Implementation for Designations

## Objective

Provide a complete frontend implementation for managing designations, including create, update, delete, and get operations, using GraphQL and Apollo Client.

---

## GraphQL Queries and Mutations

### 1. Get Designations

```typescript
import { gql } from '@apollo/client';

export const GET_DESIGNATIONS = gql`
  query Designations {
    designations {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
```

### 2. Create Designation

```typescript
export const CREATE_DESIGNATION = gql`
  mutation CreateDesignation($name: String!, $description: String!) {
    createDesignation(
      createDesignationInput: { name: $name, description: $description }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
```

### 3. Update Designation

```typescript
export const UPDATE_DESIGNATION = gql`
  mutation UpdateDesignation($id: Int!, $name: String!, $description: String!) {
    updateDesignation(
      updateDesignationInput: {
        id: $id
        name: $name
        description: $description
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
```

### 4. Delete Designation

```typescript
export const DELETE_DESIGNATION = gql`
  mutation DeleteDesignation($id: Int!) {
    deleteDesignation(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
```

---

## PubSub Implementation for Designations

### Objective

Enable real-time updates for designations using GraphQL subscriptions and PubSub.

---

### Backend Implementation

#### 1. Add Subscription Resolver

- Update the `designations.resolver.ts` file to include a subscription for `designationAdded`:
  ```typescript
  @Subscription(() => Designation, {
    filter: (payload, variables) => payload.businessId === variables.businessId,
  })
  designationAdded(@Args('businessId') businessId: string) {
    return this.pubSubService.subscribe('designationAdded');
  }
  ```

#### 2. Publish Events

- Publish events in the `designations.service.ts` file when a designation is created, updated, or deleted:
  ```typescript
  async createDesignation(createDesignationDto: CreateDesignationDto) {
    const designation = await this.prisma.designation.create({ data: createDesignationDto });
    await this.pubSubService.publish('designationAdded', { designationAdded: designation });
    return designation;
  }
  ```

---

### Frontend Implementation

#### 1. Subscription Query

- Add a subscription query for `designationAdded`:

  ```typescript
  import { gql } from '@apollo/client';

  export const DESIGNATION_ADDED_SUBSCRIPTION = gql`
    subscription OnDesignationAdded($businessId: String!) {
      designationAdded(businessId: $businessId) {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  `;
  ```

#### 2. React Hook for Subscription

- Create a custom React hook to handle the subscription:

  ```typescript
  import { useSubscription } from '@apollo/client';
  import { DESIGNATION_ADDED_SUBSCRIPTION } from './graphql/designations';

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

#### 3. Integrate Subscription in Component

- Use the custom hook in a React component to listen for real-time updates:

  ```typescript
  import React, { useEffect } from "react";
  import { useDesignationAdded } from "./hooks/useDesignationAdded";

  const DesignationUpdates = ({ businessId }: { businessId: string }) => {
    const { data, loading, error } = useDesignationAdded(businessId);

    useEffect(() => {
      if (data) {
        console.log("New designation added:", data.designationAdded);
      }
    }, [data]);

    if (loading) return <p>Loading updates...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <p>Listening for designation updates...</p>;
  };

  export default DesignationUpdates;
  ```

---

## React Component Examples

### 1. Fetch and Display Designations

```typescript
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_DESIGNATIONS } from "./graphql/designations";

const DesignationList = () => {
  const { data, loading, error } = useQuery(GET_DESIGNATIONS);

  useEffect(() => {
    if (data) {
      console.log("Fetched designations:", data.designations.data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.designations.data.map((designation) => (
        <li key={designation.id}>{designation.name}</li>
      ))}
    </ul>
  );
};

export default DesignationList;
```

### 2. Create Designation Form

```typescript
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_DESIGNATION } from "./graphql/designations";

const CreateDesignationForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createDesignation, { data, loading, error }] = useMutation(CREATE_DESIGNATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDesignation({ variables: { name, description } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Create Designation
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Designation created successfully!</p>}
    </form>
  );
};

export default CreateDesignationForm;
```

### 3. Update Designation Form

```typescript
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_DESIGNATION } from "./graphql/designations";

const UpdateDesignationForm = ({ id, currentName, currentDescription }) => {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [updateDesignation, { data, loading, error }] = useMutation(UPDATE_DESIGNATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDesignation({ variables: { id, name, description } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Update Designation
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Designation updated successfully!</p>}
    </form>
  );
};

export default UpdateDesignationForm;
```

### 4. Delete Designation Button

```typescript
import React from "react";
import { useMutation } from "@apollo/client";
import { DELETE_DESIGNATION } from "./graphql/designations";

const DeleteDesignationButton = ({ id }) => {
  const [deleteDesignation, { loading, error }] = useMutation(DELETE_DESIGNATION);

  const handleDelete = async () => {
    await deleteDesignation({ variables: { id } });
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      Delete Designation
    </button>
  );
};

export default DeleteDesignationButton;
```

---

## Next Steps

1. Integrate these components into the frontend application.
2. Test all operations (create, update, delete, get) with the backend.
3. Optimize error handling and user feedback.
