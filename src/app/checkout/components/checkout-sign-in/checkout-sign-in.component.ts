import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from 'src/app/shared/components/sign-in/sign-in.component';

@Component({
    selector: 'vsf-checkout-sign-in',
    templateUrl: './checkout-sign-in.component.html',
    styleUrls: ['./checkout-sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, SignInComponent]
})
export class CheckoutSignInComponent {
}
