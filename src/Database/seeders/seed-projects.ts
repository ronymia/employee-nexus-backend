import { Prisma } from 'generated/prisma';

/**
 * Seeds 5 demo projects for the business
 */
export const seedProjects = async (
  tx: Prisma.TransactionClient,
  businessId: number,
  creatorId: number,
) => {
  console.log('   📁 Creating 5 projects...');

  const projects = await Promise.all([
    // Project 1: E-commerce Website
    tx.project.create({
      data: {
        name: 'E-commerce Platform Redesign',
        description:
          'Complete redesign of the company e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.',
        status: 'ACTIVE',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        businessId,
        createdBy: creatorId,
      },
    }),

    // Project 2: Mobile App Development
    tx.project.create({
      data: {
        name: 'Customer Mobile Application',
        description:
          'Native iOS and Android mobile application for customer engagement, featuring push notifications, in-app purchases, and real-time tracking.',
        status: 'ACTIVE',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        businessId,
        createdBy: creatorId,
      },
    }),

    // Project 3: Internal CRM System
    tx.project.create({
      data: {
        name: 'Internal CRM System',
        description:
          'Custom CRM system for managing customer relationships, sales pipeline, and support tickets with advanced analytics and reporting.',
        status: 'ACTIVE',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-12-31'),
        businessId,
        createdBy: creatorId,
      },
    }),

    // Project 4: DevOps Infrastructure
    tx.project.create({
      data: {
        name: 'Cloud Infrastructure Migration',
        description:
          'Migration of legacy infrastructure to cloud-based Kubernetes cluster with CI/CD pipelines, monitoring, and automated scaling.',
        status: 'ACTIVE',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-09-30'),
        businessId,
        createdBy: creatorId,
      },
    }),

    // Project 5: AI Integration
    tx.project.create({
      data: {
        name: 'AI-Powered Analytics Dashboard',
        description:
          'Integration of machine learning models for predictive analytics, customer behavior analysis, and automated reporting dashboard.',
        status: 'PLANNING',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-11-30'),
        businessId,
        createdBy: creatorId,
      },
    }),
  ]);

  console.log(`   ✅ Created ${projects.length} projects`);
  return projects;
};
