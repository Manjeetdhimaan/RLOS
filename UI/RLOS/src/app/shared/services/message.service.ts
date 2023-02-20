import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();
 
    sendMessage(message: boolean) {
        this.subject.next(message);
    }
 
    sendStepper(message: number) {
        this.subject.next(message);
    }
 
    clearMessage() {
        this.subject.next(null);
    }
 
    clearStepper() {
        this.subject.next(null);
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
 
    getStepper(): Observable<any> {
        return this.subject.asObservable();
    }
}