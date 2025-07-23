import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'vsf-checkout-stage-indicator',
    templateUrl: './checkout-stage-indicator.component.html',
    // styleUrls: ['./checkout-stage-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FontAwesomeModule, FaIconComponent],
})
export class CheckoutStageIndicatorComponent  {
    @Input() signedIn = false;
    @Input() activeStage = 1;
}
