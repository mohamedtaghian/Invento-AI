import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BuilderState } from '@/app/features/builder/services/builder-state';

export const aiInterviewGuard: CanActivateFn = () => {
  const builderState = inject(BuilderState);
  const router = inject(Router);

  if (builderState.isBrainstormComplete()) {
    return true;
  }
  return router.parseUrl('/build/brainstorm');
};
