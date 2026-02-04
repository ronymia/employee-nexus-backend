/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

/**
 * Seed asset assignments to employees
 */
export async function seedAssetAssignments(
  prisma: Prisma.TransactionClient,
  assets: Array<{
    id: number;
    name: string;
    code: string;
    assetTypeId: number;
  }>,
  employeeUserIds: number[],
  adminUserId: number,
): Promise<Array<{ id: number; assetId: number; assignedTo: number }>> {
  // Helper to find asset by code
  const getAssetByCode = (code: string) => {
    const asset = assets.find((a) => a.code === code);
    if (!asset) {
      throw new Error(`Asset with code ${code} not found`);
    }
    return asset;
  };

  // Asset assignments: assign assets to employees
  // Format: { assetCode, employeeIndex (0-19 for 20 employees), assignedAt }
  const assignmentsData = [
    // Laptops - assign to first 5 employees
    {
      assetCode: 'LAP-001',
      employeeIndex: 0,
      assignedAt: dayjs.utc('2023-01-20').toISOString(),
    },
    {
      assetCode: 'LAP-002',
      employeeIndex: 1,
      assignedAt: dayjs.utc('2023-02-25').toISOString(),
    },
    {
      assetCode: 'LAP-003',
      employeeIndex: 2,
      assignedAt: dayjs.utc('2023-03-15').toISOString(),
    },
    {
      assetCode: 'LAP-004',
      employeeIndex: 3,
      assignedAt: dayjs.utc('2023-04-10').toISOString(),
    },
    {
      assetCode: 'LAP-005',
      employeeIndex: 4,
      assignedAt: dayjs.utc('2023-05-18').toISOString(),
    },

    // Monitors - assign to first 3 employees
    {
      assetCode: 'MON-001',
      employeeIndex: 0,
      assignedAt: dayjs.utc('2023-01-22').toISOString(),
    },
    {
      assetCode: 'MON-002',
      employeeIndex: 1,
      assignedAt: dayjs.utc('2023-02-20').toISOString(),
    },
    {
      assetCode: 'MON-003',
      employeeIndex: 2,
      assignedAt: dayjs.utc('2023-03-25').toISOString(),
    },

    // Mobile Phones - assign to employees 5, 6, 7
    {
      assetCode: 'PHN-001',
      employeeIndex: 5,
      assignedAt: dayjs.utc('2023-02-05').toISOString(),
    },
    {
      assetCode: 'PHN-002',
      employeeIndex: 6,
      assignedAt: dayjs.utc('2023-02-15').toISOString(),
    },
    {
      assetCode: 'PHN-003',
      employeeIndex: 7,
      assignedAt: dayjs.utc('2023-03-10').toISOString(),
    },

    // Keyboards - assign to first 2 employees
    {
      assetCode: 'KBD-001',
      employeeIndex: 0,
      assignedAt: dayjs.utc('2023-01-26').toISOString(),
    },
    {
      assetCode: 'KBD-002',
      employeeIndex: 1,
      assignedAt: dayjs.utc('2023-02-10').toISOString(),
    },

    // Mice - assign to first 2 employees
    {
      assetCode: 'MSE-001',
      employeeIndex: 0,
      assignedAt: dayjs.utc('2023-01-30').toISOString(),
    },
    {
      assetCode: 'MSE-002',
      employeeIndex: 1,
      assignedAt: dayjs.utc('2023-02-12').toISOString(),
    },

    // Headsets - assign to employees 3, 4
    {
      assetCode: 'HDS-001',
      employeeIndex: 3,
      assignedAt: dayjs.utc('2023-02-18').toISOString(),
    },
    {
      assetCode: 'HDS-002',
      employeeIndex: 4,
      assignedAt: dayjs.utc('2023-03-20').toISOString(),
    },
  ];

  const createdAssignments: Array<{
    id: number;
    assetId: number;
    assignedTo: number;
  }> = [];

  for (const assignmentData of assignmentsData) {
    const asset = getAssetByCode(assignmentData.assetCode);
    const employeeUserId = employeeUserIds[assignmentData.employeeIndex];

    if (!employeeUserId) {
      console.warn(
        `Employee at index ${assignmentData.employeeIndex} not found, skipping asset ${assignmentData.assetCode}`,
      );
      continue;
    }

    const assignment = await prisma.assetAssignment.create({
      data: {
        assetId: asset.id,
        assignedTo: employeeUserId,
        assignedBy: adminUserId, // Admin assigns the assets
        assignedAt: assignmentData.assignedAt,
        status: 'assigned',
        note: `Assigned ${asset.name} to employee`,
      },
      select: {
        id: true,
        assetId: true,
        assignedTo: true,
      },
    });

    createdAssignments.push(assignment);
  }

  return createdAssignments;
}
