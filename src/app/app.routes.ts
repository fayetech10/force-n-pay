import { Routes } from "@angular/router";
import { MissionManagementComponent } from "./mission-management/components/mission-management.component";
import { UserManagementComponent } from "./user-management/components/user-management.component";
import { PaymentTrackingComponent } from "./payment-tracking/payment-tracking.component";
import { MentorshipComponent } from "./mentorship/mentorship.component";
import { ReportComponent } from "./report/report.component";
import { LayoutComponent } from "./layout/layout.component";
import { ComponentsComponent } from "./dashboard/components/components.component";
import { SeanceManagementComponent } from "./seance-management/seance-management.component";
import { DashboardconsultantComponent } from "./dashboardconsultant/components/dashboardconsultant.component";
import { ConsultantRoute } from "./dashboardconsultant/consultant.route";

export const routes: Routes = [
    {
        path: "login",
        loadChildren: () => import("./login/login.routes").then(m => m.LoginRoute)
    },

    {
        path: '',
        component: LayoutComponent, // Le layout global avec le sidebar
        children: [
            { path: 'dashboard', component: ComponentsComponent },
            { path: '', loadChildren: () => import("./mission-management/mission.routes").then(m => m.MissionRoutes) },
            { path: 'users', loadChildren: () => import("./user-management/user.routes").then(m => m.UserRoute) },
            { path: 'reports', component: ReportComponent },
            { path: 'seances', component: SeanceManagementComponent },
            { path: 'payments', component: PaymentTrackingComponent },
            { path: 'mentorship', component: MentorshipComponent }
        ]
    },
    {
        path: "dashboard/consultant",
        component: DashboardconsultantComponent,
        loadChildren: () => import("./dashboardconsultant/consultant.route").then(m => m.ConsultantRoute)
    }
];