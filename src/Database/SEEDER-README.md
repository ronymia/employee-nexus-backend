# Database Seeder Documentation

## Business with Users Seeder

This seeder creates a complete business structure with multiple user roles for testing and development purposes.

### What Gets Created

The seeder creates:

1. **1 Business Owner**
   - Email: `owner@techhive.com`
   - Role: Owner
   - Full access to the business

2. **2 Admins**
   - `admin1@techhive.com`
   - `admin2@techhive.com`
   - Role: Admin
   - Salary: $75,000/month

3. **2 Managers**
   - `manager1@techhive.com`
   - `manager2@techhive.com`
   - Role: Manager
   - Salary: $65,000/month

4. **10 Employees**
   - `employee1@techhive.com` through `employee10@techhive.com`
   - Role: Employee
   - Salary: $50,000/month

5. **4 Development Teams**
   - **Frontend Team** (Manager: David Wilson)
     - 3 Developers assigned (employee1 - employee3)
   - **Backend Team** (Manager: Emily Davis)
     - 3 Developers assigned (employee4 - employee6)
   - **Full Stack Team** (No manager)
     - 3 Developers assigned (employee7 - employee9)
   - **DevOps Team** (No manager)
     - 1 Engineer assigned (employee10)

### Business Details

- **Business Name**: TechHive Solutions
- **Business Email**: info@techhive.com
- **Location**: New York, USA

### User Details Created

All users are created with:

- Profile (name, phone, address, etc.)
- Employee record (employee ID, NID number)
- Designation: Software Developer
- Employment Status: Full Time
- Salary information
- Active status
- Department assignment (for managers and employees)

### Department Structure

**Frontend Team**

- Manager: David Wilson (manager1@techhive.com)
- Members: 3 developers (employee1 - employee3)
- Focus: React, Vue, and modern web technologies
- Status: Active

**Backend Team**

- Manager: Emily Davis (manager2@techhive.com)
- Members: 3 developers (employee4 - employee6)
- Focus: Node.js, APIs, and server-side technologies
- Status: Active

**Full Stack Team**

- Manager: None (managed by admins)
- Members: 3 developers (employee7 - employee9)
- Focus: Both frontend and backend development
- Status: Active

**DevOps Team**

- Manager: None (managed by admins)
- Members: 1 engineer (employee10)
- Focus: CI/CD, cloud infrastructure, and deployment
- Status: Active

### Prerequisites

1. Ensure Docker PostgreSQL is running:

```bash
docker-compose up -d
```

2. Ensure Prisma migrations are applied:

```bash
npx prisma migrate deploy
# or
npx prisma migrate dev
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

### How to Run the Seeder

Run the seeder using the npm script:

```bash
npm run seed:business
```

Or directly with ts-node:

```bash
ts-node -r tsconfig-paths/register src/Database/business-with-users.seeder.ts
```

### Default Passwords

The seeder uses passwords from your `.env` configuration file:

- **Owner**: `DEFAULT_BUSINESS_OWNER_PASS` (default: `BusinessOwner`)
- **Admin**: `DEFAULT_ADMIN_PASS` (default: `AdminPass`)
- **Manager**: `DEFAULT_MANAGER_PASS` (default: `Manager123`)
- **Employee**: `DEFAULT_EMPLOYEE_PASS` (default: `Employee123`)

### Login Credentials

After running the seeder, you can log in with:

**Owner:**

- Email: `owner@techhive.com`
- Password: (from env `DEFAULT_BUSINESS_OWNER_PASS`)

**Admin:**

- Email: `admin1@techhive.com` or `admin2@techhive.com`
- Password: (from env `DEFAULT_ADMIN_PASS`)

**Manager:**

- Email: `manager1@techhive.com` or `manager2@techhive.com`
- Password: (from env `DEFAULT_MANAGER_PASS`)

**Employee:**

- Email: `employee1@techhive.com` through `employee10@techhive.com`
- Password: (from env `DEFAULT_EMPLOYEE_PASS`)

### Database Structure

The seeder creates data in these tables:

- `users` - User accounts
- `profiles` - User profile information
- `businesses` - Business information
- `roles` - Role definitions
- `employees` - Employee records
- `employee_designations` - Job designations
- `employee_statuses` - Employment statuses
- `employee_salaries` - Salary information
- `designations` - Designation master data
- `employment_statuses` - Employment status master data
- `departments` - Department information with manager assignments
- `employee_departments` - Employee-department assignments with roles

### Troubleshooting

**Error: "Table does not exist"**

- Make sure to run Prisma migrations first:
  ```bash
  npx prisma migrate deploy
  ```

**Error: "Unique constraint violation"**

- The seeder can only be run once as it creates unique email addresses
- To run again, either:
  1. Clear the database: `npx prisma migrate reset`
  2. Modify the email addresses in the seeder

**Error: "Cannot find module"**

- Ensure Prisma Client is generated:
  ```bash
  npx prisma generate
  ```

### Customization

To customize the seeder, edit [src/Database/business-with-users.seeder.ts](src/Database/business-with-users.seeder.ts):

- Change business name, email, address
- Modify user data (names, emails, phones)
- Adjust salary amounts
- Change employee counts
- Update roles and permissions

### Notes

- All users are created with `ACTIVE` status
- All employees have a joining date of their respective start dates
- Employee IDs follow format: `TH-XXX-###`
- NID numbers follow format: `NID-XXX-###`
- The seeder uses transactions to ensure data consistency
