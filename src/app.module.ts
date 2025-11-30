import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerMiddleware } from './middlewares/logger.middleware';
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
import { EducationHistoriesModule } from './modules/education-histories/education-histories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
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
    EducationHistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
