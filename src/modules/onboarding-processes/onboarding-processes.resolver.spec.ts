import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingProcessesResolver } from './onboarding-processes.resolver';
import { OnboardingProcessesService } from './onboarding-processes.service';

describe('OnboardingProcessesResolver', () => {
  let resolver: OnboardingProcessesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardingProcessesResolver, OnboardingProcessesService],
    }).compile();

    resolver = module.get<OnboardingProcessesResolver>(
      OnboardingProcessesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
