import { ServerlessExecutionStatus } from "@hubspot/ui-extensions";

export interface ServerlessExecutionError {
  status: ServerlessExecutionStatus.Error;
  message: string;
}

export interface ServerlessExecutionSuccess<T> {
  status: ServerlessExecutionStatus.Success;
  response: {
    data: T;
    error?: string;
  };
}

export type ServerlessExecutionResult<T> =
  | ServerlessExecutionError
  | ServerlessExecutionSuccess<T>;

export type ServerlessFunctionType<T extends Record<string, any>> = keyof T;

export type ServerlessRunnerParamsMapping<T extends Record<string, any>> = {
  [key in ServerlessFunctionType<T>]: Parameters<T[key]>[0];
};

export type ServerlessResponseDataMapping<T extends Record<string, any>> = {
  [key in ServerlessFunctionType<T>]: Awaited<ReturnType<T[key]>>["data"];
};
