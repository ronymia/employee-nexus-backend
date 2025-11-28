import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingProcessesService } from './onboarding-processes.service';

describe('OnboardingProcessesService', () => {
  let service: OnboardingProcessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardingProcessesService],
    }).compile();

    service = module.get<OnboardingProcessesService>(
      OnboardingProcessesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
