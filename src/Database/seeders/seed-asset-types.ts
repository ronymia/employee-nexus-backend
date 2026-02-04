/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prisma } from '@prisma/client';

/**
 * Seed asset types for the business
 */
export async function seedAssetTypes(
  prisma: Prisma.TransactionClient,
  businessId: number,
): Promise<Array<{ id: number; name: string; description: string }>> {
  const assetTypesData = [
    {
      name: 'Laptop',
      description: 'Portable computer for work and development',
      status: 'ACTIVE',
    },
    {
      name: 'Desktop Computer',
      description: 'Stationary computer workstation',
      status: 'ACTIVE',
    },
    {
      name: 'Monitor',
      description: 'Display screen for computers',
      status: 'ACTIVE',
    },
    {
      name: 'Keyboard',
      description: 'Input device for typing',
      status: 'ACTIVE',
    },
    {
      name: 'Mouse',
      description: 'Pointing device for computer interaction',
      status: 'ACTIVE',
    },
    {
      name: 'Mobile Phone',
      description: 'Smartphone for communication and work',
      status: 'ACTIVE',
    },
    {
      name: 'Headset',
      description: 'Audio device for calls and meetings',
      status: 'ACTIVE',
    },
    {
      name: 'Webcam',
      description: 'Camera device for video conferencing',
      status: 'ACTIVE',
    },
    {
      name: 'Printer',
      description: 'Device for printing documents',
      status: 'ACTIVE',
    },
    {
      name: 'Router',
      description: 'Network device for internet connectivity',
      status: 'ACTIVE',
    },
  ];

  const createdAssetTypes: Array<{
    id: number;
    name: string;
    description: string;
  }> = [];

  for (const assetTypeData of assetTypesData) {
    const assetType = await prisma.assetType.create({
      data: {
        ...assetTypeData,
        businessId,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    createdAssetTypes.push(assetType);
  }

  return createdAssetTypes;
}
