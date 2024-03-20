import {Injectable} from '@angular/core';
import {CalendarApiService} from '../../api/calendar.api.service';
import {Calendar} from '../../api/entities/calendar.entity';
import {Expense} from '../../api/entities/expense.entity';
import {User} from '../../api/entities/user.entity';
import {Balance, CalendarExpenseListResponse} from '../../api/response/calendar-expense-list.response';
import {DateRangeChangeEvent} from './calendar/events/date-range-change.event';

@Injectable()
export class MainService {
    public user: User;
    public selectedDate: Date;
    public calendar: Calendar;
    public dateRange: DateRangeChangeEvent;
    public expenses: Expense[] = [];
    public balances: Balance[] = [];

    constructor(
        private readonly calendarApiService: CalendarApiService,
    ) {
    }

    public fetchExpenses(): void {
        if (!this.calendar || !this.dateRange) {
            return;
        }

        this.calendarApiService
            .listExpenses(this.calendar, this.dateRange.fromDate, this.dateRange.toDate)
            .subscribe((response: CalendarExpenseListResponse) => {
                this.expenses = response.expenses;
                this.balances = response.balances;
            })
        ;
    }
}
