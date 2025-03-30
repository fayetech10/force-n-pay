import { Injectable } from "@angular/core";
import { UserService } from "../users.service";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../../interfaces/User";

@Injectable({
    providedIn: "root"
})

export class UserDataService{
    constructor(private userService: UserService){}

    private userSubcription = new BehaviorSubject<User[]>([])

    users$ = this.userSubcription.asObservable()

    loadUsers():Observable<User[]>{
        if(this.userSubcription.value.length === 0){
            return this.userService.getAllUsers().pipe(
                tap(users => this.userSubcription.next(users))
            )
        }

        return this.users$
    }
}