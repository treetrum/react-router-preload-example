import React from "react";
import client from "./client";
import gql from "graphql-tag";
import Helmet from "react-helmet";
import NotFound from "./NotFound";

const Page = () => {
    const { page } = window.pageData;
    if (!page) {
        return <NotFound></NotFound>;
    }
    return (
        <div className="page">
            <Helmet>
                <title>{page.title}</title>
            </Helmet>
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
        </div>
    );
};

Page.preload = () => {
    const query = gql`
        query PageByPath($pagePath: ID!) {
            page(id: $pagePath, idType: URI) {
                title
                content
            }
        }
    `;
    return client
        .query({
            query,
            variables: { pagePath: window.location.pathname },
            client
        })
        .then(({ data }) => {
            window.pageData = data;
        });
};

export default Page;
