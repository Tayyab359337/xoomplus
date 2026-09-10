import { useSyncExternalStore } from "react";

/** True only after hydration on the client. */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}
