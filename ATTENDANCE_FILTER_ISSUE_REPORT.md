# Attendance Filter Issue - Diagnostic Report

## Problem Summary

The manager filter for attendance queries is not working correctly. Manager with ID 53 cannot see attendances from employees in their department, even though the department's managerId is confirmed to be 53.

---

## Root Cause Analysis

### Current (Broken) Query Path

```typescript
andCondition.push({
  employee: {
    // ❌ INCORRECT - Direct relation doesn't exist
    departments: {
      some: {
        department: {
          businessId,
          managerId: user.userId,
        },
      },
    },
  },
});
```

### Why It's Broken

Looking at the Prisma schema relationships:

1. **Attendance Model** (line 917-946):

   ```prisma
   model Attendance {
     userId   Int    @map("user_id")
     user     User   @relation(name: "userAttendance", ...)
     employee Employee? @relation(fields: [employeeUserId], references: [userId])
     employeeUserId Int?
   }
   ```

   - Has `employeeUserId` field (nullable)
   - Has `employee` relation (nullable)
   - **Issue**: The relation uses `employeeUserId`, NOT `userId`

2. **Employee Model** (line 762-789):

   ```prisma
   model Employee {
     userId       Int                     @id
     user         User                    @relation(...)
     departments  EmployeeDepartment[]    @relation(name: "employeeDepartment")
   }
   ```

   - `departments` relation connects to `EmployeeDepartment`

3. **EmployeeDepartment Model** (line 475-523):
   ```prisma
   model EmployeeDepartment {
     userId       Int
     employee     Employee   @relation(...)
     departmentId Int
     department   Department @relation(...)
     isActive     Boolean    @default(true)
   }
   ```

   - Junction table between Employee and Department
   - Has `managerId` in the Department relation

### The Problem

The current filter assumes `Attendance.employee` is always populated, but:

1. **`employeeUserId` is nullable** - It may not be set for all attendance records
2. **Relation field name** - Uses `employeeUserId` instead of `userId`, meaning the relation might not be established correctly
3. **Missing null check** - No fallback if employee relation doesn't exist

---

## Correct Solution

### Option 1: Filter via User → Employee → Departments (Recommended)

```typescript
if (targetUser.role.name === (ROLE.MANAGER as any)) {
  andCondition.push({
    user: {
      // ✅ Start from user relation (always exists)
      employee: {
        // ✅ Navigate to employee
        departments: {
          // ✅ Check departments
          some: {
            department: {
              businessId,
              managerId: user.userId,
            },
            isActive: true, // ✅ Only active department assignments
          },
        },
      },
    },
  });
}
```

**Why this works:**

- `Attendance → user` relationship is guaranteed (NOT NULL)
- `User → employee` relationship exists for all employees
- Filters by active department assignments
- Checks both businessId and managerId

### Option 2: Direct Employee Relation with Null Handling

```typescript
if (targetUser.role.name === (ROLE.MANAGER as any)) {
  andCondition.push({
    OR: [
      {
        user: {
          // Primary path via user
          employee: {
            departments: {
              some: {
                department: {
                  businessId,
                  managerId: user.userId,
                },
                isActive: true,
              },
            },
          },
        },
      },
      {
        employee: {
          // Fallback path via direct employee relation
          departments: {
            some: {
              department: {
                businessId,
                managerId: user.userId,
              },
              isActive: true,
            },
          },
        },
      },
    ],
  });
}
```

---

## Generated SQL Comparison

### Current (Broken) Query

```sql
SELECT * FROM attendances
WHERE employee.departments.some(department.managerId = 53)
-- ❌ Fails because:
-- 1. employee relation may be null
-- 2. Direct navigation path doesn't match schema structure
```

### Correct Query (Option 1)

```sql
SELECT * FROM attendances a
INNER JOIN users u ON a.user_id = u.id
INNER JOIN employees e ON u.id = e.user_id
INNER JOIN employee_departments ed ON e.user_id = ed.user_id
INNER JOIN departments d ON ed.department_id = d.id
WHERE d.manager_id = 53
  AND d.business_id = ?
  AND ed.is_active = true
-- ✅ Works because it uses guaranteed relationships
```

---

## Testing Verification

### Test Case 1: Manager can see their department's attendances

```typescript
// Given
const manager = { userId: 53, businessId: 1, role: 'MANAGER' };
const department = { id: 10, managerId: 53, businessId: 1 };
const employee = {
  userId: 100,
  departments: [{ departmentId: 10, isActive: true }],
};
const attendance = { userId: 100, date: '2026-02-13' };

// Expected Result
// Manager 53 should see attendance for employee 100
```

### Test Case 2: Manager cannot see other departments

```typescript
// Given
const manager = { userId: 53, businessId: 1, role: 'MANAGER' };
const otherDepartment = { id: 20, managerId: 99, businessId: 1 };
const employee = {
  userId: 200,
  departments: [{ departmentId: 20, isActive: true }],
};
const attendance = { userId: 200, date: '2026-02-13' };

// Expected Result
// Manager 53 should NOT see attendance for employee 200
```

### Test Case 3: Inactive department assignments excluded

```typescript
// Given
const manager = { userId: 53, businessId: 1, role: 'MANAGER' };
const department = { id: 10, managerId: 53, businessId: 1 };
const employee = {
  userId: 100,
  departments: [{ departmentId: 10, isActive: false }],
};
const attendance = { userId: 100, date: '2026-02-13' };

// Expected Result
// Manager 53 should NOT see attendance (isActive = false)
```

---

## Implementation Steps

1. **Backup Current Code**: Save current implementation
2. **Apply Fix**: Replace filter logic with Option 1 (recommended)
3. **Test Locally**: Run test cases above
4. **Verify Logs**: Check console output for correct results
5. **Test in UI**: Verify manager can see correct attendances
6. **Remove Debug Logs**: Clean up any console.log statements

---

## Additional Recommendations

### 1. Add Index for Performance

```prisma
// In schema.prisma - EmployeeDepartment model
@@index([userId, isActive])
@@index([departmentId, isActive])
```

Already exists! ✅

### 2. Consider Caching Manager's Department IDs

```typescript
// Cache department IDs for managers
const managerDepartmentIds = await this.prisma.department.findMany({
  where: { managerId: user.userId, businessId },
  select: { id: true },
});
```

### 3. Add Business Isolation at Query Level

```typescript
// Always filter by business first
andCondition.push({
  user: {
    businessId: user.businessId, // Explicit business check
  },
});
```

---

## Impact Assessment

**Affected Methods:**

1. `getAttendanceOverview()` - Line 186
2. `findAll()` - Line 485

**Risk Level:** Medium

- No data corruption risk
- Only affects manager's view filtering
- Other roles (Owner, Admin, Employee) not affected

**Rollback Plan:**

- Revert to previous query structure
- Filter attendances in application layer as temporary fix

---

## Conclusion

The issue is caused by using an incorrect relationship path in the Prisma query. The fix is to navigate via `user.employee.departments` instead of directly accessing `employee.departments` on the Attendance model.

**Recommended Action:** Implement Option 1 immediately and test with manager user ID 53.
