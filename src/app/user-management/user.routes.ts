import { Routes } from "@angular/router";
import { UserManagementComponent } from "./components/user-management.component";
import { MentorComponent } from "./mentor/mentor.component";
import { ConsultantComponent } from "./consultant/consultant.component";
import { AdminComponent } from "./admin/admin.component";
import { ValidationTeamComponent } from "./validation-team/validation-team.component";

export const UserRoute: Routes = [
  {
    path: "", // Chemin relatif à /users
    component: UserManagementComponent,
    children: [ // ✅ Déclaration des enfants
      { path: "mentor", component: MentorComponent },
      { path: "consultant", component: ConsultantComponent },
      { path: "admin", component: AdminComponent },
      { path: "validation-team", component: ValidationTeamComponent },
      { path: "", redirectTo: "admin", pathMatch: "full" } // Redirection par défaut
    ]
  }
];
