import { Routes } from '@angular/router';
import { FirstStepComponent } from './components/first-step/first-step.component';
import { SecondStepComponent } from './components/second-step/second-step.component';
import { ThirdStepComponent } from './components/third-step/third-step.component';
import { DataShareService } from './services/data-share-service/data-share.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'step1',
    component: FirstStepComponent,
    title: 'Step 1',
    canDeactivate: [
      () => inject(DataShareService).carSelected
    ]
  },
  {
    path: 'step2',
    component: SecondStepComponent,
    title: 'Step 2'
  },
  {
    path: 'step3',
    component: ThirdStepComponent,
    title: 'Step 3',
    canActivate: [
      () => inject(DataShareService).configSelected
    ]
  },
  {
    path: '**',
    redirectTo: 'step1',
    pathMatch: 'full'
  }
];
