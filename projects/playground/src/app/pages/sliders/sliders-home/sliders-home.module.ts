import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidersHomePage } from './sliders-home.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SlidersHomePage],
  imports: [CommonModule, RouterModule],
})
export class SlidersHomeModule {}
