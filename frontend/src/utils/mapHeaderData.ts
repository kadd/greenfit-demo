import { HeaderData } from "@/types/header";
import { NavigationItem } from "@/types/navigation";

export function getEmptyHeaderData(): HeaderData {
  return {
    title: "",
    subtitle: "",
    cta: "",
    logoSrc: "",
    logoAlt: "",
    backgroundImage: "",
    backgroundAlt: "",
    navigation: [],
  };
}

export const mapHeaderData = (data: any): HeaderData => {
  return {
    title: data.title || "",
    subtitle: data.subtitle || "",
    cta: data.cta || "",
    logoSrc: data.logoSrc,
    logoAlt: data.logoAlt,
    backgroundImage: data.backgroundImage,
    backgroundAlt: data.backgroundAlt,
    navigation: convertNavigationToArray(data.navigation)
  };
};

const convertNavigationToArray = (nav: any): NavigationItem[] => {
  if (!nav) return [];
  if (Array.isArray(nav)) return nav;
  
  if (typeof nav === 'object') {
    return Object.entries(nav).map(([key, value]: [string, any]) => ({
      id: key,
      label: value.label || key,
      href: value.href || '#',
      isActive: value.isActive || false,
      ...value
    }));
  }
  
  return [];
};