import { Routes } from '@angular/router';

// Layouts
import { MainLayout } from './layouts/main-layout/main-layout';
import { BuilderLayout } from './layouts/builder-layout/builder-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

// Pages
import { Home } from './features/home/pages/home/home';
import { Brainstorm } from './features/builder/pages/brainstorm/brainstorm';
import { AiInterview } from './features/builder/pages/ai-interview/ai-interview';
import { Preview } from './features/builder/pages/preview/preview';
import { Validation } from './features/builder/pages/validation/validation';
import { StyleTest } from './features/home/pages/style-test/style-test';

// Guards
import { stepGuard } from './core/guards/step-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // 1. Home Phase: Renders inside MainLayout (Navbar only)
      { path: 'home', component: Home },
      { path: 'style-test', component: StyleTest },

      // 2. Builder Phase: Renders inside BuilderLayout (Steps Bar + page content)
      {
        path: 'build',
        component: BuilderLayout,
        children: [
          { path: '', redirectTo: 'brainstorm', pathMatch: 'full' },
          {
            path: 'brainstorm',
            component: Brainstorm,
            canActivate: [stepGuard('brainstorm')],
          },
          {
            path: 'ai-interview',
            component: AiInterview,
            canActivate: [stepGuard('ai-interview')],
          },
          {
            path: 'validation',
            component: Validation,
            canActivate: [stepGuard('validation')],
          },
          {
            path: 'preview',
            component: Preview,
            canActivate: [stepGuard('preview')],
          },
          { path: '**', redirectTo: 'brainstorm' },
        ],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      // Future auth routes go here (e.g., login, register)
      // { path: 'login', component: LoginComponent }
    ],
  },

  // Wildcard route for a 404 page till we make wildcomponent
  { path: '**', redirectTo: 'home' },
];
