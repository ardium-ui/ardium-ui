import { Directive, Input, TemplateRef } from '@angular/core';
import { TableCaptionContext, TableCheckboxContext } from './table.types';
import { PaginationContext } from '../_internal/models/pagination.model';

@Directive({ selector: 'ard-table > ng-template[ard-table-tmp]' })
export class ArdiumTableTemplateDirective {
  @Input('ard-table-tmp') name?: string;

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
