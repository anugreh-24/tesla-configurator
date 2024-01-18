import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CarModelService } from '../../services/model-service/car-model.service';
import { NgFor, NgIf } from '@angular/common';
import { DataShareService } from '../../services/data-share-service/data-share.service';
import { Color, CarModel, Car } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './first-step.component.html',
  styleUrl: './first-step.component.scss'
})

export class FirstStepComponent implements OnInit, OnDestroy {

  // Initializing subscription to be used.
  subscription1$?: Subscription;
  subscription2$?: Subscription;
  subscriptions: Subscription[] = [];

  // Injecting services to be used.
  private carModelService = inject(CarModelService);
  private dataShare = inject(DataShareService);

  // Initailizing variables to be used.
  carModels?: CarModel[];
  selectedCar?: CarModel;
  selectedColor?: Color;
  colorOptions?: Color[];
  baseUrl: string = 'https://interstate21.com/tesla-app/images/';
  imgUrl?: string = '';
  carPicked: boolean = false;
  prevCarCode?: string;
  prevCarColor?: string;
  carObj?: Car;

  // Initialize component.
  ngOnInit(): void {
    this.getModelData();
    if (this.dataShare.carSelected) {
      this.getPreviousSelectionData();
    }
  }

  // Get Model and corresponding colors.
  getModelData(): void {
    this.subscription1$ = this.carModelService?.getCarModels().subscribe((data: any) => {
      if (data) {
        this.carModels = data;
      }
    });
    this.subscriptions?.push(this.subscription1$);
  }

  // Get data if car is previously selected.
  getPreviousSelectionData() {
    this.subscription2$ = this.dataShare?.selectedCar?.subscribe(data => {
      if (data) {
        this.carObj = data;
        this.prevCarCode = data.car.code;
        this.colorOptions = data.car.colors;
        this.prevCarColor = data.color.code;
        this.imgUrl = data.imgUrl;
        this.carPicked = true;
        this.selectedCar = data.car;
        this.selectedColor = data.color;
      }
    }
    );
    this.subscriptions?.push(this.subscription2$);
  }

  // Update car model selection.
  newModelSelect(state: any): void {
    this.selectedCar = this.carModels?.filter(e => e.code == state.target.value)[0];
    this.colorOptions = this.selectedCar?.colors;
    this.selectedColor = this.colorOptions ? this.colorOptions[0] : undefined;
    this.imgUrl = this.baseUrl + state?.target?.value + '/' + this.selectedColor?.code + '.jpg';
    if (this.dataShare.carSelected) {
      this.prevCarColor = this.selectedColor?.code;
    }
    else {
      this.carPicked = true;
    }
    this.dataShare.carSelected = true;
    this.dataShare.configSelected = false;
  }

  // Update car color selection.
  newColorSelected(state: any): void {
    this.imgUrl = this.baseUrl + this.selectedCar?.code + '/' + state?.target?.value + '.jpg';
    this.selectedColor = this.colorOptions?.filter((e) => e.code == state?.target?.value)[0];
  }

  // Update Car in service.
  saveCar(car: object): void {
    this.dataShare?.changeCarSelection(car);
  }

  // Unsubscribe observables and save car updates when component is removed from DOM.
  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
    if (!this.carObj) {
      this.saveCar({ car: this.selectedCar, color: this.selectedColor, imgUrl: this.imgUrl });
    }
    if (this.carObj) {
      if (this.carObj.car != this.selectedCar) {
        this.saveCar({ car: this.selectedCar, color: this.selectedColor, imgUrl: this.imgUrl });
      }

      if (this.carObj.car == this.selectedCar && this.carObj.color != this.selectedColor) {
        const car = Object.assign({}, this.carObj, { color: this.selectedColor, imgUrl: this.imgUrl });
        this.saveCar(car);
      }
    }
  }
}
