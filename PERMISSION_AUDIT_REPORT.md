# Permission Audit Report - Employee Nexus Backend

**Generated**: December 3, 2025
**Scope**: All resolver files in `src/modules` directory

---

## Executive Summary

This report analyzes permission implementation across 42 resolver files in the Employee Nexus backend application. The analysis focuses on:

1. Implementation of `@UseGuards(PermissionsGuard)` decorator
2. Usage of `@RequirePermissions` decorator
3. Commented-out permissions
4. Missing permission resources in constants

---

## 1. Resolvers with NO Permission Guards at All

These resolvers have **neither** `@UseGuards(PermissionsGuard)` nor `@RequirePermissions` decorators:

### ❌ Critical - No Permission Protection

| Resolver                          | Status               | Notes                                                |
| --------------------------------- | -------------------- | ---------------------------------------------------- |
| `permissions.resolver.ts`         | ❌ No guards         | Exposes permission management without any protection |
| `roles.resolver.ts`               | ⚠️ Only GqlAuthGuard | Has auth but missing permission guards               |
| `users.resolver.ts`               | ⚠️ Only GqlAuthGuard | Has auth but missing permission guards               |
| `profiles.resolver.ts`            | ⚠️ Only GqlAuthGuard | Has auth but missing permission guards               |
| `education-histories.resolver.ts` | ⚠️ Only GqlAuthGuard | Has auth but missing permission guards               |
| `job-histories.resolver.ts`       | ⚠️ Only GqlAuthGuard | Has auth but missing permission guards               |

---

## 2. Resolvers with Commented-Out Permissions

These resolvers have permission infrastructure in place but permissions are **disabled via comments**:

### 🔶 Payroll Module (All permissions commented out)

#### `payroll-components.resolver.ts`

- **Class Level**: `@UseGuards(GqlAuthGuard, PermissionsGuard)` ✅
- **All mutations/queries**: Permission decorators are commented out
- **Missing Permissions**:
  - `// @RequirePermissions('PayrollComponent:create')` - createPayrollComponent
  - `// @RequirePermissions('PayrollComponent:read')` - payrollComponents, activePayrollComponents, payrollComponent, payrollComponentByCode
  - `// @RequirePermissions('PayrollComponent:update')` - updatePayrollComponent
  - `// @RequirePermissions('PayrollComponent:delete')` - deletePayrollComponent

#### `payroll-cycles.resolver.ts`

- **Class Level**: `@UseGuards(GqlAuthGuard, PermissionsGuard)` ✅
- **All mutations/queries**: Permission decorators are commented out
- **Missing Permissions**:
  - `// @RequirePermissions('PayrollCycle:create')` - createPayrollCycle
  - `// @RequirePermissions('PayrollCycle:read')` - payrollCycles, payrollCycle
  - `// @RequirePermissions('PayrollCycle:approve')` - approvePayrollCycle
  - `// @RequirePermissions('PayrollCycle:process')` - processPayrollCycle
  - `// @RequirePermissions('PayrollCycle:update')` - markPayrollCycleAsPaid
  - `// @RequirePermissions('PayrollCycle:delete')` - cancelPayrollCycle

#### `payroll-items.resolver.ts`

- **Class Level**: `@UseGuards(GqlAuthGuard, PermissionsGuard)` ✅
- **All mutations/queries**: Permission decorators are commented out
- **Missing Permissions**:
  - `// @RequirePermissions('PayrollItem:create')` - createPayrollItem, generatePayrollItems
  - `// @RequirePermissions('PayrollItem:read')` - payrollItems, payrollItemById, payrollItemByUserId
  - `// @RequirePermissions('PayrollItem:update')` - addPayslipAdjustment, markPayrollItemAsPaid
  - `// @RequirePermissions('PayrollItem:approve')` - approvePayrollItem

### 🔶 Attendance, Leave & Holiday Module (All permissions commented out)

#### `attendances.resolver.ts`

- **All operations**: Only `@UseGuards(GqlAuthGuard)`
- **All permissions commented out**:
  - `// @RequirePermissions('Attendance:create')` - createAttendance, createAttendancePunch
  - `// @RequirePermissions('Attendance:read')` - attendances, attendanceById
  - `// @RequirePermissions('Attendance:update')` - updateAttendance, updateAttendancePunch
  - `// @RequirePermissions('Attendance:delete')` - deleteAttendance, removeAttendancePunch

#### `leaves.resolver.ts`

