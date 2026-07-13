import { Routes } from '@angular/router';
import { AUTH_ROUTES, authGuard } from '@nexacore/auth';


export const routes: Routes = [
    ...AUTH_ROUTES,
    {
        path: '',
        loadComponent: () =>
            import('@nexacore/layout').then(m => m.LayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'component-demo',
                loadComponent: () =>
                    import('./pages/component-demo/component-demo.component').then(m => m.ComponentDemoComponent),
            },
            {
                path: 'person',
                loadComponent: () =>
                    import('./pages/person/person-list/person-list.component').then(m => m.PersonListComponent),
            },
            {
                path: 'person/create',
                loadComponent: () =>
                    import('./pages/person/person-editor.component').then(m => m.PersonEditorComponent),
            },
            {
                path: 'person/:id/edit',
                loadComponent: () =>
                    import('./pages/person/person-editor.component').then(m => m.PersonEditorComponent),
            },
            {
                path: 'person/:id/preview',
                loadComponent: () =>
                    import('./pages/person/person-preview.component').then(m => m.PersonPreviewComponent),
            },
            {
                path: 'kyc',
                loadComponent: () =>
                    import('./pages/kyc-list/kyc-list.component').then(m => m.KycListComponent),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ],
    },
    { path: '**', redirectTo: 'dashboard' },
];
