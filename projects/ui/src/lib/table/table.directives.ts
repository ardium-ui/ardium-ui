import { Directive, TemplateRef, input } from '@angular/core';
import { PaginationContext } from '../_internal/models/pagination.model';
import { Nullable } from '../types/utility.types';
import { TableCaptionContext, TableCheckboxContext } from './table.types';

@Directive({ standalone: false, selector: 'ard-table > ng-template[ard-table-tmp]' })
export class ArdiumTableTemplateDirective {
  readonly name = input.required<Nullable<string>>({ alias: 'ard-table-tmp' });

  constructor(public template: TemplateRef<any>) {}
}

@Directive({ standalone: false, selector: 'ard-table > ng-template[ard-table-checkbox-tmp]' })
export class ArdiumTableCheckboxTemplateDirective {
  constructor(public template: TemplateRef<TableCheckboxContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-table > ng-template[ard-table-header-checkbox-tmp]',
})
export class ArdiumTableHeaderCheckboxTemplateDirective {
  constructor(public template: TemplateRef<TableCheckboxContext>) {}
}

@Directive({ standalone: false, selector: 'ard-table > ng-template[ard-table-caption-tmp]' })
export class ArdiumTableCaptionTemplateDirective {
  constructor(public template: TemplateRef<TableCaptionContext>) {}
}

//! paginations
@Directive({ standalone: false, selector: 'ard-table > ng-template[ard-table-pagination-tmp]' })
export class ArdiumTablePaginationTemplateDirective {
  constructor(public template: TemplateRef<PaginationContext>) {}
}
