import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class PageTitleService {
    private titleSubject = new BehaviorSubject<{title: string, icon?:string}>({
        title: "Dashboard",
        icon: "dashboard"
    })
    currentTitle$ = this.titleSubject.asObservable()

    setPageTitle(title: string, icon?: string){
        this.titleSubject.next({title, icon})
    }
}