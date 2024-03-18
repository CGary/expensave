import {Component} from '@angular/core';
import {deepExtend} from '@nebular/auth';
import {NbCalendarDayCellComponent, NbDateService, NbDialogService} from '@nebular/theme';
import {plainToInstance} from 'class-transformer';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Expense} from '../../../../api/entities/expense.entity';
import {ExpenseApiService} from '../../../../api/expense.api.service';
import {DateUtil} from '../../../../util/date.util';
import {EntityUtil} from '../../../../util/entity.util';
import {ExpenseDialogComponent} from '../../dialogs/expense-dialog/expense-dialog.component';
import {ExpenseListDialogComponent} from '../../dialogs/expense-list-dialog/expense-list-dialog.component';
import {MainService} from '../../main.service';

export const EXPENSE_LIST_OFFSET = 36;
export const EXPENSE_LIST_ITEM_HEIGHT = 21;

@Component({
    templateUrl: 'calendar-grid-row-cell.component.html',
    styleUrls: ['calendar-grid-row-cell.component.scss']
})
export class CalendarGridRowCellComponent extends NbCalendarDayCellComponent<Date> {
    public rowHeight: number = 0;
    public expenseListHeight: number = 0;
    public expenseListCapacity: number = 1;
    public calendar: Calendar;
    private _expenses: Expense[] = [];

    constructor(
        public dateService: NbDateService<Date>,
        private dialogService: NbDialogService,
        private mainService: MainService,
        private expenseApiService: ExpenseApiService
    ) {
        super(dateService);
    }

    get expenses(): Expense[] {
        return this._expenses;
    }

    set expenses(value: Expense[]) {
        this._expenses = value.filter((expense: Expense) => {
            return expense.createdAt.toDateString() === this.date.toDateString();
        });
    }

    get expenseSum(): string {
        let sum = 0;
        this._expenses.forEach((expense: Expense) => {
            if (expense.confirmed) {
                sum += expense.amount;
            }
        });

        return sum.toFixed(2);
    }

    get totalExpenseSum(): number {
        return 0;
    }

    public getVisibleExpenses(): Expense[] {
        return this._expenses.slice(0, this.expenseListCapacity);
    }

    public countInvisibleExpenses(): number {
        const visibleCount = this.getVisibleExpenses().length;
        const totalCount = this._expenses.length;

        if (totalCount > visibleCount) {
            return totalCount - visibleCount;
        }

        return 0;
    }

    public onRowHeightChange(newHeight: number): void {
        this.rowHeight = newHeight;
        this.expenseListHeight = newHeight - EXPENSE_LIST_OFFSET;
        this.expenseListCapacity = Math.floor(this.expenseListHeight / EXPENSE_LIST_ITEM_HEIGHT) - 1;
    }

    public openInvisibleExpenses(): void {
        this.dialogService.open(ExpenseListDialogComponent, {
                context: {
                    visibleDate: this.visibleDate,
                    expenses: this._expenses,
                }
            }
        );
    }

    public editExpense(expenseId: number): void {
        this.expenseApiService
            .get(expenseId)
            .subscribe((expense: Expense) => {
                this.openExpenseDialog(expense, () => this.mainService.fetchExpenses());
            });
    }

    public createExpense(): void {
        const expense = plainToInstance(Expense, {
            createdAt: DateUtil.setTime(this.date, new Date()),
            calendar: this.calendar,
            user: this.mainService.user,
            confirmed: true,
        });

        this.openExpenseDialog(expense, () => this.mainService.fetchExpenses());
    }

    private openExpenseDialog(expense: Expense, onClose: (result: Expense) => void): void {
        this.dialogService
            .open(ExpenseDialogComponent, {
                context: {
                    expense: expense,
                    calendars: this.mainService.user.calendars,
                }
            })
            .onClose
            .subscribe((result: Expense) => {
                if (result) {
                    onClose(result);
                }
            })
        ;
    }
}
