import { Routes } from "@angular/router";
import { UserManagementComponent } from "./components/user-management.component";
import { UserResolver } from "./user.resolver";

export const UserRoute: Routes = [
    {
        path: "users",
        component: UserManagementComponent, resolve: { users: UserResolver }
    }
]