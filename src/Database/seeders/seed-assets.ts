/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prisma } from '@prisma/client';

/**
 * Seed assets for the business
 */
export async function seedAssets(
  prisma: Prisma.TransactionClient,
  businessId: number,
  assetTypes: Array<{ id: number; name: string; description: string }>,
): Promise<
  Array<{ id: number; name: string; code: string; assetTypeId: number }>
> {
  // Helper to find asset type ID by name
  const getAssetTypeId = (name: string): number => {
    const assetType = assetTypes.find((at) => at.name === name);
    if (!assetType) {
      throw new Error(`Asset type ${name} not found`);
    }
    return assetType.id;
  };

  const assetsData = [
    // Laptops
    {
      name: 'MacBook Pro 16" 2023',
      code: 'LAP-001',
      date: new Date('2023-01-15'),
      assetTypeName: 'Laptop',
      note: 'High-performance laptop for development',
      status: 'assigned',
    },
    {
      name: 'Dell XPS 15',
      code: 'LAP-002',
      date: new Date('2023-02-20'),
      assetTypeName: 'Laptop',
      note: 'Developer workstation',
      status: 'assigned',
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      code: 'LAP-003',
      date: new Date('2023-03-10'),
      assetTypeName: 'Laptop',
      note: 'Portable business laptop',
      status: 'assigned',
    },
    {
      name: 'MacBook Air M2',
      code: 'LAP-004',
      date: new Date('2023-04-05'),
      assetTypeName: 'Laptop',
      note: 'Lightweight laptop for managers',
      status: 'assigned',
    },
    {
      name: 'HP EliteBook 840',
      code: 'LAP-005',
      date: new Date('2023-05-12'),
      assetTypeName: 'Laptop',
      note: 'Business laptop',
      status: 'assigned',
    },

    // Monitors
    {
      name: 'Dell UltraSharp 27" 4K',
      code: 'MON-001',
      date: new Date('2023-01-20'),
      assetTypeName: 'Monitor',
      note: '4K display for developers',
      status: 'assigned',
    },
    {
      name: 'LG 34" Ultrawide',
      code: 'MON-002',
      date: new Date('2023-02-15'),
      assetTypeName: 'Monitor',
      note: 'Ultrawide monitor for multitasking',
      status: 'assigned',
    },
    {
      name: 'Samsung 32" Curved',
      code: 'MON-003',
      date: new Date('2023-03-20'),
      assetTypeName: 'Monitor',
      note: 'Curved display for comfortable viewing',
      status: 'assigned',
    },

    // Mobile Phones
    {
      name: 'iPhone 14 Pro',
      code: 'PHN-001',
      date: new Date('2023-02-01'),
      assetTypeName: 'Mobile Phone',
      note: 'Company phone for executives',
      status: 'assigned',
    },
    {
      name: 'Samsung Galaxy S23',
      code: 'PHN-002',
      date: new Date('2023-02-10'),
      assetTypeName: 'Mobile Phone',
      note: 'Company phone for managers',
      status: 'assigned',
    },
    {
      name: 'iPhone 13',
      code: 'PHN-003',
      date: new Date('2023-03-05'),
      assetTypeName: 'Mobile Phone',
      note: 'Company phone for team leads',
      status: 'assigned',
    },

    // Keyboards
    {
      name: 'Apple Magic Keyboard',
      code: 'KBD-001',
      date: new Date('2023-01-25'),
      assetTypeName: 'Keyboard',
      note: 'Wireless keyboard for Mac users',
      status: 'assigned',
    },
    {
      name: 'Logitech MX Keys',
      code: 'KBD-002',
      date: new Date('2023-02-05'),
      assetTypeName: 'Keyboard',
      note: 'Mechanical keyboard for developers',
      status: 'assigned',
    },

    // Mice
    {
      name: 'Logitech MX Master 3',
      code: 'MSE-001',
      date: new Date('2023-01-28'),
      assetTypeName: 'Mouse',
      note: 'Ergonomic wireless mouse',
      status: 'assigned',
    },
    {
      name: 'Apple Magic Mouse',
      code: 'MSE-002',
      date: new Date('2023-02-08'),
      assetTypeName: 'Mouse',
      note: 'Wireless mouse for Mac users',
      status: 'assigned',
    },

    // Headsets
    {
      name: 'Sony WH-1000XM5',
      code: 'HDS-001',
      date: new Date('2023-02-12'),
      assetTypeName: 'Headset',
      note: 'Noise-canceling headphones for focus',
      status: 'assigned',
    },
    {
      name: 'Jabra Elite 85h',
      code: 'HDS-002',
      date: new Date('2023-03-15'),
      assetTypeName: 'Headset',
      note: 'Wireless headset for calls',
      status: 'assigned',
    },
    {
      name: 'Logitech H390',
      code: 'HDS-003',
      date: new Date('2023-04-10'),
      assetTypeName: 'Headset',
      note: 'USB headset for video meetings',
      status: 'unassigned',
    },

    // Webcams
    {
      name: 'Logitech C920',
      code: 'CAM-001',
      date: new Date('2023-03-01'),
      assetTypeName: 'Webcam',
      note: 'HD webcam for remote meetings',
      status: 'unassigned',
    },
    {
      name: 'Razer Kiyo Pro',
      code: 'CAM-002',
      date: new Date('2023-03-20'),
      assetTypeName: 'Webcam',
      note: 'Professional webcam with ring light',
      status: 'unassigned',
    },

    // Printer
    {
      name: 'HP LaserJet Pro',
      code: 'PRT-001',
      date: new Date('2023-01-10'),
      assetTypeName: 'Printer',
      note: 'Office printer for documents',
      status: 'unassigned',
    },
  ];

  const createdAssets: Array<{
    id: number;
    name: string;
    code: string;
    assetTypeId: number;
  }> = [];

  for (const assetData of assetsData) {
    const { assetTypeName, ...data } = assetData;
    const asset = await prisma.asset.create({
      data: {
        ...data,
        assetTypeId: getAssetTypeId(assetTypeName),
        businessId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        assetTypeId: true,
      },
    });

    createdAssets.push(asset);
  }

  return createdAssets;
}
