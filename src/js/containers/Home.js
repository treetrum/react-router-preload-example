import React, { useContext } from "react";
import client from "../client";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { Context } from "../store";

const Home = () => {
    const state = useContext(Context).state;
    const { page } = state;
    const projects = state.projects.edges.map(({ node }) => node);
    return (
        <div className="app">
            <h1>{page.title}</h1>
            <div
                dangerouslySetInnerHTML={{
                    __html: page.content
                }}
            ></div>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <Link to={project.uri}>{project.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

Home.preload = ({ passed: { setState } }) => {
    const query = gql`
        query getPageData {
            page(id: "/home", idType: URI) {
                title
                content
            }
            projects {
                edges {
                    node {
                        id
                        title
                        content
                        uri
                    }
                }
            }
        }
    `;
    return client.query({ query, client }).then(({ data }) => {
        setState({ page: data.page, projects: data.projects });
    });
};

export default Home;
