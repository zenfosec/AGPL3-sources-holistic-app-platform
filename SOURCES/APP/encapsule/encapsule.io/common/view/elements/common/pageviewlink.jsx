// pageviewlink.jsx

const React = require('react');

module.exports = class HolisticPageViewLink extends React.Component {

    render() {
        try {
            const viewStore = this.props.appStateContext.viewStore;
            const pageViewURI = this.props.pageViewURI;

            var pageProperties = viewStore.getVertexProperty(pageViewURI);
            if (!pageProperties) {
                return (<span>Unknown page view URI '{pageViewURI}'</span>);
            }
            const active = this.props.active;
            if (active) {
                return (<span>{pageProperties.name}</span>);
            }
            return (<a href={pageViewURI}>{pageProperties.name}</a>);
        } catch (exception_) {
            return (<div>A fatal exception occurred in {this.className}: {exception_.toString()}</div>);
        }
    }

}
