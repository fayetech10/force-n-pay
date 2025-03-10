import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../interfaces/User";

@Injectable({
    providedIn: "root"
})

export class UserService{
    constructor(private http: HttpClient){}

    private API = '/api'

    getAllUsers():Observable<User[]>{
        return this.http.get<User[]>(`${this.API}`)
    }
}