import { useCallback, useEffect } from "react";
import { ZodType } from "zod";

export function useRetrieveFormValues<T>(
  localStorageKey: string,
  defaultValues: T,
  schema?: ZodType<T>
) {
  const getSavedData: () => T | undefined = useCallback(() => {
    const localStorage =
      typeof window !== "undefined" ? window.localStorage : undefined;
    if (!localStorage) {
      return undefined;
    }
    const data = localStorage?.getItem(localStorageKey);
    if (data) {
      // Parse it to a javaScript object
      try {
        const parsedData = JSON.parse(data) as T;
        if (!schema) {
          return parsedData;
        }
        const safeParseResult = schema.safeParse(parsedData);
        if (safeParseResult.success) {
          return safeParseResult.data as T;
        } else {
          console.error(safeParseResult.error);
          localStorage.clear();
          return defaultValues;
        }
      } catch (err) {
        console.log(err);
      }
    }
    return defaultValues;
  }, [defaultValues, localStorageKey, schema]);

  return { getSavedData };
}

export const usePersistFormValues = ({
  localStorageKey,
  values,
}: {
  localStorageKey: string;
  values: unknown;
}) => {
  useEffect(() => {
    const localStorage =
      typeof window !== "undefined" ? window.localStorage : undefined;
    localStorage?.setItem(localStorageKey, JSON.stringify(values));
  }, [values, localStorageKey]);

  return;
};
