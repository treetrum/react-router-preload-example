import Home from "./Home";
import NotFound from "./NotFound";
import Page from "./Page";
import Project from "./Project";

const routes = [
    {
        path: "/",
        exact: true,
        component: Home
    },
    {
        path: "/project/:slug",
        component: Project
    },
    {
        path: "/not-found",
        exact: true,
        component: NotFound
    },
    {
        component: Page
    }
];

export default routes;
