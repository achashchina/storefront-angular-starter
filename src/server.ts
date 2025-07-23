import { APP_BASE_HREF } from "@angular/common";
import { renderApplication } from "@angular/platform-server";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { provideServerRendering } from "@angular/platform-server";
import { AppComponent } from "src/app/app.component";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from "@angular/common/http";
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
} from "@angular/router";
import { provideApollo } from "apollo-angular";
import { routes } from "src/app/app.routes";
import { REQUEST } from "src/express.tokens";
import { provideApolloClientOptions } from "src/app/core/apollo-client-provider";

export default function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, "../browser");
    const indexHtml = join(serverDistFolder, "index.html");

    server.set("view engine", "html");
    server.set("views", browserDistFolder);

    server.get(
        "*.*",
        express.static(browserDistFolder, {
            maxAge: "1y",
        })
    );

    server.get("*", async (req, res) => {
        try {
            const html = await renderApplication(
                () =>
                    bootstrapApplication(AppComponent, {
                        providers: [
                            provideServerRendering(),
                            provideAnimations(),
                            provideHttpClient(withInterceptorsFromDi()),
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
                    // appId: 'serverApp',
                    document: indexHtml,
                    url: req.originalUrl,
                }
            );
            res.send(html);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

    return server;
}

function run(): void {
    const port = process.env.PORT || 4000;
    const server = app();
    server.listen(port, () => {
        console.log(
            `Node Express server listening on http://localhost:${port}`
        );
    });
}

run();
