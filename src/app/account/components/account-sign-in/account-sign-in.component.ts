import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SignInComponent } from 'src/app/shared/components/sign-in/sign-in.component';

@Component({
  selector: 'vsf-account-sign-in',
  templateUrl: './account-sign-in.component.html',
  styleUrls: ['./account-sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SignInComponent]
})
export class AccountSignInComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
