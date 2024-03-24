import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {User} from '../../api/entities/user.entity';
import {ExpenseApiService} from '../../api/expense.api.service';
import {MainService} from './main.service';

@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
    public user: User;
    public isBusy: boolean = false;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly cd: ChangeDetectorRef,
        private readonly expenseApiService: ExpenseApiService,
        private readonly breakpointService: NbMediaBreakpointsService,
        public readonly mainService: MainService,
    ) {
        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngAfterViewInit(): void {
        // Detect changes again as calendar-list should be reselected active calendar
        this.cd.detectChanges();
    }

    public ngOnInit(): void {
        console.log(this.breakpointService.getBreakpoints());
        console.log(this.breakpointService.getBreakpointsMap());
        console.log(window.innerWidth);

        this.activatedRoute.data.subscribe(({ user }: { user: User }) => {
            this.mainService.user = user;
        });

        this.activatedRoute.queryParams.subscribe(({ts}) => {
            const date = new Date(parseInt(ts));
            if (date.toString() !== 'Invalid Date') {
                this.mainService.selectedDate = date;
            } else {
                this.mainService.selectedDate = new Date();
            }
        });
    }
}
