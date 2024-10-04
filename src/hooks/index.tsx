import React, { createContext, useContext } from "react";
import { ExtensionPointApi, hubspot } from "@hubspot/ui-extensions";
import { useMutation } from "./useMutation";
import { useQuery } from "./useQuery";

export default function buildExtension<T extends Record<string, any>>(
  Extension: React.FC<{ context: ExtensionPointApi<"crm.preview"> }>,
) {
  const ExtensionContext =
    createContext<ExtensionPointApi<"crm.preview"> | null>(null);

  // Define a functional component that will consume the context
  const ExtensionProvider: React.FC<{
    api: ExtensionPointApi<"crm.preview">;
  }> = ({ api }) => {
    return (
      <ExtensionContext.Provider value={api}>
        <Extension context={api} />
      </ExtensionContext.Provider>
    );
  };

  // Register the extension with Hubspot and return the wrapped component
  hubspot.extend<"crm.preview">((api) => {
    return <ExtensionProvider api={api} />;
  });

  // Return a hook to use within the component
  return function useExtension() {
    const context = useContext(ExtensionContext);

    if (!context) {
      throw new Error(
        "useExtension must be used within ExtensionContext.Provider",
      );
    }

    return {
      ...context,
      useMutation: useMutation<T>(context),
      useQuery: useQuery<T>(context),
    };
  };
}
