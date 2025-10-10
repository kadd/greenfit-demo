import React, { use, useEffect } from "react";

import { HeaderData } from "../types/header";
import { NavigationItem } from "../types/navigation";

import { fetchHeaderData, updateHeaderData } from "../services/header";


// Custom hook to manage header state
export function useHeader(initialHeader: HeaderData) {
  const [header, setHeader] = React.useState<HeaderData>(initialHeader);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const data = await fetchHeaderData();
        setHeader(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHeader();
  }, []);

  const fetchHeader = async () => {
    try {
      const data = await fetchHeaderData();
      setHeader(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateHeader = async (newHeader: HeaderData) => {
    try {
      const updatedHeader = await updateHeaderData(newHeader);
      setHeader(updatedHeader);
    } catch (error) {
      console.error(error);
    }
  };

  const resetHeader = () => {
    setHeader(initialHeader);
  };

  return { header, updateHeader, resetHeader };
}

// Helper function to find a navigation item by its ID
export function findNavigationItemById(navigation: NavigationItem[], id: string): NavigationItem | undefined {
  for (const item of navigation) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findNavigationItemById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

// Helper function to update a navigation item by its ID
export function updateNavigationItemById(navigation: NavigationItem[], id: string, updatedItem: Partial<NavigationItem>): NavigationItem[] {
  return navigation.map(item => {
    if (item.id === id) {
      return { ...item, ...updatedItem };
    }
    if (item.children) {
      return { ...item, children: updateNavigationItemById(item.children, id, updatedItem) };
    }
    return item;
  });
}

// Helper function to add a new navigation item
export function addNavigationItem(navigation: NavigationItem[], newItem: NavigationItem, parentId?: string): NavigationItem[] {
  if (!parentId) {
    return [...navigation, newItem];
  }
  return navigation.map(item => {
    if (item.id === parentId) {
      const children = item.children ? [...item.children, newItem] : [newItem];
      return { ...item, children };
    }
    if (item.children) {
      return { ...item, children: addNavigationItem(item.children, newItem, parentId) };
    }
    return item;
  });
}

// Helper function to remove a navigation item by its ID
export function removeNavigationItemById(navigation: NavigationItem[], id: string): NavigationItem[] {
  return navigation
    .filter(item => item.id !== id)
    .map(item => {
      if (item.children) {
        return { ...item, children: removeNavigationItemById(item.children, id) };
      }
      return item;
    });
}