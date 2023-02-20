import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

// import { LoaderState } from './loader';
@Injectable()
export class LoaderService {
    private loaderSubject = new Subject();
    constructor() { }
    show() {
        this.loaderSubject.next({ show: true });
    }
    
    hide() {
        this.loaderSubject.next({ show: false });
    }

    getLoaderState(): Observable<any> {
        return this.loaderSubject.asObservable();
    }
}