- **All operations**: Only `@UseGuards(GqlAuthGuard)`
- **All permissions commented out**:
  - `// @RequirePermissions('Leave:create')` - createLeave
  - `// @RequirePermissions('Leave:read')` - leaves, leaveById, leaveBalance
  - `// @RequirePermissions('Leave:update')` - updateLeave
  - `// @RequirePermissions('Leave:delete')` - deleteLeave

#### `holidays.resolver.ts`

- **All operations**: Only `@UseGuards(GqlAuthGuard)`
- **All permissions commented out**:
  - `// @RequirePermissions('Holiday:create')` - createHoliday
  - `// @RequirePermissions('Holiday:read')` - holidays, holidayById
  - `// @RequirePermissions('Holiday:update')` - updateHoliday
  - `// @RequirePermissions('Holiday:delete')` - deleteHoliday

### 🔶 Notes & Documents Module (All permissions commented out)

#### `notes.resolver.ts`

- **All operations**: Only `@UseGuards(GqlAuthGuard)`
- **All permissions commented out**:
  - `// @RequirePermissions('Note:create')` - createNote
  - `// @RequirePermissions('Note:read')` - notesByUserId, note
  - `// @RequirePermissions('Note:update')` - updateNote
  - `// @RequirePermissions('Note:delete')` - deleteNote

#### `documents.resolver.ts`

- **All operations**: Only `@UseGuards(GqlAuthGuard)`
- **All permissions commented out**:
  - `// @RequirePermissions('Document:create')` - createDocument
  - `// @RequirePermissions('Document:read')` - documentsByUserId, document
  - `// @RequirePermissions('Document:update')` - updateDocument
  - `// @RequirePermissions('Document:delete')` - deleteDocument

### 🔶 Social Links Module (Mixed implementation)

#### `social-links.resolver.ts`

- **Inconsistent guards**: Some methods have guards, some don't
- **Partially commented out**:
  - `@RequirePermissions('Social Link:create')` - ✅ Active (but missing `@UseGuards`)
  - `// @RequirePermissions('Social Link:read')` - socialLinksByProfileId, socialLink (commented)
  - `// @RequirePermissions('Social Link:update')` - updateSocialLink (commented)
  - `// @RequirePermissions('Social Link:delete')` - deleteSocialLink (commented)

---

## 3. Resolvers with Properly Implemented Permissions ✅

These resolvers have **complete and active** permission implementation:

### ✅ Fully Protected Resolvers

| Resolver                     | Guards | Permissions   | Status          |
| ---------------------------- | ------ | ------------- | --------------- |
| `businesses.resolver.ts`     | ✅ Yes | ✅ All active | Fully protected |
| `designations.resolver.ts`   | ✅ Yes | ✅ All active | Fully protected |
| `job-types.resolver.ts`      | ✅ Yes | ✅ All active | Fully protected |
| `work-schedules.resolver.ts` | ✅ Yes | ✅ All active | Fully protected |
| `work-sites.resolver.ts`     | ✅ Yes | ✅ All active | Fully protected |
| `departments.resolver.ts`    | ✅ Yes | ✅ All active | Fully protected |
| `leave-types.resolver.ts`    | ✅ Yes | ✅ All active | Fully protected |
| `assets.resolver.ts`         | ✅ Yes | ✅ All active | Fully protected |
| `asset-types.resolver.ts`    | ✅ Yes | ✅ All active | Fully protected |
| `projects.resolver.ts`       | ✅ Yes | ✅ All active | Fully protected |

---

## 4. Missing PermissionResource Constants

Comparing resolver permissions with `src/constants/permissions.constant.ts`:

### ❌ Missing from Constants

These resources are **used in resolvers** but **NOT defined** in `PermissionResource` enum:

```typescript
// MISSING in permissions.constant.ts:
PAYROLL_COMPONENT = 'Payroll Component',     // Used in payroll-components.resolver.ts
PAYROLL_CYCLE = 'Payroll Cycle',             // Used in payroll-cycles.resolver.ts
PAYROLL_ITEM = 'Payroll Item',               // Used in payroll-items.resolver.ts
PROFILE = 'Profile',                          // Implied in profiles.resolver.ts
EMERGENCY_CONTACT = 'Emergency Contact',      // Implied in profiles.resolver.ts
EMPLOYMENT_DETAILS = 'Employment Details',    // Implied in profiles.resolver.ts
EDUCATION_HISTORY = 'Education History',      // Implied in education-histories.resolver.ts
JOB_HISTORY = 'Job History',                  // Implied in job-histories.resolver.ts
```

### ✅ Already Defined in Constants

These resources are properly defined in `PermissionResource` enum:

