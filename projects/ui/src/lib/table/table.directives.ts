import { Directive, Input, TemplateRef, input } from '@angular/core';
import { TableCaptionContext, TableCheckboxContext } from './table.types';
import { PaginationContext } from '../_internal/models/pagination.model';
import { Nullable } from '../types/utility.types';

@Directive({ selector: 'ard-table > ng-template[ard-table-tmp]' })
export class ArdiumTableTemplateDirective {
  readonly name = input.required<Nullable<string>>({ alias: 'ard-table-tmp' });

  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: 'ard-table > ng-template[ard-table-checkbox-tmp]' })
export class ArdiumTableCheckboxTemplateDirective {
  constructor(public template: TemplateRef<TableCheckboxContext>) {}
}

@Directive({
  selector: 'ard-table > ng-template[ard-table-header-checkbox-tmp]',
})
export class ArdiumTableHeaderCheckboxTemplateDirective {
  constructor(public template: TemplateRef<TableCheckboxContext>) {}
}

@Directive({ selector: 'ard-table > ng-template[ard-table-caption-tmp]' })
export class ArdiumTableCaptionTemplateDirective {
  constructor(public template: TemplateRef<TableCaptionContext>) {}
}

//! paginations
@Directive({ selector: 'ard-table > ng-template[ard-table-pagination-tmp]' })
export class ArdiumTablePaginationTemplateDirective {
  constructor(public template: TemplateRef<PaginationContext>) {}
}
