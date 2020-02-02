import React, { useContext } from "react";
import client from "../client";
import gql from "graphql-tag";
import Helmet from "react-helmet";
import { Context } from "../store";

const Project = () => {
    const { project } = useContext(Context).state;
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

Project.preload = ({ match, passed: { setState } }) => {
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
            setState({ project: data.project });
        });
};

export default Project;
