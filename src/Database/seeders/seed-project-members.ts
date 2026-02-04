/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Prisma } from 'generated/prisma';

/**
 * Seeds project member assignments for demo business
 * Assigns employees to projects with various roles
 */
export async function seedProjectMembers(
  tx: Prisma.TransactionClient,
  projects: any[],
  employees: any[],
): Promise<any[]> {
  console.log('\n📋 Seeding project members...');

  const projectMemberAssignments: Array<{
    projectId: number;
    userId: number;
    role: string;
    startDate: Date;
    isActive: boolean;
  }> = [
    // Project 1: E-commerce Platform Redesign (8 members)
    {
      projectId: projects[0].id,
      userId: employees[0].id, // employee1
      role: 'Project Manager',
      startDate: new Date('2024-01-15'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[1].id, // employee2
      role: 'Team Lead',
      startDate: new Date('2024-01-15'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[2].id, // employee3
      role: 'Frontend Developer',
      startDate: new Date('2024-01-20'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[3].id, // employee4
      role: 'Backend Developer',
      startDate: new Date('2024-01-20'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[4].id, // employee5
      role: 'UI/UX Designer',
      startDate: new Date('2024-01-22'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[5].id, // employee6
      role: 'QA Engineer',
      startDate: new Date('2024-01-25'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[6].id, // employee7
      role: 'DevOps Engineer',
      startDate: new Date('2024-02-01'),
      isActive: true,
    },
    {
      projectId: projects[0].id,
      userId: employees[7].id, // employee8
      role: 'Business Analyst',
      startDate: new Date('2024-02-05'),
      isActive: true,
    },

    // Project 2: Customer Mobile Application (7 members)
    {
      projectId: projects[1].id,
      userId: employees[8].id, // employee9
      role: 'Project Manager',
      startDate: new Date('2024-02-01'),
      isActive: true,
    },
    {
      projectId: projects[1].id,
      userId: employees[9].id, // employee10
      role: 'Scrum Master',
      startDate: new Date('2024-02-01'),
      isActive: true,
    },
    {
      projectId: projects[1].id,
      userId: employees[10].id, // employee11
      role: 'Senior Developer',
      startDate: new Date('2024-02-05'),
      isActive: true,
    },
    {
      projectId: projects[1].id,
      userId: employees[11].id, // employee12
      role: 'Frontend Developer',
      startDate: new Date('2024-02-10'),
      isActive: true,
    },
    {
      projectId: projects[1].id,
      userId: employees[12].id, // employee13
      role: 'Backend Developer',
      startDate: new Date('2024-02-10'),
      isActive: true,
    },
    {
      projectId: projects[1].id,
      userId: employees[13].id, // employee14
      role: 'UI/UX Designer',
      startDate: new Date('2024-02-12'),
      isActive: true,
    },
    {
      projectId: projects[1].id,
      userId: employees[14].id, // employee15
      role: 'Tester',
      startDate: new Date('2024-02-15'),
      isActive: true,
    },

    // Project 3: Internal CRM System (6 members)
    {
      projectId: projects[2].id,
      userId: employees[15].id, // employee16
      role: 'Product Owner',
      startDate: new Date('2024-03-01'),
      isActive: true,
    },
    {
      projectId: projects[2].id,
      userId: employees[16].id, // employee17
      role: 'Lead',
      startDate: new Date('2024-03-01'),
      isActive: true,
    },
    {
      projectId: projects[2].id,
      userId: employees[17].id, // employee18
      role: 'Full Stack Developer',
      startDate: new Date('2024-03-05'),
      isActive: true,
    },
    {
      projectId: projects[2].id,
      userId: employees[18].id, // employee19
      role: 'Developer',
      startDate: new Date('2024-03-10'),
      isActive: true,
    },
    {
      projectId: projects[2].id,
      userId: employees[19].id, // employee20
      role: 'Junior Developer',
      startDate: new Date('2024-03-15'),
      isActive: true,
    },
    {
      projectId: projects[2].id,
      userId: employees[5].id, // employee6 (shared resource)
      role: 'QA Engineer',
      startDate: new Date('2024-03-20'),
      isActive: true,
    },

    // Project 4: Cloud Infrastructure Migration (5 members)
    {
      projectId: projects[3].id,
      userId: employees[1].id, // employee2 (shared resource)
      role: 'Manager',
      startDate: new Date('2024-04-01'),
      isActive: true,
    },
    {
      projectId: projects[3].id,
      userId: employees[6].id, // employee7 (shared resource)
      role: 'DevOps Engineer',
      startDate: new Date('2024-04-01'),
      isActive: true,
    },
    {
      projectId: projects[3].id,
      userId: employees[3].id, // employee4 (shared resource)
      role: 'Backend Developer',
      startDate: new Date('2024-04-05'),
      isActive: true,
    },
    {
      projectId: projects[3].id,
      userId: employees[10].id, // employee11 (shared resource)
      role: 'Senior Developer',
      startDate: new Date('2024-04-10'),
      isActive: true,
    },
    {
      projectId: projects[3].id,
      userId: employees[7].id, // employee8 (shared resource)
      role: 'Business Analyst',
      startDate: new Date('2024-04-15'),
      isActive: true,
    },

    // Project 5: AI-Powered Analytics Dashboard (6 members - PLANNING phase)
    {
      projectId: projects[4].id,
      userId: employees[0].id, // employee1 (shared resource)
      role: 'Product Owner',
      startDate: new Date('2024-05-01'),
      isActive: true,
    },
    {
      projectId: projects[4].id,
      userId: employees[16].id, // employee17 (shared resource)
      role: 'Team Lead',
      startDate: new Date('2024-05-01'),
      isActive: true,
    },
    {
      projectId: projects[4].id,
      userId: employees[17].id, // employee18 (shared resource)
      role: 'Full Stack Developer',
      startDate: new Date('2024-05-05'),
      isActive: true,
    },
    {
      projectId: projects[4].id,
      userId: employees[2].id, // employee3 (shared resource)
      role: 'Frontend Developer',
      startDate: new Date('2024-05-10'),
      isActive: true,
    },
    {
      projectId: projects[4].id,
      userId: employees[4].id, // employee5 (shared resource)
      role: 'Designer',
      startDate: new Date('2024-05-15'),
      isActive: true,
    },
    {
      projectId: projects[4].id,
      userId: employees[7].id, // employee8 (shared resource)
      role: 'Business Analyst',
      startDate: new Date('2024-05-20'),
      isActive: true,
    },
  ];

  const createdProjectMembers: any[] = [];

  for (const assignment of projectMemberAssignments) {
    const projectMember = await tx.projectMember.create({
      data: assignment,
    });
    createdProjectMembers.push(projectMember);
  }

  console.log(
    `✅ Created ${createdProjectMembers.length} project member assignments`,
  );
  console.log(`   - Project 1 (E-commerce): 8 members`);
  console.log(`   - Project 2 (Mobile App): 7 members`);
  console.log(`   - Project 3 (CRM): 6 members`);
  console.log(`   - Project 4 (Infrastructure): 5 members`);
  console.log(`   - Project 5 (AI Analytics): 6 members`);

  return createdProjectMembers;
}
