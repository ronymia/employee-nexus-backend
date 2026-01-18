# Employee Assignment GraphQL Endpoints

This document contains all GraphQL queries and mutations for employee assignment modules (departments, designations, employment statuses, work schedules, work sites).

## Table of Contents

1. [Employee Departments](#employee-departments)
2. [Employee Designations](#employee-designations)
3. [Employee Employment Statuses](#employee-employment-statuses)
4. [Employee Work Schedules](#employee-work-schedules)
5. [Employee Work Sites](#employee-work-sites)

---

## Employee Departments

### 1. Assign Employee Department (Mutation)

```graphql
mutation AssignEmployeeDepartment {
  assignEmployeeDepartment(
    assignEmployeeDepartmentInput: {
      userId: 1
      departmentId: 2
      isPrimary: true
      isActive: true
      roleInDept: "Team Lead"
      startDate: "2024-01-01"
      endDate: null
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      departmentId
      isPrimary
      isActive
      roleInDept
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      department {
        id
        name
        description
      }
    }
  }
}
```

### 2. Get Employee Departments (Query)

```graphql
query GetEmployeeDepartments {
  getEmployeeDepartments(
    getEmployeeDepartmentsInput: {
      userId: 1
      departmentId: 2
      isPrimary: true
      isActive: true
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      departmentId
      isPrimary
      isActive
      roleInDept
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      department {
        id
        name
      }
    }
  }
}
```

### 3. Get Department History (Query)

```graphql
query GetDepartmentHistory {
  departmentHistory(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      departmentId
      isPrimary
      isActive
      roleInDept
      startDate
      endDate
      department {
        id
        name
      }
    }
  }
}
```

### 4. Get Active Department (Query)

```graphql
query GetActiveDepartment {
  getActiveDepartment(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      departmentId
      isPrimary
      isActive
      roleInDept
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      department {
        id
        name
        description
      }
    }
  }
}
```

### 5. Get Department By ID (Query)

```graphql
query GetDepartmentById {
  getDepartmentById(userId: 1, departmentId: 2) {
    success
    statusCode
    message
    data {
      userId
      departmentId
      isPrimary
      isActive
      roleInDept
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      department {
        id
        name
        description
      }
    }
  }
}
```

### 6. Update Employee Department (Mutation)

```graphql
mutation UpdateEmployeeDepartment {
  updateEmployeeDepartment(
    userId: 1
    departmentId: 2
    updateData: {
      isPrimary: false
      isActive: true
      roleInDept: "Senior Developer"
      endDate: "2024-12-31"
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      departmentId
      isPrimary
      isActive
      roleInDept
      startDate
      endDate
      department {
        id
        name
      }
    }
  }
}
```

---

## Employee Designations

### 1. Assign Employee Designation (Mutation)

```graphql
mutation AssignEmployeeDesignation {
  assignEmployeeDesignation(
    assignEmployeeDesignationInput: {
      userId: 1
      designationId: 3
      salary: 75000.0
      isActive: true
      startDate: "2024-01-01"
      endDate: null
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      designationId
      salary
      isActive
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      designation {
        id
        title
        level
      }
    }
  }
}
```

### 2. Get Employee Designations (Query)

```graphql
query GetEmployeeDesignations {
  getEmployeeDesignations(
    getEmployeeDesignationsInput: {
      userId: 1
      designationId: 3
      isActive: true
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      designationId
      salary
      isActive
      startDate
      endDate
      designation {
        id
        title
        level
      }
    }
  }
}
```

### 3. Get Designation History (Query)

```graphql
query GetDesignationHistory {
  designationHistory(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      designationId
      salary
      isActive
      startDate
      endDate
      designation {
        id
        title
        level
      }
    }
  }
}
```

### 4. Get Active Designation (Query)

```graphql
query GetActiveDesignation {
  getActiveDesignation(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      designationId
      salary
      isActive
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      designation {
        id
        title
        level
        description
      }
    }
  }
}
```

### 5. Get Designation By ID (Query)

```graphql
query GetDesignationById {
  getDesignationById(userId: 1, designationId: 3) {
    success
    statusCode
    message
    data {
      userId
      designationId
      salary
      isActive
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      designation {
        id
        title
        level
      }
    }
  }
}
```

### 6. Update Employee Designation (Mutation)

```graphql
mutation UpdateEmployeeDesignation {
  updateEmployeeDesignation(
    userId: 1
    designationId: 3
    updateData: { salary: 85000.0, isActive: true, endDate: "2024-12-31" }
  ) {
    success
    statusCode
    message
    data {
      userId
      designationId
      salary
      isActive
      startDate
      endDate
      designation {
        id
        title
        level
      }
    }
  }
}
```

---

## Employee Employment Statuses

### 1. Assign Employee Status (Mutation)

```graphql
mutation AssignEmployeeStatus {
  assignEmployeeStatus(
    assignEmployeeStatusInput: {
      userId: 1
      employmentStatusId: 2
      isActive: true
      reason: "Contract renewal"
      remarks: "Extended for another year"
      startDate: "2024-01-01"
      endDate: null
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      employmentStatusId
      isActive
      reason
      remarks
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      employmentStatus {
        id
        statusName
        description
      }
    }
  }
}
```

### 2. Get Employee Statuses (Query)

```graphql
query GetEmployeeStatuses {
  getEmployeeStatuses(
    getEmployeeStatusesInput: {
      userId: 1
      employmentStatusId: 2
      isActive: true
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      employmentStatusId
      isActive
      reason
      remarks
      startDate
      endDate
      employmentStatus {
        id
        statusName
        description
      }
    }
  }
}
```

### 3. Get Employment Status History (Query)

```graphql
query GetEmploymentStatusHistory {
  employmentStatusHistory(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      employmentStatusId
      isActive
      reason
      remarks
      startDate
      endDate
      employmentStatus {
        id
        statusName
        description
      }
    }
  }
}
```

### 4. Get Active Employment Status (Query)

```graphql
query GetActiveEmploymentStatus {
  getActiveEmploymentStatus(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      employmentStatusId
      isActive
      reason
      remarks
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      employmentStatus {
        id
        statusName
        description
        isActive
      }
    }
  }
}
```

### 5. Get Employment Status By ID (Query)

```graphql
query GetEmploymentStatusById {
  getEmploymentStatusById(userId: 1, employmentStatusId: 2) {
    success
    statusCode
    message
    data {
      userId
      employmentStatusId
      isActive
      reason
      remarks
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      employmentStatus {
        id
        statusName
        description
      }
    }
  }
}
```

### 6. Update Employee Status (Mutation)

```graphql
mutation UpdateEmployeeStatus {
  updateEmployeeStatus(
    userId: 1
    employmentStatusId: 2
    updateData: {
      isActive: false
      reason: "Contract ended"
      remarks: "Moving to full-time position"
      endDate: "2024-06-30"
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      employmentStatusId
      isActive
      reason
      remarks
      startDate
      endDate
      employmentStatus {
        id
        statusName
      }
    }
  }
}
```

---

## Employee Work Schedules

### 1. Assign Employee Schedule (Mutation)

```graphql
mutation AssignEmployeeSchedule {
  assignEmployeeSchedule(
    assignEmployeeScheduleInput: {
      userId: 1
      workScheduleId: 2
      isActive: true
      notes: "Regular day shift"
      startDate: "2024-01-01"
      endDate: null
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      workScheduleId
      isActive
      assignedBy
      notes
      startDate
      endDate
      user {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      workSchedule {
        id
        name
        description
        schedules {
          id
          dayOfWeek
          timeSlots {
            id
            startTime
            endTime
          }
        }
      }
      assignedByUser {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
}
```

### 2. Get Employee Schedules (Query)

```graphql
query GetEmployeeSchedules {
  getEmployeeSchedules(
    getEmployeeSchedulesInput: { userId: 1, workScheduleId: 2, isActive: true }
  ) {
    success
    statusCode
    message
    data {
      userId
      workScheduleId
      isActive
      notes
      startDate
      endDate
      workSchedule {
        id
        name
        description
        schedules {
          id
          dayOfWeek
          timeSlots {
            id
            startTime
            endTime
          }
        }
      }
    }
  }
}
```

### 3. Get Work Schedule History (Query)

```graphql
query GetWorkScheduleHistory {
  workScheduleHistory(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      workScheduleId
      isActive
      notes
      startDate
      endDate
      workSchedule {
        id
        name
        description
      }
    }
  }
}
```

### 4. Get Active Work Schedule (Query)

```graphql
query GetActiveWorkSchedule {
  getActiveWorkSchedule(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      workScheduleId
      isActive
      assignedBy
      notes
      startDate
      endDate
      user {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      workSchedule {
        id
        name
        description
        schedules {
          id
          dayOfWeek
          timeSlots {
            id
            startTime
            endTime
          }
        }
      }
      assignedByUser {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
}
```

### 5. Get Work Schedule By ID (Query)

```graphql
query GetWorkScheduleById {
  getWorkScheduleById(userId: 1, workScheduleId: 2) {
    success
    statusCode
    message
    data {
      userId
      workScheduleId
      isActive
      assignedBy
      notes
      startDate
      endDate
      user {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      workSchedule {
        id
        name
        description
        schedules {
          id
          dayOfWeek
          timeSlots {
            id
            startTime
            endTime
          }
        }
      }
    }
  }
}
```

### 6. Update Employee Schedule (Mutation)

```graphql
mutation UpdateEmployeeSchedule {
  updateEmployeeSchedule(
    userId: 1
    workScheduleId: 2
    updateData: {
      isActive: true
      notes: "Changed to night shift"
      endDate: "2024-12-31"
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      workScheduleId
      isActive
      assignedBy
      notes
      startDate
      endDate
      workSchedule {
        id
        name
        description
      }
    }
  }
}
```

---

## Employee Work Sites

### 1. Assign Employee Work Site (Mutation)

```graphql
mutation AssignEmployeeWorkSite {
  assignEmployeeWorkSite(
    assignEmployeeWorkSiteInput: {
      userId: 1
      workSiteId: 3
      isActive: true
      startDate: "2024-01-01"
      endDate: null
    }
  ) {
    success
    statusCode
    message
    data {
      userId
      workSiteId
      isActive
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      workSite {
        id
        name
        address
        city
        state
        country
      }
    }
  }
}
```

### 2. Get Employee Work Sites (Query)

```graphql
query GetEmployeeWorkSites {
  getEmployeeWorkSites(
    queryEmployeeWorkSitesInput: { userId: 1, workSiteId: 3, isActive: true }
  ) {
    success
    statusCode
    message
    data {
      userId
      workSiteId
      isActive
      startDate
      endDate
      workSite {
        id
        name
        address
        city
        state
        country
      }
    }
  }
}
```

### 3. Get Work Site History (Query)

```graphql
query GetWorkSiteHistory {
  workSiteHistory(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      workSiteId
      isActive
      startDate
      endDate
      workSite {
        id
        name
        address
        city
      }
    }
  }
}
```

### 4. Get Active Work Sites (Query)

**Note: Returns an array as employees can have multiple active work sites**

```graphql
query GetActiveWorkSites {
  getActiveWorkSites(userId: 1) {
    success
    statusCode
    message
    data {
      userId
      workSiteId
      isActive
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      workSite {
        id
        name
        address
        city
        state
        country
        postalCode
      }
    }
  }
}
```

### 5. Get Work Site By ID (Query)

```graphql
query GetWorkSiteById {
  getWorkSiteById(userId: 1, workSiteId: 3) {
    success
    statusCode
    message
    data {
      userId
      workSiteId
      isActive
      startDate
      endDate
      employee {
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      workSite {
        id
        name
        address
        city
        state
        country
      }
    }
  }
}
```

### 6. Update Employee Work Site (Mutation)

```graphql
mutation UpdateEmployeeWorkSite {
  updateEmployeeWorkSite(
    userId: 1
    workSiteId: 3
    updateData: { isActive: false, endDate: "2024-06-30" }
  ) {
    success
    statusCode
    message
    data {
      userId
      workSiteId
      isActive
      startDate
      endDate
      workSite {
        id
        name
        address
      }
    }
  }
}
```

---

## Common Patterns

### Response Structure

All endpoints return a consistent response structure:

```typescript
{
  success: boolean
  statusCode: number
  message: string
  data: EntityType | EntityType[]
}
```

### Authentication

All endpoints require authentication via JWT token passed in the request headers:

```
Authorization: Bearer <your-jwt-token>
```

### Business Scoping

All operations are automatically scoped to the business ID extracted from the JWT token. Users can only access data within their own business.

### Active Records

- Most modules support only one active record per employee (isActive: true)
- When setting a new record as active, previous active records are automatically deactivated
- Work sites are an exception - employees can have multiple active work sites

### Composite Keys

Each module uses a composite primary key:

- Departments: `userId_departmentId`
- Designations: `userId_designationId`
- Employment Statuses: `userId_employmentStatusId`
- Work Schedules: `userId_workScheduleId`
- Work Sites: `userId_workSiteId`

### Date Handling

- `startDate`: When the assignment began
- `endDate`: When the assignment ended (null for current assignments)
- Dates are stored as DateTime in ISO 8601 format
