import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CartFragment } from '../../../common/generated-types';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormatPricePipe } from '../../pipes/format-price.pipe';

@Component({
  selector: 'vsf-cart-totals',
  templateUrl: './cart-totals.component.html',
  styleUrls: ['./cart-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, FormatPricePipe],
})
export class CartTotalsComponent implements OnInit {
    @Input() cart: CartFragment;
  constructor() { }

  ngOnInit(): void {
  }

}
