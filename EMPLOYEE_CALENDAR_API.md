# Employee Calendar API

## Overview

This API returns employee attendance dates, leave dates, and holiday dates in a single query.

## GraphQL Query

### Query Name

`employeeCalendar`

### Required Permission

`User:read`

### Query Parameters (Optional)

- `userId` (Int): The employee user ID. If not provided, returns data for the current logged-in user.
- `startDate` (String): Start date in format DD-MM-YYYY
- `endDate` (String): End date in format DD-MM-YYYY
- `year` (Int): Year filter (e.g., 2026)
- `month` (Int): Month filter (1-12)

### Date Range Logic

1. If `startDate` and `endDate` are provided, returns data for that range
2. If `year` and `month` are provided, returns data for that specific month
3. If only `year` is provided, returns data for the entire year
4. If no dates are provided, returns data for the current year

## Example Queries

### Get Current User's Calendar for Current Year

```graphql
query {
  employeeCalendar {
    success
    statusCode
    message
    data {
      joiningDate
      registrationDate
      attendances {
        date
        status
        totalMinutes
        breakMinutes
        overtimeMinutes
      }
      leaves {
        startDate
        endDate
        status
        leaveDuration
        totalMinutes
      }
      holidays {
        startDate
        endDate
        name
        description
        isPaid
        holidayType
        isRecurring
      }
    }
  }
}
```

### Get Specific Employee's Calendar for a Date Range

```graphql
query {
  employeeCalendar(
    query: { userId: 5, startDate: "01-01-2026", endDate: "31-12-2026" }
  ) {
    success
    statusCode
    message
    data {
      joiningDate
      registrationDate
      attendances {
        date
        status
        totalMinutes
        breakMinutes
        overtimeMinutes
      }
      leaves {
        startDate
        endDate
        status
        leaveDuration
        totalMinutes
      }
      holidays {
        startDate
        endDate
        name
        description
        isPaid
        holidayType
        isRecurring
      }
    }
  }
}
```

### Get Calendar for Specific Month

```graphql
query {
  employeeCalendar(query: { year: 2026, month: 1 }) {
    success
    statusCode
    message
    data {
      joiningDate
      registrationDate
      attendances {
        date
        status
        totalMinutes
      }
      leaves {
        startDate
        endDate
        status
      }
      holidays {
        startDate
        endDate
        name
        isPaid
      }
    }
  }
}
```

## Response Structure

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Employee calendar retrieved successfully",
  "data": {
    "joiningDate": "2024-06-15T00:00:00.000Z",
    "registrationDate": "2024-01-01T00:00:00.000Z",
    "attendances": [
      {
        "date": "2026-01-15T00:00:00.000Z",
        "status": "present",
        "totalMinutes": 480,
        "breakMinutes": 60,
        "overtimeMinutes": 0
      }
    ],
    "leaves": [
      {
        "startDate": "2026-01-20T00:00:00.000Z",
        "endDate": "2026-01-22T00:00:00.000Z",
        "status": "approved",
        "leaveDuration": "MULTI_DAY",
        "totalMinutes": 1440
      }
    ],
    "holidays": [
      {
        "startDate": "2026-01-01T00:00:00.000Z",
        "endDate": "2026-01-01T00:00:00.000Z",
        "name": "New Year's Day",
        "description": "Public holiday",
        "isPaid": true,
        "holidayType": "PUBLIC",
        "isRecurring": true
      }
    ]
  }
}
```

## Field Descriptions

### Calendar Data Fields

- `joiningDate`: Employee joining date (ISO 8601 DateTime format) - nullable
- `registrationDate`: Business registration date (ISO 8601 DateTime format) - nullable

### Attendance Fields

- `date`: Attendance date (ISO 8601 DateTime format)
- `status`: Attendance status (present, absent, late, half_day, on_leave)
- `totalMinutes`: Total minutes worked
- `breakMinutes`: Break minutes
- `overtimeMinutes`: Overtime minutes

### Leave Fields

- `startDate`: Leave start date (ISO 8601 DateTime format)
- `endDate`: Leave end date (ISO 8601 DateTime format) - nullable for single day leaves
- `status`: Leave status (pending, approved, rejected, cancelled)
- `leaveDuration`: Duration type (SINGLE_DAY, MULTI_DAY, HALF_DAY)
- `totalMinutes`: Total minutes for this leave

### Holiday Fields

- `startDate`: Holiday start date (ISO 8601 DateTime format)
- `endDate`: Holiday end date (ISO 8601 DateTime format)
- `name`: Holiday name
- `description`: Holiday description (optional)
- `isPaid`: Whether it's a paid holiday
- `holidayType`: Type of holiday (PUBLIC, RELIGIOUS, COMPANY_SPECIFIC, REGIONAL)
- `isRecurring`: Whether it recurs annually

## Authorization

- Requires user to be authenticated
- Requires `User:read` permission
- Users can only access calendar data for employees in their own business
- The API will verify that the requested user belongs to the same business as the requester
