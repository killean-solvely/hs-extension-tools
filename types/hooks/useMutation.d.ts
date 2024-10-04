import { ExtensionPointApi } from "@hubspot/ui-extensions";
import { ServerlessFunctionType, ServerlessResponseDataMapping, ServerlessRunnerParamsMapping } from "../types";
export interface MutationOptions<T> {
    onError?: (error: string) => void;
    onSuccess?: (response: T) => void;
}
export declare const useMutation: <T extends Record<string, any>>(context: ExtensionPointApi<"crm.preview"> | null) => <FnType extends ServerlessFunctionType<T>, FnRunnerParams extends ServerlessRunnerParamsMapping<T>[FnType] = ServerlessRunnerParamsMapping<T>[FnType], FnResponseData extends ServerlessResponseDataMapping<T>[FnType] = ServerlessResponseDataMapping<T>[FnType]>(fnType: FnType, options?: MutationOptions<FnResponseData>) => {
    mutate: ({ parameters, propertiesToSend, }: Omit<FnRunnerParams, "name">) => Promise<FnResponseData | null>;
    data: FnResponseData | null;
    loading: boolean;
    error: string;
    isError: boolean;
};
