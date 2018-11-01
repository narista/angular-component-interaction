import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentInteractionService {

    private subject = new Subject<any>();

    // The event property for the subscribers.
    event$ = this.subject.asObservable();

    // Publish the event to the subscribers.
    publish(change: any) {
        this.subject.next(change);
    }
}
