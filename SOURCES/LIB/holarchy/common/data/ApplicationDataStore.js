// @encapsule/holistic/SOURCES/LIB/holarchy/common/data/ApplictionDataStore.js
//

const arccore = require("@encapsule/arccore");
const appDataStoreConstructorFactory = require("./app-data-store-constructor-factory");
const getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");

class ApplicationDataStore {

    constructor(sharedAppDataStoreSpec_) {
        const factoryResponse = appDataStoreConstructorFactory.request(sharedAppDataStoreSpec_);
        if (factoryResponse.error) {
            throw new Error(
                [
                    "Unable to construct an ApplicationDataStore class instance due to an error in the application's shared data filter specification.",
                    factoryResponse.error
                ].join(" ")
            );
        } // if error
        const storeConstructorFilter = factoryResponse.result;
        const filterResponse = storeConstructorFilter.request();
        if (filterResponse.error) {
            throw new Error(
                [
                    "Unable to construct an ApplicationDataStore class instance due to an error executing the construction filter.",
                    filterResponse.error
                ].join(" ")
            );
        } // if error
        this.storeData = filterResponse.result;
        this.storeDataSpec = storeConstructorFilter.filterDescriptor.inputFilterSpec;
        this.accessFilters = { read: {}, write: {} };
        this.toJSON = this.toJSON.bind(this);
        this.readNamespace = this.readNamespace.bind(this);
        this.writeNamespace = this.writeNamespace.bind(this);
    } // end constructor


    toJSON() {
        // Only return the data; no other runtime state maintained by this class instance should ever be serialized.
        return this.storeData;
    }

    // Returns an arccore.filter-style response descriptor object.
    readNamespace(path_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Determine if we have already instantiated a read filter for this namespace.
            if (!this.accessFilters.read[path_]) {
                // Cache miss. Create a new read filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error) {
                    errors.push(`Cannot read app data store namespace path '${path_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `App Data Read Filter ${operationId}`,
                    operationDescription: `Validated/normalized read operations from ADS namespace '${path_}'.`,
                    bodyFunction: () => { return getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this.storeData }); },
                    outputFilterSpec: targetNamespaceSpec,
                });
                if (filterResponse.error) {
                    errors.push(`Cannot read app data store namespace path '${path_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created read filter.
                this.accessFilters.read[path_] = filterResponse.result;
            } // if read filter doesn't exist
            const readFilter = this.accessFilters.read[path_];
            methodResponse = readFilter.request();
            break;
        } // end while
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // readNamespace

    // Returns an arccore.filter-style response descriptor object.
    writeNamespace(path_, value_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Determine if we have already instantiated a read filter for this namespace.
            if (!this.accessFilters.write[path_]) {
                // Cache miss. Create a new write filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("write-filter" + path_).result;
                const pathTokens = path_.split(".");
                if (pathTokens.length < 2) {
                    errors.push(`Cannot write to app data store namespace '${path_}'; invalid attempt to overwrite the entire store.`);
                    break;
                } // if invalid write attempt
                const parentPath = pathTokens.slice(0, pathTokens.length - 1).join(".");
                const targetNamespace = pathTokens[pathTokens.length - 1];
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error) {
                    errors.push(`Cannot write app data store namespace path '${path_}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `App Data Write Filter ${operationId}`,
                    operationDescription: `Validated/normalized write to ADS namespace '${path_}'.`,
                    inputFilterSpec: targetNamespaceSpec,
                    bodyFunction: (request_) => {
                        let response = { error: null, result: undefined };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            let innerResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: parentPath, sourceRef: this.storeData });
                            if (innerResponse.error) {
                                errors.push(`Unable to write to ADS namespace '${path_}' due to an error reading parent namespace '${parentPath}'.`);
                                errors.push(innerResponse.error);
                                break;
                            }
                            let parentNamespace = innerResponse.result;
                            parentNamespace[targetNamespace] = request_; // the actual write
                            response.result = request_; // return the validated/normalized data written to the ADS
                            break;
                        }
                        if (errors.length) {
                            response.error = errors.join(" ");
                        }
                        return response;
                    },
                });
                if (filterResponse.error) {
                    errors.push(`Cannot write app data store namespace path '${path_}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created write filter.
                this.accessFilters.write[path_] = filterResponse.result;
            } // if write filter doesn't exist
            const writeFilter = this.accessFilters.write[path_];
            methodResponse = writeFilter.request(value_);
            break;
        } // end while
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // writeNamespace

} // class ApplicationDataStore

module.exports = ApplicationDataStore;