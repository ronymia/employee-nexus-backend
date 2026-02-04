# Employee Nexus Backend - AI Coding Guide

## Architecture Overview

**Stack:** NestJS 11 + GraphQL (Apollo) + Prisma 6.12 + PostgreSQL 17

This is a multi-tenant employee management system with complex payroll, attendance, leave, and project management capabilities. Each business operates independently with role-based permissions.

## Key Patterns & Conventions

### Module Structure (50+ modules in `src/modules/`)

Every module follows this structure:

```
module-name/
  ├── module-name.service.ts      # Business logic
  ├── module-name.resolver.ts     # GraphQL endpoints
  ├── module-name.module.ts       # DI container
  ├── entities/                   # GraphQL types
  ├── dto/                        # Input types
  └── enums/                      # Status enums
```

### Database & Transactions

- **Prisma ORM** with generated client in `generated/prisma/`
- **Always use transactions** for multi-step operations (e.g., payroll generation, item deletion)
- **Update aggregates**: When modifying PayrollItems, update PayrollCycle totals (totalGrossPay, totalDeductions, totalNetPay, totalEmployees)
- **Composite keys** for assignments: `{userId}__{resourceId}` (e.g., `payrollCycleId_userId`)

### Circular Dependencies

Use `forwardRef()` pattern for bidirectional service dependencies:

```typescript
@Inject(forwardRef(() => PayrollCyclesService))
private readonly payrollCyclesService: PayrollCyclesService
```

Also apply in module imports: `forwardRef(() => PayrollCyclesModule)`

### Authentication & Permissions

- JWT-based auth with `@CurrentUser()` decorator for `JwtPayload` (includes `userId`, `businessId`)
- Permission guards: `@RequirePermissions('Resource:action')` (e.g., `'Payroll Cycle:update'`)
- Business isolation: Always filter by `user.businessId` in queries
- Role configs in `src/config/*Permission.config.ts` (owner, admin, manager, employee)

### GraphQL Response Pattern

All mutations return standardized response:

```typescript
{
  success: boolean;
  statusCode: HttpStatus;
  message: string;
  data: T;
}
```

## Critical Workflows

### Payroll Processing (3-stage workflow)

1. **Process** (`DRAFT` → `PROCESSING`): Creates PayrollItems for all active employees via transaction
2. **Approve Items**: Bulk approve pending items + link PayslipAdjustments by period/user
3. **Approve Cycle** (`PROCESSING` → `APPROVED`): Validates all items approved before allowing

### Payroll Calculations (8 steps in `PayrollItemsService.createPayrollItem`)

1. Get active salary (userId, isActive=true)
2. Get approved attendances (statuses: present, late, half_day, approved)
3. Count absent days (status='absent')
4. Get approved leaves (totalMinutes for leave days)
5. Calculate working days from WorkSchedule (excludes `isWeekend=true` days)
6. Calculate overtime (overtimeMinutes from attendances)
7. Get active PayrollComponents (effectiveFrom/To date range, EARNING/DEDUCTION types)
8. Get approved PayslipAdjustments (APPROVED status, matches period or recurring)

**Formula:**

```typescript
grossPay = basicSalary + earnings + adjustmentEarnings + overtimePay;
netPay = grossPay - totalDeductions - adjustmentDeductions;
// Note: Tax calculation not yet implemented (see PAYROLL_IMPLEMENTATION_GUIDE.md)
```

### Assignment Modules Pattern

Employee assignments (departments, designations, work schedules, work sites, employment status) use:

- **Composite unique keys**: `@@unique([userId, resourceId])`
- **isActive flag**: Only one active per employee at a time
- **effectiveFrom/To dates**: For salary history and component tracking
- **Update operations**: Always verify businessId and handle isActive toggle

### Seeding & Database Setup

- `yarn seed:business` - Seeds complete business with users, roles, permissions
- Prisma migrations in `prisma/migrations/` - Never modify manually
- Default system data via seeders in `src/Database/`

## Common Operations

### Adding a New Resolver Endpoint

1. Create DTO in `dto/` with `@InputType()` decorator
2. Add method to service with business logic
3. Create resolver method with `@Mutation()` or `@Query()`
4. Add permission guard: `@RequirePermissions('Resource:action')`
5. Return standardized response object

### Working with Dates

- Use `DateTime` fields as `Date` types in Prisma
- Store dates as ISO strings: `new Date().toISOString()`
- Period queries use `gte`/`lte` for inclusive ranges
- Handle recurring items (holidays, adjustments) with `OR` conditions

### Error Handling

- Use `findUniqueOrThrow()` for required records
- Throw descriptive errors: `throw new Error('Specific reason with context')`
- Validate status transitions explicitly (e.g., `DRAFT` → `PROCESSING` only)

## Testing & Development

- **Dev mode:** `yarn start:dev` (watch mode with hot reload)
- **GraphQL Playground:** `http://localhost:3000/graphql` (auto-generated from schema)
- **Database Studio:** `npx prisma studio` (visual DB browser)
- Schema generation: `prisma generate` (runs on postinstall)

## Critical Files

- `src/schema.gql` - Generated GraphQL schema (don't edit manually)
- `prisma/schema.prisma` - Database schema (single source of truth)
- `src/config/permission.config.ts` - All available permissions
- `PAYROLL_IMPLEMENTATION_GUIDE.md` - Known issues + tax implementation guide
