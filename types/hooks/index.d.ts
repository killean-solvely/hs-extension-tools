import React from "react";
import { ExtensionPointApi } from "@hubspot/ui-extensions";
export default function buildExtension<T extends Record<string, any>>(Extension: React.FC<{
    context: ExtensionPointApi<"crm.preview">;
}>): () => {
    useMutation: <FnType extends keyof T, FnRunnerParams extends import("..").ServerlessRunnerParamsMapping<T>[FnType] = import("..").ServerlessRunnerParamsMapping<T>[FnType], FnResponseData extends import("..").ServerlessResponseDataMapping<T>[FnType] = import("..").ServerlessResponseDataMapping<T>[FnType]>(fnType: FnType, options?: import("./useMutation").MutationOptions<FnResponseData>) => {
        mutate: ({ parameters, propertiesToSend, }: Omit<FnRunnerParams, "name">) => Promise<FnResponseData | null>;
        data: FnResponseData | null;
        loading: boolean;
        error: string;
        isError: boolean;
    };
    useQuery: <FnType extends keyof T, FnRunnerParams extends import("..").ServerlessRunnerParamsMapping<T>[FnType] = import("..").ServerlessRunnerParamsMapping<T>[FnType], FnResponseData extends import("..").ServerlessResponseDataMapping<T>[FnType] = import("..").ServerlessResponseDataMapping<T>[FnType]>(fnType: FnType, params?: Omit<FnRunnerParams, "name"> | undefined, options?: import("./useQuery").QueryOptions<FnResponseData>) => {
        data: FnResponseData | null;
        loading: boolean;
        error: string;
        isError: boolean;
        refetch: ({ parameters, propertiesToSend, }: Omit<FnRunnerParams, "name">) => Promise<FnResponseData | null>;
    };
    runServerlessFunction: import("@hubspot/ui-extensions").ServerlessFuncRunner;
    actions: import("@hubspot/ui-extensions").CrmHostActions & import("@hubspot/ui-extensions").UiePlatformActions;
    context: import("@hubspot/ui-extensions").CrmContext;
};
