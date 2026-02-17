import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStackModule } from "projects/ui/src/lib/stack/stack.module";
import { ArdiumGridModule, provideBreakpoints } from 'projects/ui/src/public-api';
import { GridPage } from './grid.page';

@NgModule({
  declarations: [GridPage],
  imports: [CommonModule, ArdiumGridModule, ArdiumStackModule],
  providers: [...provideBreakpoints()],
})
export class GridModule {}
