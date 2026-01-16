import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';
import { UserPermissionsModule } from './modules/user-permissions/user-permissions.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { BusinessFeaturesModule } from './modules/business-features/business-features.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { SubscriptionFeaturesModule } from './modules/subscription-features/subscription-features.module';
import { DesignationsModule } from './modules/designations/designations.module';
import { FeaturesModule } from './modules/features/features.module';
import { JobTypesModule } from './modules/job-types/job-types.module';
import { BusinessSchedulesModule } from './modules/business-schedules/business-schedules.module';
import { JobPlatformsModule } from './modules/job-platforms/job-platforms.module';
import { RecruitmentProcessesModule } from './modules/recruitment-processes/recruitment-processes.module';
import { OnboardingProcessesModule } from './modules/onboarding-processes/onboarding-processes.module';
import { WorkSitesModule } from './modules/work-sites/work-sites.module';
import { EmploymentStatusModule } from './modules/employment-status/employment-status.module';
import { LeaveTypesModule } from './modules/leave-types/leave-types.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { AttendanceSettingsModule } from './modules/attendance-settings/attendance-settings.module';
import { LeaveSettingsModule } from './modules/leave-settings/leave-settings.module';
import { BusinessSettingsModule } from './modules/business-settings/business-settings.module';
import { WorkSchedulesModule } from './modules/work-schedules/work-schedules.module';
import { AssetTypesModule } from './modules/asset-types/asset-types.module';
import { AssetsModule } from './modules/assets/assets.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { JobHistoriesModule } from './modules/job-histories/job-histories.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotesModule } from './modules/notes/notes.module';
import { SocialLinksModule } from './modules/social-links/social-links.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { HolidaysModule } from './modules/holidays/holidays.module';
import { PayrollComponentsModule } from './modules/payroll-components/payroll-components.module';
import { PayrollCyclesModule } from './modules/payroll-cycles/payroll-cycles.module';
import { PayrollItemsModule } from './modules/payroll-items/payroll-items.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OwnerDashboardModule } from './modules/owner-dashboard/owner-dashboard.module';
import { EmployeeDashboardModule } from './modules/employee-dashboard/employee-dashboard.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { graphqlErrorFormatter } from './filters/graphql-error.formatter';
import { EmployeeDesignationsModule } from './modules/employee-designations/employee-designations.module';
import { EmployeeWorkSitesModule } from './modules/employee-work-sites/employee-work-sites.module';
import { EmployeeDepartmentsModule } from './modules/employee-departments/employee-departments.module';
import { EmployeeWorkSchedulesModule } from './modules/employee-work-schedules/employee-work-schedules.module';
import { EmployeeEmploymentStatusesModule } from './modules/employee-employment-statuses/employee-employment-statuses.module';
import { BusinessSubscriptionsModule } from './modules/business-subscriptions/business-subscriptions.module';
import { EmployeeSalariesModule } from './modules/employee-salaries/employee-salary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
      formatError: graphqlErrorFormatter,
    }),
    PrismaModule,
    UsersModule,
    ProfilesModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    RolePermissionsModule,
    UserPermissionsModule,
    SubscriptionPlansModule,
    SubscriptionFeaturesModule,
    BusinessFeaturesModule,
    BusinessesModule,
    FeaturesModule,
    DesignationsModule,
    JobTypesModule,
    BusinessSchedulesModule,
    JobPlatformsModule,
    RecruitmentProcessesModule,
    OnboardingProcessesModule,
    WorkSitesModule,
    EmploymentStatusModule,
    LeaveTypesModule,
    DepartmentsModule,
    AttendanceSettingsModule,
    LeaveSettingsModule,
    BusinessSettingsModule,
    WorkSchedulesModule,
    AssetTypesModule,
    AssetsModule,
    ProjectsModule,
    JobHistoriesModule,
    DocumentsModule,
    NotesModule,
    SocialLinksModule,
    AttendancesModule,
    LeavesModule,
    HolidaysModule,
    PayrollComponentsModule,
    PayrollCyclesModule,
    PayrollItemsModule,
    NotificationsModule,
    OwnerDashboardModule,
    EmployeeDashboardModule,
    SchedulerModule,
    EmployeeDesignationsModule,
    EmployeeWorkSitesModule,
    EmployeeDepartmentsModule,
    EmployeeWorkSchedulesModule,
    EmployeeEmploymentStatusesModule,
    BusinessSubscriptionsModule,
    EmployeeSalariesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
