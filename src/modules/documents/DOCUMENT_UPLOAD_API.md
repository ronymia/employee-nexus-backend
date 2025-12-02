# Document Upload API

## Overview

The documents module uses a **hybrid approach** combining REST API for file uploads with GraphQL for CRUD operations.

## Why REST for File Upload?

GraphQL doesn't natively support file uploads because it uses JSON format. The solution is to use a REST endpoint for file uploads and GraphQL for all other operations.

## File Upload Endpoint

### Upload Document Attachment

**POST** `/documents/upload-attachment`

Upload a document file and receive the file path to use in GraphQL mutations.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Request:**

- Form data with key `file` containing the document file

**Allowed File Types:**

- PDF (`.pdf`)
- Word Documents (`.doc`, `.docx`)
- Excel Spreadsheets (`.xls`, `.xlsx`)
- PowerPoint Presentations (`.ppt`, `.pptx`)
- Images (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`)
- Text Files (`.txt`)

**File Size Limit:** 10MB

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Document uploaded successfully",
  "attachmentPath": "/uploads/documents/document-1234567890-123456789.pdf",
  "fileName": "document-1234567890-123456789.pdf",
  "originalName": "my-resume.pdf",
  "fileSize": 245678,
  "mimeType": "application/pdf"
}
```

## GraphQL Operations

### Create Document

After uploading the file, use the `attachmentPath` from the upload response:

```graphql
mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(createDocumentInput: $input) {
    success
    statusCode
    message
    data {
      id
      userId
      title
      description
      attachment
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          fullName
        }
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "userId": 1,
    "title": "My Resume",
    "description": "Updated resume for 2025",
    "attachment": "/uploads/documents/document-1234567890-123456789.pdf"
  }
}
```

### Query Documents by User

```graphql
query GetDocumentsByUserId($userId: Int!, $query: QueryDocumentInput) {
  documentsByUserId(userId: $userId, query: $query) {
    success
    statusCode
    message
    meta {
      page
      limit
      total
      totalPages
    }
    data {
      id
      title
      description
      attachment
      createdAt
      user {
        id
        email
        profile {
          fullName
        }
      }
    }
  }
}
```

**Variables:**

```json
{
  "userId": 1,
  "query": {
    "searchTerm": "resume",
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

### Get Single Document

```graphql
query GetDocument($id: Int!, $userId: Int!) {
  document(id: $id, userId: $userId) {
    success
    statusCode
    message
    data {
      id
      userId
      title
      description
      attachment
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          fullName
        }
      }
    }
  }
}
```

### Update Document

```graphql
mutation UpdateDocument($input: UpdateDocumentInput!) {
  updateDocument(updateDocumentInput: $input) {
    success
    statusCode
    message
    data {
      id
      title
      description
      attachment
      updatedAt
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": 1,
    "userId": 1,
    "title": "Updated Resume",
    "description": "Latest version"
  }
}
```

### Delete Document

```graphql
mutation DeleteDocument($id: Int!, $userId: Int!) {
  deleteDocument(id: $id, userId: $userId) {
    success
    statusCode
    message
    data {
      id
      title
    }
  }
}
```

## Complete Workflow Example

### 1. Upload File

```bash
curl -X POST http://localhost:3000/documents/upload-attachment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Document uploaded successfully",
  "attachmentPath": "/uploads/documents/document-1733097600000-123456789.pdf",
  "fileName": "document-1733097600000-123456789.pdf",
  "originalName": "document.pdf",
  "fileSize": 245678,
  "mimeType": "application/pdf"
}
```

### 2. Create Document Record

Use the `attachmentPath` in your GraphQL mutation:

```graphql
mutation {
  createDocument(
    createDocumentInput: {
      userId: 1
      title: "Employment Contract"
      description: "Signed employment contract"
      attachment: "/uploads/documents/document-1733097600000-123456789.pdf"
    }
  ) {
    success
    message
    data {
      id
      title
      attachment
    }
  }
}
```

### 3. Update Document (Optional)

If you need to update the file:

1. Upload new file via REST endpoint
2. Update document record with new `attachmentPath`

```graphql
mutation {
  updateDocument(
    updateDocumentInput: {
      id: 1
      userId: 1
      attachment: "/uploads/documents/document-1733097700000-987654321.pdf"
    }
  ) {
    success
    message
  }
}
```

## Permissions

All operations require proper permissions:

- `Document:create` - Create documents and upload files
- `Document:read` - View documents
- `Document:update` - Update document information
- `Document:delete` - Delete documents

## Error Handling

### Upload Errors

**Invalid File Type:**

```json
{
  "statusCode": 400,
  "message": "Only PDF, Word, Excel, PowerPoint, images, and text files are allowed!",
  "error": "Bad Request"
}
```

**File Too Large:**

```json
{
  "statusCode": 400,
  "message": "File too large. Maximum size is 10MB",
  "error": "Bad Request"
}
```

**Missing File:**

```json
{
  "statusCode": 400,
  "message": "File is required",
  "error": "Bad Request"
}
```

## Notes

- Files are stored in `./uploads/documents/` directory
- Filenames are automatically generated with timestamps to avoid conflicts
- The `attachmentPath` includes the full path for serving files
- Remember to configure static file serving for the uploads directory
- Consider implementing file cleanup for deleted documents
