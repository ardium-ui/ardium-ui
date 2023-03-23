import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger {

    constructor() { }
    
    log(...args: any[]): void {
        console.log(...args);
    }
}
