import { Routes } from "@angular/router";
import { ComponentsComponent } from "./dashboard/components/components.component";
import { LayoutComponent } from "./layout/layout.component";
import { MentorshipComponent } from "./mentorship/mentorship.component";
import { PaymentTrackingComponent } from "./payment-tracking/payment-tracking.component";
import { ReportComponent } from "./report/report.component";
import { SeanceManagementComponent } from "./seance-management/seance-management.component";
import { UserManagementComponent } from "./user-management/components/user-management.component";
import { DashboardconsultantComponent } from "./dashboardconsultant/components/dashboardconsultant.component";
import { DashboardMentorComponent } from "./dashboard-mentor/components/dashboard-mentor.component";
import { LoginComponent } from "./login/components/login.component";

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },

    {
        path: '',
        component: LayoutComponent, // Le layout global avec le sidebar
        children: [
            { path: 'dashboard', component: ComponentsComponent },
            {
                path: '',
                loadChildren: () => import("./mission-management/mission.routes").then(m => m.MissionRoutes)
            },
            {
                path: "users",
                component: UserManagementComponent
            },

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
    },
  {
    path: 'dashboard/mentor',
    component: DashboardMentorComponent,
    loadChildren: () => import("./dashboard-mentor/mentor.route").then(m => m.MentorRoute)
  }
    // {
    //     path: "dashboard/mentor",
    //     component: DashboardMentorComponent
    // }
];
