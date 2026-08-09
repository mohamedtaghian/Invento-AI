import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BuilderState } from '@/app/features/builder/services/builder-state';

export const validationGuard: CanActivateFn = () => {
  const builderState = inject(BuilderState);
  const router = inject(Router);

  if (!builderState.isBrainstormComplete()) {
    return router.parseUrl('/build/brainstorm');
  }
  if (!builderState.isAiInterviewComplete()) {
    return router.parseUrl('/build/ai-interview');
  }

  return true;
};
