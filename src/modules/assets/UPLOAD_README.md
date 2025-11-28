# Asset File Upload with GraphQL

This module implements a **hybrid approach** combining REST API for file uploads with GraphQL for data operations.

## Why Hybrid Approach?

**GraphQL doesn't natively support file uploads** because:

- GraphQL uses JSON for requests/responses
- Binary file data can't be efficiently sent as JSON
- `multipart/form-data` conflicts with GraphQL's content type

**Solution:** Use REST API for file uploads, GraphQL for everything else.

## Installation

```bash
npm install @nestjs/platform-express multer
npm install -D @types/multer @types/express
```

## Features

- ✅ REST endpoint for file upload only (returns file path)
- ✅ GraphQL mutations for creating/updating assets
- ✅ Supports: JPG, JPEG, PNG, GIF, WEBP, PDF
- ✅ Maximum file size: 5MB
- ✅ Automatic file naming with timestamp
- ✅ Authentication & Permission guards
- ✅ Business-scoped uploads

## Recommended Workflow

### Step 1: Upload File (REST API)

**Endpoint:** `POST /assets/upload-file`

**Purpose:** Upload file only and get the file path back

**Authentication:** Required (JWT Token)

**Permission:** `Asset:create`

**Content-Type:** `multipart/form-data`

**Form Field:**

```
file: [File] (required) - Image or PDF file only
```

**Example using curl:**

```bash
curl -X POST http://localhost:3000/assets/upload-file \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**Example using JavaScript:**

```javascript
// 1. Upload file first
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:3000/assets/upload-file', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const uploadResult = await uploadResponse.json();
console.log(uploadResult.imagePath); // Use this in GraphQL mutation
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "File uploaded successfully",
  "imagePath": "/uploads/assets/asset-1732172400000-123456789.jpg",
  "fileName": "asset-1732172400000-123456789.jpg",
  "fileSize": 245678,
  "mimeType": "image/jpeg"
}
```

### Step 2: Create Asset (GraphQL)

**Use the `imagePath` from Step 1 in your GraphQL mutation**

```graphql
mutation CreateAsset($input: CreateAssetInput!) {
  createAsset(createAssetInput: $input) {
    success
    statusCode
    message
    data {
      id
      name
      code
      image
      status
      createdAt
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "name": "Laptop",
    "code": "LAP-001",
    "date": "2025-11-21",
    "image": "/uploads/assets/asset-1732172400000-123456789.jpg",
    "assetTypeId": 1,
    "note": "MacBook Pro 16",
    "assignedTo": 5
  }
}
```

### Update Asset with New Image

**Step 1:** Upload new file using `POST /assets/upload-file`

**Step 2:** Update asset via GraphQL:

```graphql
mutation UpdateAsset($input: UpdateAssetInput!) {
  updateAsset(updateAssetInput: $input) {
    success
    message
    data {
      id
      name
      image
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": 1,
    "image": "/uploads/assets/asset-1732172400000-987654321.jpg"
  }
}
```

## File Storage

- **Upload Directory:** `./uploads/assets/`
- **File Naming:** `asset-{timestamp}-{random}.{ext}`
- **Access URL:** `http://localhost:3000/uploads/assets/{filename}`

## Error Responses

**401 Unauthorized:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**400 Bad Request (Invalid file type):**

```json
{
  "statusCode": 400,
  "message": "Only image and PDF files are allowed!"
}
```

**400 Bad Request (File too large):**

```json
{
  "statusCode": 400,
  "message": "File too large"
}
```

**403 Forbidden (No permission):**

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Complete Frontend Example (React + Apollo Client)

```jsx
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(createAssetInput: $input) {
      success
      message
      data {
        id
        name
        code
        image
      }
    }
  }
`;

function CreateAssetForm({ token }) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    date: '',
    assetTypeId: null,
  });

  const [createAsset] = useMutation(CREATE_ASSET);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imagePath = null;

    // Step 1: Upload file if selected
    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadResponse = await fetch(
        'http://localhost:3000/assets/upload-file',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        },
      );

      const uploadResult = await uploadResponse.json();
      imagePath = uploadResult.imagePath;
    }

    // Step 2: Create asset via GraphQL
    const { data } = await createAsset({
      variables: {
        input: {
          ...formData,
          image: imagePath,
        },
      },
    });

    console.log('Asset created:', data.createAsset.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Code"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <button type="submit">Create Asset</button>
    </form>
  );
}
```

## Alternative: Create Asset Without File

You can create assets without files by just using GraphQL:

```graphql
mutation CreateAsset($input: CreateAssetInput!) {
  createAsset(createAssetInput: $input) {
    success
    message
    data {
      id
      name
      code
    }
  }
}
```

**Variables (no image):**

```json
{
  "input": {
    "name": "Desktop Computer",
    "code": "DES-001",
    "date": "2025-11-21",
    "assetTypeId": 2
  }
}
```

## Security Features

1. **JWT Authentication:** All endpoints require valid JWT token
2. **Role-Based Permissions:** Enforces `Asset:create` and `Asset:update` permissions
3. **File Type Validation:** Only allows specific image and PDF formats
4. **File Size Limit:** Maximum 5MB per file
5. **Business Scoping:** Assets are automatically scoped to user's business

## Why This Approach?

### ✅ Advantages:

1. **Separation of Concerns**: File handling separate from data operations
2. **Better Performance**: Large files don't go through GraphQL parser
3. **Progress Tracking**: Easier to implement upload progress bars
4. **Industry Standard**: Used by GitHub, Shopify, Stripe, etc.
5. **Flexibility**: Can still create assets without files via GraphQL only

### GraphQL-Upload Alternative (Not Recommended)

There's a package called `graphql-upload`, but it's:

- ❌ Not officially supported by Apollo Server v4+
- ❌ Complex to implement
- ❌ Performance overhead
- ❌ Limited browser support for large files

**Our hybrid REST + GraphQL approach is more reliable and performant.**

## Configuration

Customize upload settings in `assets.controller.ts`:

```typescript
// Upload directory
destination: './uploads/assets';

// File size limit (5MB)
fileSize: 5 * 1024 * 1024;

// Allowed file types
fileFilter: (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
    // Customize allowed types
  }
};
```

## Summary

**For file uploads:**

```
POST /assets/upload-file → returns imagePath → use in GraphQL mutation
```

**For all other operations:**

```
Use GraphQL mutations and queries (createAsset, updateAsset, etc.)
```

This gives you the best of both worlds! 🚀
