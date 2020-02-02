import ReactDOM from "react-dom";
import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Helmet from "react-helmet";
import NProgress from "nprogress";
import gql from "graphql-tag";
import { useQuery, ApolloProvider } from "react-apollo";

import { Context, AppStore } from "./store";
import routes from "./routes";
import client from "./client";
import DataFetcher from "./DataFetcher";

const AppInner = ({ setInnerLoading }) => {
    const { loading, data } = useQuery(gql`
        query navQuery {
            generalSettings {
                description
                title
                url
            }
            sjdcoOptions {
                siteOptions {
                    menuLinks {
                        link {
                            type
                            customLink {
                                link
                                newTab
                                title
                            }
                            page {
                                target
                                title
                                url
                            }
                        }
                    }
                }
            }
        }
    `);

    setInnerLoading(loading);

    if (loading) return null;

    const navLinks = data.sjdcoOptions.siteOptions.menuLinks.map(
        ({ link }) => link
    );

    const global = data.generalSettings;

    return (
        <>
            <Helmet
                defaultTitle={global.title}
                titleTemplate={`%s - ${global.title}`}
            ></Helmet>
            <nav>
                {navLinks.map((link, index) => {
                    if (link.type === "custom") {
                        return (
                            <li key={index}>
                                <a
                                    href={link.customLink.link}
                                    target={
                                        link.customLink.newTab ? "_blank" : null
                                    }
                                >
                                    {link.customLink.title}
                                </a>
                            </li>
                        );
                    } else {
                        return (
                            <li key={index}>
                                <Link
                                    to={link.page.url}
                                    target={link.page.target}
                                >
                                    {link.page.title}
                                </Link>
                            </li>
                        );
                    }
                })}
            </nav>
            {renderRoutes(routes)}
        </>
    );
};

const AppOuter = () => {
    const [innerLoading, setInnerLoading] = useState(true);

    const handleLoadingStateChange = ({ loading } = {}) => {
        if (loading || innerLoading) {
            NProgress.start();
        } else {
            NProgress.done();
        }
    };

    React.useEffect(handleLoadingStateChange, [innerLoading]);

    return (
        <AppStore>
            <Context.Consumer>
                {contextValue => (
                    <ApolloProvider client={client}>
                        <Router>
                            <DataFetcher
                                routes={routes}
                                onLoadingStateChange={handleLoadingStateChange}
                                passToPreload={contextValue}
                            >
                                <AppInner setInnerLoading={setInnerLoading} />
                            </DataFetcher>
                        </Router>
                    </ApolloProvider>
                )}
            </Context.Consumer>
        </AppStore>
    );
};
ReactDOM.render(<AppOuter></AppOuter>, document.getElementById("app"));
