import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CarModelService {

  // Injecting services to be used.
  private http = inject(HttpClient);

  // Get car models and colors data from API endpoint to populate step 1 dropdown values.
  getCarModels(): Observable<object> {
    return this.http.get('/tesla-configurator/models')
  }
}
