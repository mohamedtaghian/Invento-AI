import { Routes } from '@angular/router';

// Layouts
// import { MainLayout } from './layouts/main-layout/main-layout';
// import { BuilderLayout } from './layouts/builder-layout/builder-layout';
// import { AuthLayout } from './layouts/auth-layout/auth-layout';

// Pages
// import { Home } from './pages/home/home';
// import { Brainstorm } from './pages/brainstorm/brainstorm';
// import { AiInterview } from './pages/ai-interview/ai-interview';
// import { Validation } from './pages/validation/validation';
// import { Preview } from './pages/preview/preview';
// import { StyleTest } from './pages/style-test/style-test';
import { Products } from './pages/products/products';

export const routes: Routes = [
  {
    path: '',
    // component: MainLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // 1. Home Phase: Renders inside MainLayout (Navbar only)
      //   { path: 'home', component: Home },
      //   { path: 'style-test', component: StyleTest },
      // 2. Steps Phases: Renders inside BuilderLayout (Navbar + Steps Bar)
      //   {
      // path: '',
      // component: BuilderLayout,
      // children: [
      //   { path: 'brain', component: Brainstorm },
      //   { path: 'ai-builder', component: AiInterview },
      //   { path: 'validation', component: Validation },
      //   { path: 'preview', component: Preview },
      { path: 'products', component: Products },
    ],
  },
  // ],
  //   },
  //   {
  // path: 'auth',
  // component: AuthLayout,
  // children: [
  // Future auth routes go here (e.g., login, register)
  // { path: 'login', component: LoginComponent }
  // ],
  //   },

  // Wildcard route for a 404 page till we make wildcomponent
  //   { path: '**', redirectTo: 'home' },
];
