import { Prisma } from 'generated/prisma';

/**
 * Seed PayrollComponent records with realistic earnings and deductions
 * Creates 15 records covering common payroll components
 */
export async function seedPayrollComponents(
  prisma: Prisma.TransactionClient,
  businessId: number,
) {
  console.log('🌱 Seeding PayrollComponents...');

  const payrollComponents = [
    // ========== EARNINGS ==========
    {
      name: 'House Rent Allowance',
      code: 'HRA',
      description: 'Monthly house rent allowance provided to employees',
      componentType: 'EARNING',
      calculationType: 'PERCENTAGE_OF_BASIC',
      defaultValue: 40, // 40% of basic salary
      status: 'ACTIVE' as const,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 1,
    },
    {
      name: 'Transport Allowance',
      code: 'TA',
      description: 'Monthly transportation allowance for commuting',
      componentType: 'EARNING',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 5000,
      status: 'ACTIVE' as const,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 2,
    },
    {
      name: 'Medical Allowance',
      code: 'MA',
      description: 'Monthly medical and health allowance',
      componentType: 'EARNING',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 3000,
      status: 'ACTIVE' as const,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 3,
    },
    {
      name: 'Performance Bonus',
      code: 'PERF_BONUS',
      description: 'Performance-based bonus awarded quarterly',
      componentType: 'EARNING',
      calculationType: 'PERCENTAGE_OF_BASIC',
      defaultValue: 10, // 10% of basic salary
      status: 'ACTIVE' as const,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 4,
    },
    {
      name: 'Special Allowance',
      code: 'SPECIAL_ALLOW',
      description: 'Special allowance for additional responsibilities',
      componentType: 'EARNING',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 7500,
      status: 'ACTIVE' as const,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 5,
    },
    {
      name: 'Food Allowance',
      code: 'FOOD_ALLOW',
      description: 'Monthly food and meal allowance',
      componentType: 'EARNING',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 2500,
      status: 'ACTIVE' as const,
      isTaxable: false, // Often tax-exempt up to limit
      isStatutory: false,
      displayOrder: 6,
    },
    {
      name: 'Communication Allowance',
      code: 'COMM_ALLOW',
      description: 'Mobile and communication expense allowance',
      componentType: 'EARNING',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 1500,
      status: 'ACTIVE' as const,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 7,
    },

    // ========== DEDUCTIONS ==========
    {
      name: 'Provident Fund',
      code: 'PF',
      description: 'Employee Provident Fund contribution (EPF)',
      componentType: 'DEDUCTION',
      calculationType: 'PERCENTAGE_OF_BASIC',
      defaultValue: 12, // 12% of basic salary
      status: 'ACTIVE' as const,
      isTaxable: false,
      isStatutory: true, // Statutory deduction
      displayOrder: 8,
    },
    {
      name: 'Professional Tax',
      code: 'PT',
      description: 'State-level professional tax deduction',
      componentType: 'DEDUCTION',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 200,
      status: 'ACTIVE' as const,
      isTaxable: false,
      isStatutory: true,
      displayOrder: 9,
    },
    {
      name: 'Health Insurance',
      code: 'HEALTH_INS',
      description: 'Employee health and medical insurance premium',
      componentType: 'DEDUCTION',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 1500,
      status: 'ACTIVE' as const,
      isTaxable: false,
      isStatutory: false,
      displayOrder: 10,
    },
    {
      name: 'Income Tax (TDS)',
      code: 'TDS',
      description: 'Tax Deducted at Source - Income Tax',
      componentType: 'DEDUCTION',
      calculationType: 'PERCENTAGE_OF_BASIC',
      defaultValue: 10, // Varies by tax slab
      status: 'ACTIVE' as const,
      isTaxable: false,
      isStatutory: true,
      displayOrder: 11,
    },
    {
      name: 'Loan Repayment',
      code: 'LOAN',
      description: 'Employee loan repayment deduction',
      componentType: 'DEDUCTION',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 5000,
      status: 'ACTIVE' as const, // Inactive by default, enabled per employee
      isTaxable: false,
      isStatutory: false,
      displayOrder: 12,
    },
    {
      name: 'Life Insurance',
      code: 'LIFE_INS',
      description: 'Employee life insurance premium deduction',
      componentType: 'DEDUCTION',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 1000,
      status: 'ACTIVE' as const,
      isTaxable: false,
      isStatutory: false,
      displayOrder: 13,
    },
    {
      name: 'Advance Salary Recovery',
      code: 'ADV_RECOVERY',
      description: 'Recovery of advance salary paid to employee',
      componentType: 'DEDUCTION',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 0, // Set per employee as needed
      status: 'ACTIVE' as const,
      isTaxable: false,
      isStatutory: false,
      displayOrder: 14,
    },
    {
      name: 'Late Arrival Penalty',
      code: 'LATE_PENALTY',
      description: 'Deduction for late arrivals or attendance issues',
      componentType: 'DEDUCTION',
      calculationType: 'FIXED_AMOUNT',
      defaultValue: 500,
      status: 'ACTIVE' as const, // Applied as needed
      isTaxable: false,
      isStatutory: false,
      displayOrder: 15,
    },
  ];
  await Promise.all(
    payrollComponents.map((component) =>
      prisma.payrollComponent.upsert({
        where: {
          code_businessId: {
            code: component.code,
            businessId,
          },
        },
        update: {}, // Don't update if exists
        create: {
          ...component,
          businessId,
        },
      }),
    ),
  );

  console.log(
    `✅ Successfully seeded ${payrollComponents.length} PayrollComponents`,
  );
}

/**
 * Main seed function - can be called independently or as part of larger seed
 * Usage: node -e "require('./dist/Database/seeders/payroll-components').seed()"
 */
// export async function seed() {
//   try {
//     // Get the first business to seed components for
//     // In production, you might want to seed for all businesses
//     const business = await prisma.business.findFirst();

//     if (!business) {
//       throw new Error(
//         'No business found. Please seed businesses first before seeding payroll components.',
//       );
//     }

//     await seedPayrollComponents(business.id);

//     console.log('✅ PayrollComponent seeding completed successfully');
//   } catch (error) {
//     console.error('❌ Error seeding PayrollComponents:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }
