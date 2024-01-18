import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  // Injecting services to be used.
  private http = inject(HttpClient);

  // Get config data from API endpoint.
  configs(id: string): Observable<object> {
    let url = '/tesla-configurator/options/' + id;
    return this.http.get(url)
  }
}
