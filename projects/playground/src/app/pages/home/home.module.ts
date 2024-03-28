import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePage } from './home.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, RouterModule],
})
export class HomeModule {}
