import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {User} from '../../../../api/entities/user.entity';
import {UserApiService} from '../../../../api/user.api.service';

@Component({
    templateUrl: 'profile-dialog.component.html',
    styleUrls: ['profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
    public user: User = new User();
    public isBusy: boolean = true;

    constructor(
        private readonly userApiService: UserApiService,
        private readonly dialogRef: NbDialogRef<ProfileDialogComponent>
    ) {
        this.userApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngOnInit(): void {
        this.userApiService
            .profile()
            .subscribe((user: User) => this.user = user)
        ;
    }

    public onSubmit(): void {
        this.userApiService
            .save(this.user)
            .subscribe((user: User) => this.dialogRef.close(user))
        ;
    }
}
