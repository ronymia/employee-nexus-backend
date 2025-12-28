// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateEmployeeScheduleAssignmentInput } from './dto/create-employee-schedule-assignment.input';
// import { UpdateEmployeeScheduleAssignmentInput } from './dto/update-employee-schedule-assignment.input';
// import { PrismaService } from '../prisma/prisma.service';
// import { JwtPayload } from '../auth/jwt.strategy';

// @Injectable()
// export class EmployeeScheduleAssignmentsService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create({
//     user,
//     createEmployeeScheduleAssignmentInput,
//   }: {
//     user: JwtPayload;
//     createEmployeeScheduleAssignmentInput: CreateEmployeeScheduleAssignmentInput;
//   }) {
//     const { userId, workScheduleId, isActive, ...assignmentData } =
//       createEmployeeScheduleAssignmentInput;

//     // Validate user exists and belongs to business
//     const employee = await this.prisma.user.findFirst({
//       where: {
//         id: userId,
//         role: { businessId: user.businessId },
//       },
//     });

//     if (!employee) {
//       throw new NotFoundException('Employee not found');
//     }

//     // Validate work schedule exists and belongs to business
//     const workSchedule = await this.prisma.workSchedule.findFirst({
//       where: {
//         id: workScheduleId,
//         businessId: user.businessId,
//       },
//     });

//     if (!workSchedule) {
//       throw new NotFoundException('Work schedule not found');
//     }

//     // If setting as active, deactivate other active assignments for this user
//     if (isActive) {
//       await this.prisma.employeeSchedule.updateMany({
//         where: {
//           userId,
//           isActive: true,
//         },
//         data: {
//           isActive: false,
//         },
//       });
//     }

//     return await this.prisma.employeeSchedule.create({
//       data: {
//         ...assignmentData,
//         userId,
//         workScheduleId,
//         isActive,
//         assignedBy: user.userId,
//       },
//       include: {
//         user: true,
//         workSchedule: true,
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//     });
//   }

//   async findAll({ user }: { user: JwtPayload }) {
//     return await this.prisma.employeeSchedule.findMany({
//       where: {
//         user: {
//           user: {
//             role: {
//               businessId: user.businessId,
//             },
//           },
//         },
//       },
//       include: {
//         user: {
//           include: {
//             user: {
//               include: {
//                 profile: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         workSchedule: true,
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   }

//   async findByUserId({ user, userId }: { user: JwtPayload; userId: number }) {
//     return await this.prisma.employeeSchedule.findMany({
//       where: {
//         userId,
//         user: {
//           user: {
//             role: {
//               businessId: user.businessId,
//             },
//           },
//         },
//       },
//       include: {
//         user: {
//           include: {
//             user: {
//               include: {
//                 profile: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         workSchedule: {
//           include: {
//             schedules: {
//               include: {
//                 timeSlots: true,
//               },
//             },
//           },
//         },
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//       orderBy: {
//         startDate: 'desc',
//       },
//     });
//   }

//   async findActiveByUserId({
//     user,
//     userId,
//   }: {
//     user: JwtPayload;
//     userId: number;
//   }) {
//     return await this.prisma.employeeSchedule.findFirst({
//       where: {
//         userId,
//         isActive: true,
//         user: {
//           user: {
//             role: {
//               businessId: user.businessId,
//             },
//           },
//         },
//       },
//       include: {
//         user: {
//           include: {
//             user: {
//               include: {
//                 profile: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         workSchedule: true,
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//     });
//   }

//   async findOne({
//     user,
//     userId,
//     workScheduleId,
//   }: {
//     user: JwtPayload;
//     userId: number;
//     workScheduleId: number;
//   }) {
//     const assignment = await this.prisma.employeeSchedule.findFirst({
//       where: {
//         userId,
//         workScheduleId,
//         user: {
//           user: {
//             role: {
//               businessId: user.businessId,
//             },
//           },
//         },
//       },
//       include: {
//         user: {
//           include: {
//             user: {
//               include: {
//                 profile: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         workSchedule: true,
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//     });

//     if (!assignment) {
//       throw new NotFoundException(`Employee schedule assignment not found`);
//     }

//     return assignment;
//   }

//   async update({
//     user,
//     userId,
//     workScheduleId,
//     updateEmployeeScheduleAssignmentInput,
//   }: {
//     user: JwtPayload;
//     userId: number;
//     workScheduleId: number;
//     updateEmployeeScheduleAssignmentInput: UpdateEmployeeScheduleAssignmentInput;
//   }) {
//     await this.findOne({ user, userId, workScheduleId });

//     const { isActive, ...updateData } = updateEmployeeScheduleAssignmentInput;

//     // If setting as active, deactivate other active assignments for this user
//     if (isActive) {
//       await this.prisma.employeeSchedule.updateMany({
//         where: {
//           userId,
//           isActive: true,
//           NOT: {
//             workScheduleId,
//           },
//         },
//         data: {
//           isActive: false,
//         },
//       });
//     }

//     return await this.prisma.employeeSchedule.update({
//       where: {
//         userId_workScheduleId: {
//           userId,
//           workScheduleId,
//         },
//       },
//       data: {
//         ...updateData,
//         ...(isActive !== undefined && { isActive }),
//       },
//       include: {
//         user: {
//           include: {
//             user: {
//               include: {
//                 profile: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         workSchedule: true,
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//     });
//   }

//   async remove({
//     user,
//     userId,
//     workScheduleId,
//   }: {
//     user: JwtPayload;
//     userId: number;
//     workScheduleId: number;
//   }) {
//     await this.findOne({ user, userId, workScheduleId });

//     return await this.prisma.employeeSchedule.delete({
//       where: {
//         userId_workScheduleId: {
//           userId,
//           workScheduleId,
//         },
//       },
//       include: {
//         user: {
//           include: {
//             user: {
//               include: {
//                 profile: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         workSchedule: true,
//         assignedByUser: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//     });
//   }
// }
