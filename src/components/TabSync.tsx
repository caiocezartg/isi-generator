import { useEffect } from 'react';
import qs from 'qs';
import { useIsiStore } from '../store/useIsiStore';

export const TabSync = () => {
  const activeTab = useIsiStore((state) => state.activeTab);
  const setActiveTab = useIsiStore((state) => state.setActiveTab);

  useEffect(() => {
    const queryString = window.location.search.substring(1);
    const parsedParams = qs.parse(queryString);
    const tabFromUrl = parsedParams.tab;

    if (typeof tabFromUrl === 'string' && (tabFromUrl === 'email' || tabFromUrl === 'banner')) {
      if (tabFromUrl !== activeTab) {
        setActiveTab(tabFromUrl);
      }
    }
  }, []); 

  useEffect(() => {
    const queryString = window.location.search.substring(1);
    const parsedParams = qs.parse(queryString);

    if (activeTab !== parsedParams.tab) {
      const newParams = { ...parsedParams, tab: activeTab };
      const newQueryString = qs.stringify(newParams);

      const newUrl = `${window.location.pathname}?${newQueryString}`;

      window.history.pushState({}, '', newUrl);
    }
  }, [activeTab]);

  return null;
};