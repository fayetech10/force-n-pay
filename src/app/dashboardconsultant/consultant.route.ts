import { Routes } from "@angular/router";
import { MissionComponent } from "./mission/mission.component";
import { PaymentsComponent } from "./payments/payments.component";
import { HomeComponent } from "./home/home.component";
import { ReportsComponent } from "./reports/reports.component";

export const ConsultantRoute: Routes = [
    {
        path: "", component: HomeComponent
    },
    {
        path: "mission", component: MissionComponent
    },
    {
        path: "reports", component: ReportsComponent
    },
    {
        path: "payments", component: PaymentsComponent
    },


];
