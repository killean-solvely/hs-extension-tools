import {
  ExtensionPointApi,
  ServerlessExecutionStatus,
} from "@hubspot/ui-extensions";
import { useState } from "react";
import {
  ServerlessExecutionResult,
  ServerlessFunctionType,
  ServerlessResponseDataMapping,
  ServerlessRunnerParamsMapping,
} from "../types";

export interface MutationOptions<T> {
  onError?: (error: string) => void;
  onSuccess?: (response: T) => void;
}

export const useMutation =
  <T extends Record<string, any>>(
    context: ExtensionPointApi<"crm.preview"> | null,
  ) =>
    <
      FnType extends ServerlessFunctionType<T>,
      FnRunnerParams extends
      ServerlessRunnerParamsMapping<T>[FnType] = ServerlessRunnerParamsMapping<T>[FnType],
      FnResponseData extends
      ServerlessResponseDataMapping<T>[FnType] = ServerlessResponseDataMapping<T>[FnType],
    >(
      fnType: FnType,
      options: MutationOptions<FnResponseData> = {},
    ) => {
      const [data, setData] = useState<FnResponseData | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const [isError, setIsError] = useState(false);

      async function mutate({
        // @ts-ignore
        parameters,
        // @ts-ignore
        propertiesToSend,
      }: Omit<FnRunnerParams, "name">) {
        if (!context) {
          throw new Error("No context provided");
        }

        setLoading(true);

        try {
          const result = (await context.runServerlessFunction({
            name: fnType as string,
            parameters,
            propertiesToSend,
          })) as ServerlessExecutionResult<FnResponseData>;

          switch (result.status) {
            case ServerlessExecutionStatus.Error:
              setError(result.message);
              setIsError(true);

              options.onError?.(result.message);

              return null;
            case ServerlessExecutionStatus.Success: {
              setData(result.response.data);

              options.onSuccess?.(result.response.data);

              return result.response.data;
            }
          }
        } catch (error: any) {
          setError(error);
          setIsError(true);

          options.onError?.(error);

          return null;
        } finally {
          setLoading(false);
        }
      }

      return { mutate, data, loading, error, isError };
    };
