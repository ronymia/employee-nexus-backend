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
import { BusinessModulesModule } from './modules/business-modules/business-modules.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { SubscriptionModulesModule } from './modules/subscription-modules/subscription-modules.module';
import { DesignationsModule } from './modules/designations/designations.module';
import { SystemModulesModule } from './modules/system-modules/system-modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generate schema file
      sortSchema: true, // Sort the schema for better readability
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: ({ req }) => ({ req }), // Important for GqlAuthGuard
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
    SubscriptionModulesModule,
    BusinessModulesModule,
    BusinessesModule,
    SystemModulesModule,
    DesignationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
