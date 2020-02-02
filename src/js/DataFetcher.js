import React from "react";
import { withRouter, Route } from "react-router-dom";
import { matchRoutes } from "react-router-config";

class PendingNavDataLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previousLocation: null,
            currentLocation: this.props.location,
            initialLoading: true,
            error: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        const currentLocation = props.location;
        const previousLocation = state.currentLocation;
        const navigated = currentLocation !== previousLocation;
        if (navigated) {
            // save the location so we can render the old screen
            return {
                previousLocation,
                currentLocation
            };
        }
        return null;
    }

    componentDidMount() {
        this.props.onLoadingStateChange({ loading: true, initial: true });
        this.fetchComponentData(true).then(() => {
            this.setState({ initialLoading: false });
        });
    }

    componentDidUpdate(prevProps) {
        const navigated = prevProps.location !== this.props.location;
        if (navigated) {
            this.fetchComponentData();
        }
    }

    fetchComponentData(initial) {
        const found = matchRoutes(
            this.props.routes,
            this.props.location.pathname
        );
        const promises = found.map(({ route, match }) => {
            if (route.component.preload) {
                return route.component.preload(this.props.location, match);
            } else {
                return Promise.resolve();
            }
        });
        if (!initial) {
            this.props.onLoadingStateChange({ loading: true });
        }
        return Promise.all(promises)
            .then(() => {
                this.setState({ previousLocation: null });
                this.props.onLoadingStateChange({ loading: false });
            })
            .catch(error => {
                this.setState({ error });
                this.props.onLoadingStateChange({
                    loading: false,
                    error
                });
            });
    }

    render() {
        const { children, location } = this.props;
        const { previousLocation } = this.state;

        if (this.state.initialLoading || this.state.error) {
            return null;
        }

        // use a controlled <Route> to trick all descendants into
        // rendering the old location
        return (
            <Route
                location={previousLocation || location}
                render={() => children}
            />
        );
    }
}

// wrap in withRouter
export default withRouter(PendingNavDataLoader);
