import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RequestPasswordResetMutation, RequestPasswordResetMutationVariables } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';

import { REQUEST_PASSWORD_RESET } from './forgotten-password.graphql';
import { CenteredCardComponent } from 'src/app/shared/components/centered-card/centered-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'vsf-forgotten-password',
    templateUrl: './forgotten-password.component.html',
    styleUrls: ['./forgotten-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, FormsModule, CenteredCardComponent]
})
export class ForgottenPasswordComponent {
    emailAddress = '';
    submitted = false;

    constructor(private dataService: DataService, private route: ActivatedRoute) {
        this.emailAddress = this.route.snapshot.paramMap.get('email') ?? '';
    }

    resetPassword() {
        this.dataService.mutate<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(REQUEST_PASSWORD_RESET, {
            emailAddress: this.emailAddress,
        }).subscribe(() => {
            this.submitted = true;
        });
    }
}
