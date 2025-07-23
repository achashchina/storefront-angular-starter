import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SearchProductsQuery } from '../../../common/generated-types';
import { AssetPreviewPipe } from 'src/app/shared/pipes/asset-preview.pipe';

@Component({
    selector: 'vsf-product-card',
    templateUrl: './product-card.component.html',
    // styleUrls: ['./product-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AssetPreviewPipe]
})
export class ProductCardComponent {

    @Input() product: SearchProductsQuery['search']['items'][number];
}
