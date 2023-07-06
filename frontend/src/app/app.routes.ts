import {Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {NotFoundComponent} from './modules/notfound.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full',
    },
    {
        path: 'calendar',
        canLoad: [AuthGuard],
        loadChildren: () => import('./modules/main/main.module')
            .then(m => m.MainModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module')
            .then(m => m.AuthModule)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
