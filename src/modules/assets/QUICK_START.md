# Quick Start: Asset File Upload with GraphQL

## The Problem

GraphQL doesn't support file uploads natively because it uses JSON.

## The Solution

**Hybrid Approach:** REST API for file upload + GraphQL for data operations

---

## Step-by-Step Guide

### 1️⃣ Upload File (REST API)

```bash
POST http://localhost:3000/assets/upload-file
```

**Request:**

```javascript
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('http://localhost:3000/assets/upload-file', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${yourJWTToken}`,
  },
  body: formData,
});

const result = await response.json();
// result.imagePath = "/uploads/assets/asset-1732172400000-123456789.jpg"
```

**Response:**

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

---

### 2️⃣ Create Asset (GraphQL)

Use the `imagePath` from Step 1 in your GraphQL mutation:

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
    "name": "MacBook Pro",
    "code": "LAP-001",
    "date": "2025-11-21",
    "image": "/uploads/assets/asset-1732172400000-123456789.jpg",
    "assetTypeId": 1,
    "note": "16-inch M3 Pro",
    "assignedTo": 5
  }
}
```

---

## Complete React Component Example

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
        image
      }
    }
  }
`;

function AssetForm({ authToken }) {
  const [file, setFile] = useState(null);
  const [assetData, setAssetData] = useState({
    name: '',
    code: '',
    date: '',
  });

  const [createAsset, { loading }] = useMutation(CREATE_ASSET);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imagePath = null;

      // Step 1: Upload file
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch(
          'http://localhost:3000/assets/upload-file',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${authToken}` },
            body: formData,
          },
        );

        const uploadData = await uploadRes.json();
        imagePath = uploadData.imagePath;
      }

      // Step 2: Create asset with GraphQL
      const { data } = await createAsset({
        variables: {
          input: {
            ...assetData,
            image: imagePath,
          },
        },
      });

      alert(`Asset created! ID: ${data.createAsset.data.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={assetData.name}
        onChange={(e) => setAssetData({ ...assetData, name: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Code"
        value={assetData.code}
        onChange={(e) => setAssetData({ ...assetData, code: e.target.value })}
        required
      />

      <input
        type="date"
        value={assetData.date}
        onChange={(e) => setAssetData({ ...assetData, date: e.target.value })}
        required
      />

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Asset'}
      </button>
    </form>
  );
}
```

---

## Without File Upload

If you don't need to upload a file, just use GraphQL directly:

```graphql
mutation {
  createAsset(
    createAssetInput: {
      name: "Desktop Computer"
      code: "DES-001"
      date: "2025-11-21"
      assetTypeId: 2
    }
  ) {
    success
    data {
      id
      name
    }
  }
}
```

---

## Key Points

✅ **File Upload:** REST API (`/assets/upload-file`)
✅ **Asset Operations:** GraphQL (create, update, query, delete)
✅ **Authentication:** JWT token required for both
✅ **File Types:** JPG, PNG, GIF, WEBP, PDF (max 5MB)
✅ **File Access:** `http://localhost:3000/uploads/assets/{filename}`

---

## Why This Approach?

| Feature           | REST + GraphQL           | GraphQL-Upload Package      |
| ----------------- | ------------------------ | --------------------------- |
| Performance       | ✅ Fast                  | ❌ Slow                     |
| Complexity        | ✅ Simple                | ❌ Complex                  |
| Browser Support   | ✅ Full                  | ⚠️ Limited                  |
| Apollo v4         | ✅ Supported             | ❌ Not officially supported |
| Progress Tracking | ✅ Easy                  | ❌ Difficult                |
| Industry Standard | ✅ Yes (GitHub, Shopify) | ❌ No                       |

**Result:** REST for files, GraphQL for data = Best practice! 🚀