```typescript
// ALREADY DEFINED:
USER = 'User',
BUSINESS = 'Business',
ROLE = 'Role',
PERMISSION = 'Permission',
DESIGNATION = 'Designation',
JOB_TYPE = 'Job Type',
WORK_SITE = 'Work Site',
WORK_SCHEDULE = 'Work Schedule',
DEPARTMENT = 'Department',
LEAVE_TYPE = 'Leave Type',
ASSET_TYPE = 'Asset Type',
ASSET = 'Asset',
PROJECT = 'Project',
PROJECT_MEMBER = 'Project Member',
DOCUMENT = 'Document',
NOTE = 'Note',
SOCIAL_LINK = 'Social Link',
ATTENDANCE = 'Attendance',
LEAVE = 'Leave',
HOLIDAY = 'Holiday',
```

---

## 5. Recommendations

### 🔴 Critical Priority

1. **Add permission guards to `permissions.resolver.ts`**
   - This is a security vulnerability - permission management should be protected
2. **Add permission guards to `roles.resolver.ts`**
   - Role management should be protected by permissions

3. **Add PermissionsGuard to `users.resolver.ts`**
   - User management operations need permission checks

### 🟠 High Priority

4. **Uncomment and activate payroll module permissions**
   - `payroll-components.resolver.ts`
   - `payroll-cycles.resolver.ts`
   - `payroll-items.resolver.ts`

5. **Uncomment and activate attendance/leave/holiday permissions**
   - `attendances.resolver.ts`
   - `leaves.resolver.ts`
   - `holidays.resolver.ts`

6. **Add missing PermissionResource constants**
   ```typescript
   // Add to src/constants/permissions.constant.ts:
   PAYROLL_COMPONENT = 'Payroll Component',
   PAYROLL_CYCLE = 'Payroll Cycle',
   PAYROLL_ITEM = 'Payroll Item',
   PROFILE = 'Profile',
   EDUCATION_HISTORY = 'Education History',
   JOB_HISTORY = 'Job History',
   ```

### 🟡 Medium Priority

7. **Fix inconsistent implementation in `social-links.resolver.ts`**
   - Either add guards or remove `@RequirePermissions` decorator

8. **Add PermissionsGuard to profile-related resolvers**
   - `profiles.resolver.ts`
   - `education-histories.resolver.ts`
   - `job-histories.resolver.ts`

9. **Uncomment permissions in `notes.resolver.ts` and `documents.resolver.ts`**

### 🟢 Low Priority

10. **Standardize guard order across all resolvers**
    - Consistent pattern: `@UseGuards(GqlAuthGuard, PermissionsGuard)`
    - Or use class-level guards when all methods need protection

---

## 6. Summary Statistics

| Category                              | Count | Percentage |
| ------------------------------------- | ----- | ---------- |
| **Total Resolvers Analyzed**          | 42    | 100%       |
| **Fully Protected**                   | 10    | 23.8%      |
| **Partially Protected (commented)**   | 9     | 21.4%      |
| **Only Auth Guard**                   | 6     | 14.3%      |
| **No Guards**                         | 1     | 2.4%       |
| **Not Analyzed (auth, prisma, etc.)** | 16    | 38.1%      |

---

## 7. Implementation Checklist

- [ ] Add `PAYROLL_COMPONENT`, `PAYROLL_CYCLE`, `PAYROLL_ITEM` to `PermissionResource` enum
- [ ] Add `PROFILE`, `EDUCATION_HISTORY`, `JOB_HISTORY` to `PermissionResource` enum
- [ ] Uncomment all payroll permissions
- [ ] Uncomment all attendance/leave/holiday permissions
- [ ] Uncomment notes and documents permissions
- [ ] Add PermissionsGuard to `permissions.resolver.ts`
- [ ] Add PermissionsGuard to `roles.resolver.ts`
- [ ] Add PermissionsGuard to `users.resolver.ts`
- [ ] Add PermissionsGuard to profile-related resolvers
- [ ] Fix `social-links.resolver.ts` guard implementation
- [ ] Create and seed new permissions in database
- [ ] Update role-permission mappings
- [ ] Test all endpoints with new permissions

---

## 8. Code Pattern Reference

### Correct Implementation Pattern

```typescript
@Resolver(() => Entity)
export class EntityResolver {
  // Pattern 1: Class-level guards (when all methods need protection)
  @UseGuards(GqlAuthGuard, PermissionsGuard)

  @Mutation(() => EntityResponse)
  @RequirePermissions('Resource:action')
  async createEntity(...) { ... }

  // Pattern 2: Method-level guards (for selective protection)
  @Mutation(() => EntityResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Resource:action')
  @UseGuards(GqlAuthGuard)
  async updateEntity(...) { ... }
}
```

---

**End of Report**
