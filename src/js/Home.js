import React from "react";
import client from "./client";
import gql from "graphql-tag";
import { Link } from "react-router-dom";

const Home = () => {
    const { page } = window.pageData;
    const projects = window.pageData.projects.edges.map(({ node }) => node);
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

Home.preload = () => {
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
        window.pageData = data;
    });
};

export default Home;
