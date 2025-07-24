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

import {
    provideClientHydration,
    withEventReplay,
} from "@angular/platform-browser";
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
console.log(999);
export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(withEventReplay()),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withEnabledBlockingInitialNavigation()),
        provideAnimations(),
        // importProvidersFrom(CoreModule, SharedModule), 
        provideHttpClient(withFetch()),
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
};
