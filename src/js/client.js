import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: "https://wp.sjdco.test/graphql"
});

export default client;
