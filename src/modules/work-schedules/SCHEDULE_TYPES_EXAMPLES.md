# Work Schedule Types - Usage Examples

This document provides examples of how to create work schedules with the three different schedule types.

## Schedule Types Overview

### 1. REGULAR Schedule

- **Use Case**: Standard 9-5 office hours, same every day
- **Requirements**:
  - Exactly 7 day schedules (days 0-6)
  - Each day has exactly 1 time slot
  - All days must have identical start and end times

### 2. SCHEDULED Schedule

- **Use Case**: Different hours for different days (e.g., shorter Fridays)
- **Requirements**:
  - 1-7 day schedules (any combination of days 0-6)
  - Each day has exactly 1 time slot
  - Time slots can differ between days

### 3. FLEXIBLE Schedule

- **Use Case**: Split shifts, multiple work periods per day
- **Requirements**:
  - 1-7 day schedules (any combination of days 0-6)
  - Each day can have 1 or more time slots
  - Full flexibility in time slot arrangements

---

## GraphQL Mutation Examples

### Example 1: REGULAR Schedule (9 AM - 5 PM, Monday-Sunday)

```graphql
mutation CreateRegularSchedule {
  createWorkSchedule(
    createWorkScheduleInput: {
      name: "Standard Office Hours"
      description: "Regular 9-5 schedule for all days"
      scheduleType: REGULAR
      breakType: UNPAID
      breakHours: 1
      status: ACTIVE
      schedules: [
        {
          day: 0
          isWeekend: true
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
        {
          day: 1
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
        {
          day: 2
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
        {
          day: 3
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
        {
          day: 4
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
        {
          day: 5
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
        {
          day: 6
          isWeekend: true
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
      ]
    }
  ) {
    success
    message
    data {
      id
      name
      scheduleType
      schedules {
        day
        isWeekend
        timeSlots {
          startTime
          endTime
        }
      }
    }
  }
}
```

### Example 2: SCHEDULED Schedule (Different hours per day)

```graphql
mutation CreateScheduledSchedule {
  createWorkSchedule(
    createWorkScheduleInput: {
      name: "Retail Store Hours"
      description: "Store hours vary by day of week"
      scheduleType: SCHEDULED
      breakType: PAID
      breakHours: 0
      status: ACTIVE
      schedules: [
        {
          day: 1
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "18:00" }]
        }
        {
          day: 2
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "18:00" }]
        }
        {
          day: 3
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "18:00" }]
        }
        {
          day: 4
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "18:00" }]
        }
        {
          day: 5
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "20:00" }]
        }
        {
          day: 6
          isWeekend: true
          timeSlots: [{ startTime: "10:00", endTime: "16:00" }]
        }
      ]
    }
  ) {
    success
    message
    data {
      id
      name
      scheduleType
      schedules {
        day
        isWeekend
        timeSlots {
          startTime
          endTime
        }
      }
    }
  }
}
```

### Example 3: FLEXIBLE Schedule (Multiple shifts per day)

```graphql
mutation CreateFlexibleSchedule {
  createWorkSchedule(
    createWorkScheduleInput: {
      name: "Restaurant Split Shift"
      description: "Morning and evening service hours"
      scheduleType: FLEXIBLE
      breakType: UNPAID
      breakHours: 2
      status: ACTIVE
      schedules: [
        {
          day: 1
          isWeekend: false
          timeSlots: [
            { startTime: "07:00", endTime: "11:00" }
            { startTime: "17:00", endTime: "22:00" }
          ]
        }
        {
          day: 2
          isWeekend: false
          timeSlots: [
            { startTime: "07:00", endTime: "11:00" }
            { startTime: "17:00", endTime: "22:00" }
          ]
        }
        {
          day: 3
          isWeekend: false
          timeSlots: [
            { startTime: "07:00", endTime: "11:00" }
            { startTime: "17:00", endTime: "22:00" }
          ]
        }
        {
          day: 4
          isWeekend: false
          timeSlots: [
            { startTime: "07:00", endTime: "11:00" }
            { startTime: "17:00", endTime: "22:00" }
          ]
        }
        {
          day: 5
          isWeekend: false
          timeSlots: [
            { startTime: "07:00", endTime: "11:00" }
            { startTime: "17:00", endTime: "23:00" }
          ]
        }
        {
          day: 6
          isWeekend: true
          timeSlots: [
            { startTime: "08:00", endTime: "12:00" }
            { startTime: "17:00", endTime: "23:00" }
          ]
        }
        {
          day: 0
          isWeekend: true
          timeSlots: [
            { startTime: "08:00", endTime: "12:00" }
            { startTime: "17:00", endTime: "22:00" }
          ]
        }
      ]
    }
  ) {
    success
    message
    data {
      id
      name
      scheduleType
      schedules {
        day
        isWeekend
        timeSlots {
          startTime
          endTime
        }
      }
    }
  }
}
```

