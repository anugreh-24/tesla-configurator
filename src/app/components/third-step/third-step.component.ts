import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DataShareService } from '../../services/data-share-service/data-share.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { Car } from '../interfaces';

@Component({
  selector: 'app-third-step',
  standalone: true,
  imports: [NgIf],
  templateUrl: './third-step.component.html',
  styleUrl: './third-step.component.scss'
})
export class ThirdStepComponent implements OnInit, OnDestroy {

  // Initializing subscription to be used.
  subscription?: Subscription;

  // Injecting services to be used.
  private dataShare = inject(DataShareService);

  // Initailizing variables to be used.
  carObj?: Car;
  carName: string = '';
  configType: string = '';
  imgUrl: string = '';
  totalCost: number = 0;
  towAmount:number = 1000;
  yokeAmount:number = 1000;

  // Initialize component.
  ngOnInit(): void {
    this.getCarDetails();
  }

  // Get data for selected car.
  getCarDetails(): void {
    this.subscription = this.dataShare?.selectedCar?.subscribe((data) => {
      if (data) {
        this.carObj = data;
        this.carName = data.car.description;
        this.configType = data.config.description;
        this.imgUrl = data.imgUrl;
        this.totalCost = data.config.price + data.color.price;
        if (data.isTowChecked) {
          this.totalCost += this.towAmount;
        }
        if (data.isYokeChecked) {
          this.totalCost += this.yokeAmount;
        }
      }
    }
    )
  }

  // Unsubscribe observables when component is removed from DOM.
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
