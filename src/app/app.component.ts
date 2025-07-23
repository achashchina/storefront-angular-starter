import {
    Component,
    DOCUMENT,
    Inject,
    OnInit,
    PLATFORM_ID,
} from "@angular/core";
import {
    NavigationEnd,
    Router,
    RouterEvent,
    RouterModule,
    UrlSerializer,
} from "@angular/router";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import {
    GetCollectionsQuery,
    GetCollectionsQueryVariables,
} from "./common/generated-types";
import { GET_COLLECTIONS } from "./common/graphql/documents.graphql";
import { DataService } from "./core/providers/data/data.service";
import { StateService } from "./core/providers/state/state.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { LayoutComponent } from "./core/components/layout/layout.component";
import { MobileMenuToggleComponent } from "./core/components/mobile-menu-toggle/mobile-menu-toggle.component";
import { AccountLinkComponent } from "./core/components/account-link/account-link.component";
import { CollectionsMenuMobileComponent } from "./core/components/collections-menu-mobile/collections-menu-mobile.component";
import { CollectionsMenuComponent } from "./core/components/collections-menu/collections-menu.component";
import { LayoutFooterComponent } from "./core/components/layout/layout-footer.component";
import { CartDrawerComponent } from "./core/components/cart-drawer/cart-drawer.component";
import { ProductSearchBarComponent } from "./core/components/product-search-bar/product-search-bar.component";
import { LayoutHeaderComponent } from "./core/components/layout/layout-header.component";
import { CartToggleComponent } from "./core/components/cart-toggle/cart-toggle.component";
import { CoreModule } from "./core/core.module";

const IMPORTS = [
    CommonModule,
    CoreModule,
    RouterModule,
    LayoutComponent,
    LayoutFooterComponent,
    LayoutHeaderComponent,
    MobileMenuToggleComponent,
    AccountLinkComponent,
    CollectionsMenuMobileComponent,
    CollectionsMenuComponent,
    CartDrawerComponent,
    ProductSearchBarComponent,
    CartToggleComponent
];

@Component({
    selector: "vsf-root",
    templateUrl: "./app.component.html",
    imports: [...IMPORTS],
    standalone: true
    // styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    cartDrawerVisible$: Observable<boolean>;
    mobileNavVisible$: Observable<boolean>;
    isHomePage$: Observable<boolean>;
    topCollections$: Observable<GetCollectionsQuery["collections"]["items"]>;

    navigation = {
        support: [
            { name: "Help", href: "#" },
            { name: "Track order", href: "#" },
            { name: "Shipping", href: "#" },
            { name: "Returns", href: "#" },
        ],
        company: [
            { name: "About", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Corporate responsibility", href: "#" },
            { name: "Press", href: "#" },
        ],
    };

    constructor(
        private router: Router,
        private stateService: StateService,
        private dataService: DataService,
        private urlSerializer: UrlSerializer,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(DOCUMENT) private document?: Document
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.handleScrollOnNavigations();
        }
    }

    ngOnInit(): void {
        this.cartDrawerVisible$ = this.stateService.select(
            (state) => state.cartDrawerOpen
        );
        this.mobileNavVisible$ = this.stateService.select(
            (state) => state.mobileNavMenuIsOpen
        );
        this.isHomePage$ = this.router.events.pipe(
            filter<any>((event) => event instanceof RouterEvent),
            map((event: RouterEvent) => event.url === "/")
        );
        this.topCollections$ = this.dataService
            .query<GetCollectionsQuery, GetCollectionsQueryVariables>(
                GET_COLLECTIONS,
                {
                    options: { take: 25, topLevelOnly: true },
                }
            )
            .pipe(map(({ collections }) => collections.items));
    }

    openCartDrawer() {
        this.stateService.setState("cartDrawerOpen", true);
    }

    closeCartDrawer() {
        this.stateService.setState("cartDrawerOpen", false);
    }

    /**
     * A work-around for undesirable scoll behaviour caused by the router's `scrollPositionRestoration` setting.
     * When set to 'enabled', it correctly handles scrolling to the top on navigation, and preserving scroll position
     * on "back" navigation. However, it _also_ causes the page to scroll to the top when changing search facet value filters,
     * which is very undesirable. Since there seems to be currently no way to disable the scrolling on a per-navigation basis,
     * we are manually implementing scroll-to-top-on-nav and adding an exception for when the "facets" param of the "category"
     * routes change.
     */
    private handleScrollOnNavigations() {
        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe((event) => {
                if (this.document?.defaultView) {
                    const parsed = this.urlSerializer.parse(
                        event.urlAfterRedirects
                    );
                    const primaryRoot = parsed.root.children.primary;
                    const isFacetFilterNavigation =
                        primaryRoot?.segments[0]?.path === "category" &&
                        primaryRoot?.segments[1]?.parameterMap.has("facets");

                    if (!isFacetFilterNavigation) {
                        this.document.defaultView.scrollTo({
                            top: 0,
                        });
                    }
                }
            });
    }
}
