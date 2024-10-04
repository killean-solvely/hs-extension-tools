"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
const ui_extensions_1 = require("@hubspot/ui-extensions");
const react_1 = require("react");
const useQuery = (context) => (fnType, params, options = {}) => {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const [isError, setIsError] = (0, react_1.useState)(false);
    async function refetch({ 
    // @ts-ignore
    parameters, 
    // @ts-ignore
    propertiesToSend, }) {
        if (!context) {
            throw new Error("No context provided");
        }
        setLoading(true);
        try {
            const result = (await context.runServerlessFunction({
                name: fnType,
                parameters,
                propertiesToSend,
            }));
            switch (result.status) {
                case ui_extensions_1.ServerlessExecutionStatus.Error:
                    setError(result.message);
                    setIsError(true);
                    options.onError?.(result.message);
                    return null;
                case ui_extensions_1.ServerlessExecutionStatus.Success: {
                    setData(result.response.data);
                    options.onSuccess?.(result.response.data);
                    return result.response.data;
                }
            }
        }
        catch (error) {
            setError(error);
            setIsError(true);
            options.onError?.(error);
            return null;
        }
        finally {
            setLoading(false);
        }
    }
    (0, react_1.useEffect)(() => {
        if (params && options.runOnCreate) {
            refetch(params);
        }
    }, []);
    return { data, loading, error, isError, refetch };
};
exports.useQuery = useQuery;
