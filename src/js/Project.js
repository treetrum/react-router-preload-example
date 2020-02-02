import React from "react";
import client from "./client";
import gql from "graphql-tag";
import Helmet from "react-helmet";

const Project = () => {
    const { project } = window.pageData;
    return (
        <div className="page">
            <Helmet>
                <title>{project.title}</title>
            </Helmet>
            <h1>{project.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: project.content }}></div>
        </div>
    );
};

Project.preload = (location, match) => {
    const query = gql`
        query ProjectByPath($path: ID!) {
            project(id: $path, idType: SLUG) {
                title
                content
            }
        }
    `;
    return client
        .query({
            query,
            variables: { path: match.params.slug },
            client
        })
        .then(({ data }) => {
            window.pageData = data;
        });
};

export default Project;
