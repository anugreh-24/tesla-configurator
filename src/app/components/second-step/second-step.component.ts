import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfigService } from '../../services/config-service/config.service';
import { NgFor, NgIf } from '@angular/common';
import { DataShareService } from '../../services/data-share-service/data-share.service';
import { Subscription } from 'rxjs';
import { Car, Config } from '../interfaces';

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent implements OnInit, OnDestroy {

  // Initializing subscription to be used.
  subscription1$?: Subscription;
  subscription2$?: Subscription;
  subscriptions: Subscription[] = [];

  // Injecting services to be used.
  private dataShare = inject(DataShareService);
  private config = inject(ConfigService);

  // Initailizing variables to be used.
  carObj?: Car;
  carCode: string = '';
  configOptions: Config[] = [];
  range?: number;
  maxSpeed?: number;
  cost?: number;
  selectedConfig?: Config;
  isconfigSelected: boolean = false;
  towFlag: boolean = false;
  yokeFlag: boolean = false;
  isTowChecked: boolean = false;
  isYokeChecked: boolean = false;
  imgUrl: string = '';
  prevConfig?: number;

  // Initialize component.
  ngOnInit(): void {
    this.getCarData();
  }

  // Get data for selected car in step 1.
  getCarData(): void {
    this.subscription1$ = this.dataShare?.selectedCar?.subscribe(data => {
      if (data) {
        this.carObj = data;
        this.carCode = data.car.code;
        this.getConfigData();
        this.imgUrl = data.imgUrl;
        if (data?.config) {
          this.prevConfig = data.config.id;
          this.selectedConfig = data.config;
          this.isconfigSelected = true;
          this.range = data.config.range;
          this.maxSpeed = data.config.speed;
          this.cost = data.config.price;
        };
        if (data?.isTowChecked) {
          this.isTowChecked = true;
        };
        if (data?.isYokeChecked) {
          this.isYokeChecked = true;
        };
      }
    })
    this.subscriptions?.push(this.subscription1$);
  }

  // Get config data for selected car in step 1.
  getConfigData(): void {
    this.subscription2$ = this.config?.configs(this.carCode).subscribe((data: any) => {
      if (data) {
        this.configOptions = data.configs;
        this.towFlag = data.towHitch;
        this.yokeFlag = data.yoke;

      }

    });
    this.subscriptions?.push(this.subscription2$);
  }

  // Update config selection.
  newConfigSelected(state: any): void {
    this.range = this.configOptions[state.target.value - 1]?.range;
    this.maxSpeed = this.configOptions[state.target.value - 1]?.speed;
    this.cost = this.configOptions[state.target.value - 1]?.price;
    this.isconfigSelected = true;
    this.dataShare.configSelected = true;
    this.selectedConfig = this.configOptions.filter((e) => e.id == state?.target?.value)[0];
  }

  // Update tow hitch checkbox selection.
  towHitchToggle(state: any): void {
    this.isTowChecked = state?.target?.checked;
  }

  // Update yoke checkbox selection.
  yokeToggle(state: any): void {
    this.isYokeChecked = state?.target?.checked;
  }

  // Update Car in service.
  saveCar(config: Car): void {
    const car = Object.assign({}, this.carObj, config);
    this.dataShare?.changeCarSelection(car);
  }

  // Unsubscribe observables and save car updates when component is removed from DOM.
  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
    if (!this.carObj?.config) {
      this.saveCar({ config: this.selectedConfig, isTowChecked: this.isTowChecked, isYokeChecked: this.isYokeChecked });
    }
    else {
      if (this.carObj.config != this.selectedConfig || this.carObj.isTowChecked != this.isTowChecked || this.carObj.isYokeChecked != this.isYokeChecked) {
        this.saveCar({ config: this.selectedConfig, isTowChecked: this.isTowChecked, isYokeChecked: this.isYokeChecked });
      }
    }
  }
}
