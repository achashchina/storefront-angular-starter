import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { StateService } from '../../providers/state/state.service';
import { CommonModule } from '@angular/common';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'vsf-mobile-menu-toggle',
    templateUrl: './mobile-menu-toggle.component.html',
    // styleUrls: ['./mobile-menu-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FontAwesomeModule, FaIconComponent],
})
export class MobileMenuToggleComponent {

    constructor(private stateService: StateService) {}

    toggle() {
        this.stateService.setState('mobileNavMenuIsOpen', true);
    }
}
