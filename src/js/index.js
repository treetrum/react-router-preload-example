import ReactDOM from "react-dom";
import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Helmet from "react-helmet";

import DataFetcher from "./DataFetcher";
import routes from "./routes";

import NProgress from "nprogress";
import gql from "graphql-tag";
NProgress.configure({ minimum: 0.3 });

import { useQuery, ApolloProvider } from "react-apollo";

import client from "./client";

const query = gql`
    query globalQuery {
        generalSettings {
            description
            title
            url
        }
    }
`;

const Global = () => {
    const { loading, data } = useQuery(query);
    if (loading) return null;
    return (
        <Helmet
            defaultTitle={data.generalSettings.title}
            titleTemplate={`%s - ${data.generalSettings.title}`}
        ></Helmet>
    );
};

const App = () => {
    const [error, setError] = useState(null);

    const handleLoadingStateChange = ({ loading, error }) => {
        if (loading) {
            NProgress.start();
        } else {
            NProgress.done();
        }
        if (error) {
            setError(error);
        }
    };

    return (
        <ApolloProvider client={client}>
            <Router>
                {error ? <p>Error</p> : null}
                <Global></Global>
                <DataFetcher
                    routes={routes}
                    onLoadingStateChange={handleLoadingStateChange}
                >
                    <nav>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                            <ul>
                                <li>
                                    <Link to="/contact/contact-subchild">
                                        Contact subchild
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </nav>
                    {renderRoutes(routes)}
                </DataFetcher>
            </Router>
        </ApolloProvider>
    );
};
ReactDOM.render(<App></App>, document.getElementById("app"));
