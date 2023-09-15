import { Component } from '@angular/core';
import { TableDataColumn, TableSubheader } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.page.html',
    styleUrls: ['./table.page.scss']
})
export class TablePage {

    constructor(private _logger: Logger) {}
    log = this._logger.log;

    complexColumns: (TableDataColumn | TableSubheader)[] = [
        {
            header: 'A',
            children: [
                {
                    header: 'B',
                    dataSource: '',
                },
                {
                    header: 'C',
                    dataSource: '',
                },
            ]
        },
        {
            header: 'D',
            children: [
                {
                    header: 'E',
                    dataSource: ''
                },
                {
                    header: 'F',
                    children: [
                        {
                            header: 'G',
                            dataSource: ''
                        },
                        {
                            header: 'H',
                            children: [
                                {
                                    header: 'I',
                                    dataSource: '',
                                },
                                {
                                    header: 'J',
                                    children: [
                                        {
                                            header: 'K',
                                            dataSource: '',
                                        },
                                        {
                                            header: 'L',
                                            children: [
                                                {
                                                    header: 'M',
                                                    dataSource: '',
                                                },
                                                {
                                                    header: 'N',
                                                    dataSource: '',
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            header: 'O',
            children: [
                {
                    header: 'P',
                    dataSource: '',
                },
                {
                    header: 'Q',
                    dataSource: '',
                },
                {
                    header: 'R',
                    children: [
                        {
                            header: 'S',
                            dataSource: '',
                        },
                        {
                            header: 'T',
                            dataSource: '',
                        },
                    ]
                },
            ]
        },
        {
            header: 'U',
            children: [
                {
                    header: 'V',
                    children: [
                        {
                            header: 'W',
                            children: [
                                {
                                    header: 'X',
                                    dataSource: ''
                                },
                                {
                                    header: 'Y',
                                    dataSource: ''
                                },
                            ]
                        },
                        {
                            header: 'Z',
                            dataSource: ''
                        },
                    ]
                },
                {
                    header: '1',
                    dataSource: ''
                },
            ]
        },
    ]

    simpleColumns: (TableDataColumn | TableSubheader)[] = [
        {
            header: 'No.',
            dataSource: { type: 'autocount' },
        },
        {
            header: 'Type',
            children: [
                {
                header: 'A',
                dataSource: '',
                },
                {
                header: 'B',
                dataSource: '',
                },
                {
                header: 'C',
                dataSource: '',
                },
            ]
        }
    ]

    peopleColumns: (TableDataColumn | TableSubheader)[] = [
        {
            header: '',
            dataSource: { type: 'checkbox' },
        },
        {
            header: 'No.',
            dataSource: { type: 'autocount' },
            isRowHeader: true,
        },
        {
            header: 'Name',
            dataSource: 'name',
            template: 'name'
        },
        {
            header: 'HR Info',
            children: [
                {
                    header: 'Role',
                    dataSource: 'role',
                },
                {
                    header: 'Salary',
                    dataSource: 'salary',
                },
            ]
        },
        {
            header: 'Contact',
            children: [
                {
                    header: 'Office',
                    dataSource: 'office',
                },
                {
                    header: 'Extn.',
                    dataSource: 'extn',
                },
                {
                    header: 'Email',
                    dataSource: 'email',
                    minWidth: 100
                },
            ]
        },
    ];

    peopleData = [
        { name: 'Airi Satou', role: 'Accountant', salary: '$162,700', office: 'Tokyo', extn: 5407, email: 'a.satou@datatables.net' },
        { name: 'Angelica Ramos', role: 'Chief Executive Officer(CEO)', salary: '$1,200,000', office: 'London', extn: 5797, email: 'a.ramos@datatables.net' },
        { name: 'Ashton Cox', role: 'Junior Technical Author', salary: '$86,000', office: 'San Francisco', extn: 1562, email: 'a.cox@datatables.net' },
        { name: 'Bradley Greer', role: 'Software Engineer', salary: '$132,000', office: 'London', extn: 2558, email: 'b.greer@datatables.net' },
        { name: 'Brenden Wagner', role: 'Software Engineer', salary: '$206,850', office: 'San Francisco', extn: 1314, email: 'b.wagner@datatables.net' },
        { name: 'Brielle Williamson', role: 'Integration Specialist', salary: '$372,000', office: 'New York', extn: 4804, email: 'b.williamson@datatables.net' },
        { name: 'Bruno Nash', role: 'Software Engineer', salary: '$163,500', office: 'London', extn: 6222, email: 'b.nash@datatables.net' },
        { name: 'Caesar Vance', role: 'Pre - Sales Support', salary: '$106,450', office: 'New York', extn: 8330, email: 'c.vance@datatables.net' },
        { name: 'Cara Stevens', role: 'Sales Assistant', salary: '$145,600', office: 'New York', extn: 3990, email: 'c.stevens@datatables.net' },
        { name: 'Cedric Kelly', role: 'Senior Javascript Developer', salary: '$433,060', office: 'Edinburgh', extn: 6224, email: 'c.kelly@datatables.net' },
    ]
}
