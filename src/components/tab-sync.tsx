import { useEffect } from "react";
import { useIsiStore } from "../store/useIsiStore";

export const TabSync = () => {
  const activeTab = useIsiStore((state) => state.activeTab);
  const setActiveTab = useIsiStore((state) => state.setActiveTab);

  // Effect 1: Sync store with URL on mount and popstate
  useEffect(() => {
    const getTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      return tab === "email" || tab === "banner" ? tab : null;
    };

    const syncStoreWithUrl = () => {
      const urlTab = getTabFromUrl();
      if (urlTab && urlTab !== activeTab) {
        setActiveTab(urlTab);
      } else if (!urlTab) {
        const params = new URLSearchParams(window.location.search);
        params.set("tab", activeTab);
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${params}`,
        );
      }
    };

    syncStoreWithUrl();

    window.addEventListener("popstate", syncStoreWithUrl);

    return () => {
      window.removeEventListener("popstate", syncStoreWithUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect 2: Sync URL with store when activeTab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab);
      window.history.pushState({}, "", `${window.location.pathname}?${params}`);
    }
  }, [activeTab]);

  return null;
};
