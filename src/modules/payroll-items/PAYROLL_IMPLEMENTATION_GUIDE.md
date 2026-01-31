# Payroll Implementation Guide

## Table of Contents

1. [Current Implementation Status](#current-implementation-status)
2. [Key Concepts](#key-concepts)
3. [Current Issues](#current-issues)
4. [Tax Implementation Guide](#tax-implementation-guide)
5. [Complete Example](#complete-example)

---

## Current Implementation Status

### ✅ Working Correctly

- Weekend exclusion using `!daySchedule.isWeekend`
- Overtime calculation: `(overtimeMinutes / 60) * overtimeRate`
- Filtering approved attendances: `['present', 'late', 'half_day', 'approved']`
- Active payroll components fetching
- Active adjustments handling
- Pro-rated salary calculation

### ⚠️ Issues Found

1. **Present Days Calculation** - Not handling `half_day` correctly
2. **Leave Days Calculation** - Not using `totalMinutes` field
3. **Tax Calculation** - Missing completely (critical)

---

## Key Concepts

### 1. attendanceRatio

**Definition:** The percentage of working days an employee was present.

```typescript
const attendanceRatio = presentDays / (workingDays || 1);
```

**Example:**

```
Working Days in Month: 22 days
Present Days: 20 days
Absent Days: 2 days

attendanceRatio = 20 / 22 = 0.909 (90.9%)
```

**Purpose:** Used to calculate pro-rated salary when employee has absences.

---

### 2. proRatedBasicSalary

**Definition:** The adjusted basic salary based on actual attendance.

```typescript
const proRatedBasicSalary = basicSalary * attendanceRatio;
```

**Example:**

```
Basic Salary: 60,000 BDT/month
Attendance Ratio: 0.909 (90.9%)

proRatedBasicSalary = 60,000 × 0.909 = 54,540 BDT
```

**Why Pro-rate?**

- Employee was absent 2 days without pay
- Should only receive salary for days worked
- Fair compensation based on actual attendance

**Complete Example:**

```
Scenario:
- Employee: John Doe
- Monthly Salary: 60,000 BDT
- Month: January 2026
- Working Days: 22 days (excluding weekends)
- Present Days: 18 days
- Absent Days: 2 days (unpaid)
- Approved Leave: 2 days (paid)

Calculation:
presentDays = 18
attendanceRatio = 18 / 22 = 0.818 (81.8%)
proRatedBasicSalary = 60,000 × 0.818 = 49,080 BDT

Final Salary = 49,080 BDT (instead of 60,000 BDT)
Lost Amount = 10,920 BDT (due to 2 unpaid absences + 2 paid leaves)
```

---

## Current Issues

### Issue 1: Present Days Calculation

**Current Code (WRONG):**

```typescript
const presentDays = attendances.length;
```

**Problem:**

- Counts all attendance records equally
- `half_day` should count as 0.5, not 1
- Inflates present days count

**Fix Required:**

```typescript
let presentDays = 0;
for (const attendance of attendances) {
  if (
    attendance.status === 'present' ||
    attendance.status === 'late' ||
    attendance.status === 'approved'
  ) {
    presentDays += 1;
  } else if (attendance.status === 'half_day') {
    presentDays += 0.5; // ← This is the fix
  }
}
```

**Example Impact:**

```
Scenario: 20 full days + 2 half days

Current (Wrong): presentDays = 22
Correct: presentDays = 20 + (2 × 0.5) = 21

Salary Difference:
Wrong: 60,000 × (22/22) = 60,000
Correct: 60,000 × (21/22) = 57,273
Overpayment: 2,727 BDT!
```

---

### Issue 2: Leave Days Calculation

**Current Code (WRONG):**

```typescript
const leaveDays = approvedLeaves.length;
```

**Problem:**

- Counts number of leave records, not actual days
- Ignores `totalMinutes` field from database
- One leave can span multiple days

**Fix Required:**

```typescript
let leaveDays = 0;
for (const leave of approvedLeaves) {
  // Convert minutes to days (480 minutes = 8 hours = 1 day)
  leaveDays += leave.totalMinutes / 480;
}
```

**Example Impact:**

```
Scenario: Employee has 1 leave record spanning 3 days

Database:
- Leave 1: startDate: Jan 10, endDate: Jan 12, totalMinutes: 1440

Current (Wrong): leaveDays = 1 (record count)
Correct: leaveDays = 1440 / 480 = 3 days

This affects leave balance deduction!
```

---

### Issue 3: Tax Calculation (CRITICAL)

**Current Status:** NOT IMPLEMENTED

**Required:** Tax calculation based on `isTaxable` flag in payroll components.

---

## Tax Implementation Guide

### Step 1: Understanding Tax Requirements

**Your Schema Has:**

```typescript
PayrollComponent {
  isTaxable: boolean  // ← Indicates if component should be taxed
  componentType: 'EARNING' | 'DEDUCTION'
}
```

**Tax Logic:**

1. Sum all **taxable earnings** (where `isTaxable = true`)
2. Calculate tax based on government tax slabs
3. Add tax as a **deduction**

---

### Step 2: Calculate Taxable Income

Add this code in `generatePayrollItem()` method, after calculating earnings:

```typescript
// Calculate taxable income
let taxableIncome = proRatedBasicSalary; // Basic salary is always taxable

// Add taxable earnings from components
for (const empComponent of activePayrollComponents) {
  const component = empComponent.payrollComponent;
  const componentValue = empComponent.value ?? component.defaultValue ?? 0;

  let calculatedAmount = 0;

  // ... existing calculation logic ...

  // Track taxable earnings
  if (component.componentType === 'EARNING' && component.isTaxable) {
    taxableIncome += calculatedAmount;
  }
}

// Add taxable adjustments
for (const adjustment of activeAdjustments) {
  if (adjustment.payrollComponent?.componentType === 'EARNING') {
    // Assume adjustments are taxable (or add isTaxable to PayslipAdjustment table)
    taxableIncome += adjustment.value;
  }
}

// Add overtime (usually taxable)
taxableIncome += overtimePay;
```

---

### Step 3: Implement Tax Calculation Method

Add this private method to your service:

```typescript
/**
 * Calculate monthly income tax based on Bangladesh tax slabs
 * Update tax rates according to your country's tax law
 */
private calculateMonthlyIncomeTax(monthlyTaxableIncome: number): number {
  // Annualize the income
  const annualIncome = monthlyTaxableIncome * 12;

  let annualTax = 0;

  // Bangladesh Tax Slabs (Financial Year 2024-25)
  // Update these values according to your country

  if (annualIncome <= 350000) {
    // First 3,50,000 BDT: Tax Free
    annualTax = 0;
  }
  else if (annualIncome <= 450000) {
    // Next 1,00,000 BDT: 5%
    annualTax = (annualIncome - 350000) * 0.05;
  }
  else if (annualIncome <= 750000) {
    // Next 3,00,000 BDT: 10%
    annualTax = 5000 + (annualIncome - 450000) * 0.10;
  }
  else if (annualIncome <= 1150000) {
    // Next 4,00,000 BDT: 15%
    annualTax = 35000 + (annualIncome - 750000) * 0.15;
  }
  else if (annualIncome <= 1650000) {
    // Next 5,00,000 BDT: 20%
    annualTax = 95000 + (annualIncome - 1150000) * 0.20;
  }
  else {
    // Above 16,50,000 BDT: 25%
    annualTax = 195000 + (annualIncome - 1650000) * 0.25;
  }

  // Convert to monthly and round
  const monthlyTax = Math.round(annualTax / 12);

  return monthlyTax;
}
```

---

### Step 4: Apply Tax in Final Calculation

Update the final calculation in `generatePayrollItem()`:

```typescript
// Calculate income tax
const incomeTax = this.calculateMonthlyIncomeTax(taxableIncome);

// Update total deductions to include tax
const totalDeductions = deductions + adjustmentDeductions + incomeTax;

// Calculate net pay
const netPay = grossPay - totalDeductions;
```

---

## Complete Example

### Scenario

```
Employee: Ahmed Hassan
Base Salary: 80,000 BDT/month
Month: January 2026

Working Days: 22 days
Present Days: 20 days
Half Days: 2 days
Absent Days: 0 days
Leave Days: 1.5 days (720 minutes)
Overtime: 300 minutes (5 hours)

Payroll Components:
1. House Rent Allowance: 20,000 BDT (EARNING, Taxable)
2. Medical Allowance: 5,000 BDT (EARNING, Non-Taxable)
3. Transport Allowance: 3,000 BDT (EARNING, Taxable)
4. Provident Fund: 8% of Basic (DEDUCTION, Non-Taxable)

Overtime Rate: 100 BDT/hour
```

### Calculation Breakdown

#### Step 1: Attendance Calculation

```typescript
workingDays = 22
presentDays = 20 + (2 × 0.5) = 21 days
attendanceRatio = 21 / 22 = 0.9545 (95.45%)
```

#### Step 2: Pro-rated Basic Salary

```typescript
proRatedBasicSalary = 80,000 × 0.9545 = 76,360 BDT
```

#### Step 3: Earnings Calculation

```typescript
// Components
houseRent = 20,000 (taxable)
medical = 5,000 (non-taxable)
transport = 3,000 (taxable)
totalComponentEarnings = 28,000

// Overtime
overtimeHours = 300 / 60 = 5 hours
overtimePay = 5 × 100 = 500 BDT (taxable)

// Total Earnings
grossPay = proRatedBasicSalary + totalComponentEarnings + overtimePay
grossPay = 76,360 + 28,000 + 500 = 104,860 BDT
```

#### Step 4: Deductions Calculation

```typescript
// Provident Fund
providentFund = 80,000 × 0.08 = 6,400 BDT (non-taxable deduction)
```

#### Step 5: Tax Calculation

```typescript
// Taxable Income
taxableIncome = proRatedBasicSalary + houseRent + transport + overtimePay
taxableIncome = 76,360 + 20,000 + 3,000 + 500 = 99,860 BDT/month
annualTaxableIncome = 99,860 × 12 = 1,198,320 BDT

// Apply Tax Slabs
slab1 = 0 (first 350,000)
slab2 = (450,000 - 350,000) × 0.05 = 5,000
slab3 = (750,000 - 450,000) × 0.10 = 30,000
slab4 = (1,150,000 - 750,000) × 0.15 = 60,000
slab5 = (1,198,320 - 1,150,000) × 0.20 = 9,664

annualTax = 5,000 + 30,000 + 60,000 + 9,664 = 104,664 BDT
monthlyTax = 104,664 / 12 = 8,722 BDT
```

#### Step 6: Net Pay Calculation

```typescript
totalDeductions = providentFund + monthlyTax
totalDeductions = 6,400 + 8,722 = 15,122 BDT

netPay = grossPay - totalDeductions
netPay = 104,860 - 15,122 = 89,738 BDT
```

### Final Payslip

```
====================================
        PAYSLIP - JANUARY 2026
====================================
Employee: Ahmed Hassan
Employee ID: EMS-0001
Salary: 80,000 BDT/month

ATTENDANCE
Working Days: 22
Present Days: 21 (including 2 half days)
Leave Days: 1.5
Overtime: 5 hours

EARNINGS
Pro-rated Basic Salary:     76,360 BDT
House Rent Allowance:        20,000 BDT
Medical Allowance:            5,000 BDT
Transport Allowance:          3,000 BDT
Overtime Pay:                   500 BDT
                           -----------
Gross Pay:                  104,860 BDT

DEDUCTIONS
Provident Fund (8%):          6,400 BDT
Income Tax:                   8,722 BDT
                           -----------
Total Deductions:            15,122 BDT

====================================
NET PAY:                     89,738 BDT
====================================
```

---

## Implementation Checklist

### Phase 1: Fix Current Issues

- [ ] Fix `presentDays` calculation to handle `half_day`
- [ ] Fix `leaveDays` calculation to use `totalMinutes`
- [ ] Test with sample data to verify calculations

### Phase 2: Implement Tax

- [ ] Add `calculateMonthlyIncomeTax()` method
- [ ] Update `generatePayrollItem()` to calculate taxable income
- [ ] Apply tax in total deductions
- [ ] Test with different salary brackets

### Phase 3: Tax Configuration

- [ ] Consider moving tax slabs to database (SystemDefaults table)
- [ ] Add tax configuration for different countries
- [ ] Allow manual tax overrides for special cases

### Phase 4: Enhancements

- [ ] Add holiday exclusion from working days calculation
- [ ] Handle unpaid leaves differently from paid leaves
- [ ] Add tax rebate/exemption support
- [ ] Generate detailed payslip breakdown

---

## Database Schema Considerations

### Option 1: Add Tax Configuration Table

```sql
CREATE TABLE tax_slabs (
  id SERIAL PRIMARY KEY,
  country VARCHAR(50),
  min_amount DECIMAL(10, 2),
  max_amount DECIMAL(10, 2),
  tax_rate DECIMAL(5, 2),
  fixed_amount DECIMAL(10, 2),
  effective_from DATE,
  effective_to DATE
);
```

### Option 2: Add Tax Fields to PayrollItem

```sql
ALTER TABLE payroll_items ADD COLUMN taxable_income DECIMAL(10, 2);
ALTER TABLE payroll_items ADD COLUMN income_tax DECIMAL(10, 2);
```

---

## Testing Scenarios

### Test Case 1: Full Month Attendance

- Present: 22 days, Absent: 0, Leave: 0
- Expected: Full salary + components

### Test Case 2: Partial Attendance

- Present: 18 days, Absent: 2, Leave: 2
- Expected: Pro-rated salary based on 18/22

### Test Case 3: Half Days

- Present: 18 full + 2 half days
- Expected: Present = 19, Pro-rate = 19/22

### Test Case 4: Tax Brackets

- Test with salaries: 30k, 50k, 80k, 120k, 180k
- Verify correct tax slab application

### Test Case 5: Non-Taxable Components

- Add medical allowance (non-taxable)
- Verify it's excluded from tax calculation

---

## Important Notes

1. **Tax Year vs Fiscal Year:** Ensure you're using the correct period for tax calculations
2. **Rounding:** Always round tax amounts to nearest whole number
3. **Tax Rebates:** Consider implementing tax rebates for investments, insurance, etc.
4. **Regional Variations:** Tax rules vary by state/province in some countries
5. **Audit Trail:** Log all tax calculations for audit purposes

---

## References

- Bangladesh Tax Rates: https://nbr.gov.bd/
- Payroll Best Practices: https://www.shrm.org/
- Tax Calculation Methods: Consult with local tax consultant

---

**Last Updated:** January 31, 2026
**Author:** Development Team
**Version:** 1.0
