import { Routes } from '@angular/router';

// Layouts
import { MainLayout } from './layouts/main-layout/main-layout';
import { BuilderLayout } from './layouts/builder-layout/builder-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

// Pages
import { Home } from './pages/home/home';
import { Brainstorm } from './pages/brainstorm/brainstorm';
import { AiInterview } from './pages/ai-interview/ai-interview';
import { Preview } from './pages/preview/preview';
import { Validation } from './pages/validation/validation';
import { StyleTest } from './pages/style-test/style-test';

// Guards
import { brainstormGuard } from './core/guards/brainstorm-guard';
import { aiInterviewGuard } from './core/guards/ai-interview-guard';
import { previewGuard } from './core/guards/preview-guard';
import { validationGuard } from './core/guards/validation-guard';

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
            canActivate: [brainstormGuard],
          },
          {
            path: 'ai-interview',
            component: AiInterview,
            canActivate: [aiInterviewGuard],
          },
          {
            path: 'preview',
            component: Preview,
            canActivate: [previewGuard],
          },
          {
            path: 'validation',
            component: Validation,
            canActivate: [validationGuard],
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
