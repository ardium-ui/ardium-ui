
import { Directive, Input, TemplateRef } from '@angular/core';
import { TableCheckboxContext } from './table.types';

@Directive({ selector: 'ard-table > ng-template[ard-table-tmp]' })
export class ArdiumTableTemplateDirective {
    @Input('ard-table-tmp') name?: string;

    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: 'ard-table > ng-template[ard-table-checkbox-tmp]' })
export class ArdiumTableCheckboxTemplateDirective {
    constructor(public template: TemplateRef<TableCheckboxContext>) { }
}

@Directive({ selector: 'ard-table > ng-template[ard-table-header-checkbox-tmp]' })
export class ArdiumTableHeaderCheckboxTemplateDirective {
    constructor(public template: TemplateRef<TableCheckboxContext>) { }
}