import { Injectable } from "@angular/core";
import { MissionService } from "../missions.service";
import { AuthService } from "../auth.service";
import { BehaviorSubject, Observable, switchMap, tap } from "rxjs";
import { Mission } from "../../interfaces/Mission";

@Injectable({
    providedIn: "root"
})
export class MissionDataService {
    private missionsSubject = new BehaviorSubject<Mission[]>([])
    missions$ = this.missionsSubject.asObservable()
    constructor(
        private missionService: MissionService,
        private authService: AuthService
    ) { }

    loadMissions(): Observable<Mission[]> {
        if (this.missionsSubject.value.length === 0) {
            return this.authService.getUserProfile().pipe(
                switchMap(user => this.missionService.getMissionByUserId(user.id).pipe(
                    tap(missions => this.missionsSubject.next(missions))
                ))
            )
        }

        return this.missions$
    }
    refreshMissions(): Observable<Mission[]> {
        return this.authService.getUserProfile().pipe(switchMap(user =>
            this.missionService.getMissionByUserId(user.id).pipe(
                tap(missions => this.missionsSubject.next(missions))
            )
        )
        )
    }

}