import { Routes } from "@angular/router";

export const LoginRoute: Routes = [
    {
        path: "", // Chemin relatif au parent 'login'
        loadComponent: () => import("./components/login.component").then(m => m.LoginComponent)
    }
];