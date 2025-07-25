import {
    ApplicationConfig,
    importProvidersFrom,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
} from "@angular/router";

import { routes } from "./app.routes";
import { APP_BASE_HREF } from "@angular/common";
import {
    provideHttpClient,
    HTTP_INTERCEPTORS,
    withFetch,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideApollo } from "apollo-angular";
import { environment } from "src/environments/environment";
import { provideApolloClientOptions } from "./core/apollo-client-provider";
import { CoreModule } from "./core/core.module";
import { DefaultInterceptor } from "./core/providers/data/interceptor";
import { SharedModule } from "./shared/shared.module";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideApollo(provideApolloClientOptions),
        {
            provide: APP_BASE_HREF,
            useValue: environment.baseHref,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DefaultInterceptor,
            multi: true,
        },
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimations(),
        importProvidersFrom(CoreModule, SharedModule), 
    ],
};
