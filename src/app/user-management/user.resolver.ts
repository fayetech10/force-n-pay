import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { User } from "../interfaces/User";
import { UserService } from "../services/users.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"

})
export class UserResolver implements Resolve<User[]> {
    constructor(private readonly userService: UserService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {
        return this.userService.getAllUsers()
    }
}