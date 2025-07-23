import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";

import { GetCollectionQuery } from "../../../common/generated-types";
import { CommonModule } from "@angular/common";
import {
    FaIconComponent,
    FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";

@Component({
    selector: "vsf-collection-breadcrumbs",
    templateUrl: "./collection-breadcrumbs.component.html",
    styleUrls: ["./collection-breadcrumbs.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        FaIconComponent,
        RouterModule,
    ],
})
export class CollectionBreadcrumbsComponent {
    @Input() breadcrumbs?: NonNullable<
        GetCollectionQuery["collection"]
    >["breadcrumbs"] = [];
    @Input() linkLast = false;

    tail<T>(arr: T[] | null): T[] {
        return arr ? arr.slice(1) : [];
    }
}
