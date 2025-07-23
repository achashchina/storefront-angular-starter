import { NgModule } from "@angular/core";
import { provideClientHydration } from "@angular/platform-browser";
import { ServerModule } from "@angular/platform-server";

import { AppComponent } from "./app.component";

@NgModule({
    imports: [ServerModule],
    exports: [ServerModule],
    bootstrap: [AppComponent],
    providers: [provideClientHydration()],
})
export class AppServerModule {}
