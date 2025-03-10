import { Routes } from "@angular/router";
import { MissionManagementComponent } from "./mission-management/components/mission-management.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { PaymentTrackingComponent } from "./payment-tracking/payment-tracking.component";
import { MentorshipComponent } from "./mentorship/mentorship.component";
import { ReportComponent } from "./report/report.component";
import { LayoutComponent } from "./layout/layout.component";
import { ComponentsComponent } from "./dashboard/components/components.component";

export const routes: Routes = [
    {
        path: "login",
        loadChildren: () => import("./login/login.routes").then(m => m.LoginRoute)
    },
    // {
    //     path: "dashboard",
    //     loadComponent: () => import("./dashboard/components/components.component").then((m) => m.ComponentsComponent)
    // },
    // {
    //     path: '',
    //     loadComponent: () => import("./app.component").then(m => m.AppComponent)
    // },




    {
        path: '',
        component: LayoutComponent, // Le layout global avec le sidebar
        children: [
            { path: 'dashboard', component: ComponentsComponent },
            { path: '', loadChildren: () => import("./mission-management/mission.routes").then(m => m.MissionRoutes) },
            { path: 'users', component: UserManagementComponent },
            { path: 'reports', component: ReportComponent },
            { path: 'payments', component: PaymentTrackingComponent },
            { path: 'mentorship', component: MentorshipComponent }
        ]
    }
];