### Example 4: FLEXIBLE Schedule (Varied schedules throughout the week)

```graphql
mutation CreateVariedFlexibleSchedule {
  createWorkSchedule(
    createWorkScheduleInput: {
      name: "Freelancer Schedule"
      description: "Flexible work hours based on project needs"
      scheduleType: FLEXIBLE
      breakType: UNPAID
      breakHours: 1
      status: ACTIVE
      schedules: [
        {
          day: 1
          isWeekend: false
          timeSlots: [
            { startTime: "09:00", endTime: "12:00" }
            { startTime: "14:00", endTime: "18:00" }
          ]
        }
        {
          day: 2
          isWeekend: false
          timeSlots: [{ startTime: "10:00", endTime: "16:00" }]
        }
        {
          day: 3
          isWeekend: false
          timeSlots: [
            { startTime: "08:00", endTime: "11:00" }
            { startTime: "13:00", endTime: "15:00" }
            { startTime: "19:00", endTime: "21:00" }
          ]
        }
        {
          day: 5
          isWeekend: false
          timeSlots: [{ startTime: "09:00", endTime: "17:00" }]
        }
      ]
    }
  ) {
    success
    message
    data {
      id
      name
      scheduleType
    }
  }
}
```

---

## Update Examples

### Updating a Schedule (with validation)

```graphql
mutation UpdateWorkSchedule {
  updateWorkSchedule(
    updateWorkScheduleInput: {
      id: 1
      name: "Updated Schedule Name"
      scheduleType: SCHEDULED # Can change type
      schedules: [
        # Must provide schedules matching the new type's requirements
        {
          day: 1
          isWeekend: false
          timeSlots: [{ startTime: "08:00", endTime: "16:00" }]
        }
        {
          day: 2
          isWeekend: false
          timeSlots: [{ startTime: "08:00", endTime: "16:00" }]
        }
        {
          day: 3
          isWeekend: false
          timeSlots: [{ startTime: "08:00", endTime: "16:00" }]
        }
        {
          day: 4
          isWeekend: false
          timeSlots: [{ startTime: "08:00", endTime: "16:00" }]
        }
        {
          day: 5
          isWeekend: false
          timeSlots: [{ startTime: "08:00", endTime: "14:00" }]
        }
      ]
    }
  ) {
    success
    message
    data {
      id
      name
      scheduleType
      schedules {
        day
        timeSlots {
          startTime
          endTime
        }
      }
    }
  }
}
```

---

## Validation Rules Summary

| Schedule Type | Days Required   | Time Slots per Day | Additional Rules                  |
| ------------- | --------------- | ------------------ | --------------------------------- |
| **REGULAR**   | Exactly 7 (0-6) | Exactly 1          | All slots must be identical       |
| **SCHEDULED** | 1-7 (any days)  | Exactly 1          | Each day can have different times |
| **FLEXIBLE**  | 1-7 (any days)  | 1 or more          | Full flexibility                  |

---

## Common Validation Errors

### REGULAR Schedule Errors

```
❌ "REGULAR schedule type requires exactly 7 day schedules"
   → Must include all days 0-6

❌ "REGULAR schedule must include all days (0-6)"
   → Cannot skip any days

❌ "REGULAR schedule type requires exactly one time slot per day"
   → Each day needs exactly 1 slot

❌ "REGULAR schedule type requires all days to have the same start and end time"
   → All time slots must match
```

### SCHEDULED Schedule Errors

```
❌ "SCHEDULED schedule type cannot have more than 7 day schedules"
   → Maximum 7 days allowed

❌ "SCHEDULED schedule type cannot have duplicate days"
   → Each day can appear only once

❌ "SCHEDULED schedule type requires exactly one time slot per day"
   → Only 1 slot per day allowed
```

### FLEXIBLE Schedule Errors

```
❌ "FLEXIBLE schedule type cannot have more than 7 day schedules"
   → Maximum 7 days allowed

❌ "FLEXIBLE schedule type cannot have duplicate days"
   → Each day can appear only once
```

---

## Day Number Reference

- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- `3` = Wednesday
- `4` = Thursday
- `5` = Friday
- `6` = Saturday
