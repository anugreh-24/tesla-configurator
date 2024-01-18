import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Car } from '../../components/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  // Initailizing variables to be used.
  carSelected?: boolean = false;
  configSelected?: boolean = false;
  private carSelections = new BehaviorSubject<any>(null);
  selectedCar = this.carSelections.asObservable();

  // Update car.
  changeCarSelection(car: Car) {
    this.carSelections.next(car);
  }
}
