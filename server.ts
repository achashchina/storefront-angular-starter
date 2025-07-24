import "zone.js/node";

import express, { RequestHandler } from "express";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { renderApplication } from "@angular/platform-server";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "src/app/app.component";
import { provideServerRendering } from "@angular/platform-server";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from "@angular/common/http";
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
} from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { REQUEST } from "src/express.tokens";
import { provideApollo } from "apollo-angular";
import { routes } from "src/app/app.routes";
import { provideApolloClientOptions } from "src/app/core/apollo-client-provider";

const server = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const browserDistFolder = resolve(__dirname, "../browser");

const indexHtml = join(browserDistFolder, "index.html");

server.set("view engine", "html");
server.set("views", browserDistFolder);

server.get(
    "*.*",
    express.static(browserDistFolder, { maxAge: "1y" }) as RequestHandler
);

server.get("*", async (req, res) => {
    try {
        const html = await renderApplication(
            () =>
                bootstrapApplication(AppComponent, {
                    providers: [
                        provideServerRendering(),
                        provideAnimations(),
                        provideHttpClient(
                            withFetch(),
                            withInterceptorsFromDi()
                        ),
                        provideRouter(
                            routes,
                            withEnabledBlockingInitialNavigation()
                        ),
                        { provide: REQUEST, useValue: req },
                        provideApollo(provideApolloClientOptions),
                        { provide: APP_BASE_HREF, useValue: req.baseUrl },
                    ],
                }),
            {
                document: indexHtml,
                url: req.originalUrl,
            }
        );
        res.send(html);
    } catch (err) {
        console.error("SSR error:", err);
        res.status(500).send(err);
    }
});

export const reqHandler = server;

export const staticFilesHandler = express.static(browserDistFolder, {
    maxAge: "1y",
});

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || 4000;
    server.listen(port, () =>
        console.log(`Node Express server listening on http://localhost:${port}`)
    );
}
