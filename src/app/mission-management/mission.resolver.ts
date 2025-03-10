import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { Mission } from "../interfaces/Mission";
import { MissionService } from "../services/missions.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class MissionResolver implements Resolve<Mission[]> {

    constructor(private readonly missionService: MissionService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mission[]> {

        return this.missionService.getMission()

    }


}