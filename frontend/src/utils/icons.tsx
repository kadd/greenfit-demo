import React from "react";

export const iconMap = {
    home: "🏠",
    star: "⭐",
    group: "👥",
    user: "👤",
    image: "🖼️",
    team: "👥", 
    teams: "👥",
    gallery: "📸",
    blog: "📝",
    about: "ℹ️",
    contact: "📞",
    info: "ℹ️",
    faq: "❓",
    services: "🛠️",
    shield: "🛡️",
    lock: "🔒",
    unlock: "🔓",
    dashboard: "📊",
    admin: "🛠️",
    settings: "⚙️",
    help: "❓",
    support: "🆘",
    logout: "🚪",
    login: "🔑",
    register: "📝",
    blogpost: "📝",
    posts: "📝",
    envelope: "✉️",
    mail: "✉️",
    phone: "📞",
    location: "📍",
    map: "🗺️",
    document: "📄",
    documents: "📄",
    file: "📁",
    edit: "✏️",
    pencil: "✏️",
    plus: "➕",
    minus: "➖",
    add: "➕",
    remove: "➖",
    check: "✔️",
    cross: "❌",
    arrowup: "⬆️",
    arrowdown: "⬇️",
    arrowleft: "⬅️",
    arrowright: "➡️",
    arrows: "↔️",
    calendar: "📅",
    clock: "⏰",
    time: "⏰",
    starfilled: "⭐",
} as const;

export type IconName = keyof typeof iconMap;

export const renderIcon = (iconName?: string, className?: string) => {
  if (!iconName) return null;
  
  const icon = iconMap[iconName.toLowerCase() as IconName];
  if (!icon) return null;

  return <span className={className || "mr-2"}>{icon}</span>;
};