import React from "react";
import {
  // Existing functionality
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  Save,
  XCircle,
  Upload,
  Download,
  Eye,
  EyeOff,
  
  // Navigation icons
  Home,
  Info,
  Dumbbell,
  Phone,
  Euro,
  HelpCircle,
  Book,
  Users,
  Camera,
  Star,
  Lock,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";

export const Icons = {
  // Existing
  close: X,
  menu: Menu,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  edit: Edit,
  delete: Trash2,
  add: Plus,
  save: Save,
  cancel: XCircle,
  upload: Upload,
  download: Download,
  eye: Eye,
  eyeOff: EyeOff,
  
  // Navigation
  home: Home,
  info: Info,
  fitness: Dumbbell,
  services: Dumbbell, // Alias
  contact: Phone,
  euro: Euro,
  question: HelpCircle,
  book: Book,
  users: Users,
  camera: Camera,
  star: Star,
  lock: Lock,
  document: FileText,
  settings: Settings,
  dashboard: BarChart3,
};

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className, ...props }) => {
  const IconComponent = Icons[name];
  return <IconComponent size={size} className={className} {...props} />;
};