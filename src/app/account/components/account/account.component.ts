import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { SignOutMutation } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { SIGN_OUT } from './account.graphql';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vsf-account',
    templateUrl: './account.component.html',
    // styleUrls: ['./account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule]
})
export class AccountComponent {

    isSignedIn$: Observable<boolean>;

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router) {
        this.isSignedIn$ = this.stateService.select(state => state.signedIn);
    }

    signOut() {
        this.dataService.mutate<SignOutMutation>(SIGN_OUT).subscribe({
            next: () => {
                this.stateService.setState('signedIn', false);
                this.router.navigate(['/']);
            },
        });
    }
}
