import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Page from "./containers/Page";
import Project from "./containers/Project";

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
