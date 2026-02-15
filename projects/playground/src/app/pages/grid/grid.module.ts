import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumGridModule, provideBreakpoints } from 'projects/ui/src/public-api';
import { GridPage } from './grid.page';

@NgModule({
  declarations: [GridPage],
  imports: [CommonModule, ArdiumGridModule],
  providers: [...provideBreakpoints()],
})
export class GridModule {}
