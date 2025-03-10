import { Routes } from "@angular/router";
import { MissionManagementComponent } from "./components/mission-management.component";
import { MissionResolver } from "./mission.resolver";

export const MissionRoutes:Routes = [
    {
        path: "missions",
        component: MissionManagementComponent,resolve: {missions: MissionResolver}
    }
] 