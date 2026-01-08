import { useState } from "react";

export function useKeys() {
  const [apiKey, setApiKey] = useState<string>("");

  return {
    apiKey,
    setApiKey,
  };
}
