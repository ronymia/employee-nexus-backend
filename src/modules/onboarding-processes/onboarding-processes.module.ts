import { Module } from '@nestjs/common';
import { OnboardingProcessesService } from './onboarding-processes.service';
import { OnboardingProcessesResolver } from './onboarding-processes.resolver';

@Module({
  providers: [OnboardingProcessesResolver, OnboardingProcessesService],
})
export class OnboardingProcessesModule {}
