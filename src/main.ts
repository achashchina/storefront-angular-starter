import { enableProdMode, importProvidersFrom } from "@angular/core";
import { environment } from "./environments/environment";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import {
    provideRouter,
    withDisabledInitialNavigation,
    withEnabledBlockingInitialNavigation,
} from "@angular/router";
import { routes } from "./app/app.routes";
import { CoreModule } from "./app/core/core.module";
import { SharedModule } from "./app/shared/shared.module";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideApollo } from "apollo-angular";
import { APP_BASE_HREF } from "@angular/common";
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
} from "@angular/common/http";
import { DefaultInterceptor } from "./app/core/providers/data/interceptor";
import { provideApolloClientOptions } from "./app/core/apollo-client-provider";

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(
            routes,
            withEnabledBlockingInitialNavigation(),
            withDisabledInitialNavigation()
        ),
        provideAnimations(),
        importProvidersFrom(CoreModule, SharedModule),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: APP_BASE_HREF,
            useValue: environment.baseHref,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DefaultInterceptor,
            multi: true,
        },

        provideApollo(provideApolloClientOptions),
    ],
}).catch((err) => console.error(err));
