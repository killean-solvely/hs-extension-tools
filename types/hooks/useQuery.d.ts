import { ExtensionPointApi } from "@hubspot/ui-extensions";
import { ServerlessFunctionType, ServerlessResponseDataMapping, ServerlessRunnerParamsMapping } from "../types";
export interface QueryOptions<T> {
    runOnCreate?: boolean;
    onError?: (error: string) => void;
    onSuccess?: (response: T) => void;
}
export declare const useQuery: <T extends Record<string, any>>(context: ExtensionPointApi<"crm.preview"> | null) => <FnType extends ServerlessFunctionType<T>, FnRunnerParams extends ServerlessRunnerParamsMapping<T>[FnType] = ServerlessRunnerParamsMapping<T>[FnType], FnResponseData extends ServerlessResponseDataMapping<T>[FnType] = ServerlessResponseDataMapping<T>[FnType]>(fnType: FnType, params?: Omit<FnRunnerParams, "name">, options?: QueryOptions<FnResponseData>) => {
    data: FnResponseData | null;
    loading: boolean;
    error: string;
    isError: boolean;
    refetch: ({ parameters, propertiesToSend, }: Omit<FnRunnerParams, "name">) => Promise<FnResponseData | null>;
};
