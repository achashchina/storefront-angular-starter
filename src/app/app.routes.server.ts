import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
    {
        path: "**",
        renderMode: RenderMode.Server,
    },
    {
        path: "",

        renderMode: RenderMode.Server,
    },
    {
        path: "category/:slug",
        renderMode: RenderMode.Server,
    },
    {
        path: "search",
        renderMode: RenderMode.Server,
    },
    {
        path: "product/:slug",
        renderMode: RenderMode.Server,
    },
    {
        path: "account",
        renderMode: RenderMode.Server,
    },
    {
        path: "checkout",
        renderMode: RenderMode.Server,
    },
];
