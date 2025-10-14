import React, { useState } from 'react';
import { Icon, Icons, IconName } from '@/components/ui/common/Icons';

interface IconSelectProps {
  value?: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
  className?: string;
}

export const IconSelect: React.FC<IconSelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Alle verfügbaren Icon-Namen aus der Icons-Komponente
  const availableIcons: IconName[] = Object.keys(Icons) as IconName[];

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 border rounded text-sm bg-white disabled:bg-gray-100 hover:bg-gray-50"
      >
        <div className="flex items-center">
          {value && (
            <>
              <Icon name={value as IconName} size={16} className="mr-2" />
              <span>{value}</span>
            </>
          )}
          {!value && <span className="text-gray-500">Icon auswählen</span>}
        </div>
        <Icon name="chevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {/* Keine Auswahl Option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center border-b text-sm"
            >
              <span className="text-gray-500">Kein Icon</span>
            </button>

            {/* Icon Grid */}
            <div className="p-2">
              <div className="grid grid-cols-4 gap-1">
                {availableIcons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleSelect(iconName)}
                    className={`p-2 rounded hover:bg-gray-100 flex flex-col items-center text-xs ${
                      value === iconName ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500' : ''
                    }`}
                    title={iconName}
                  >
                    <Icon name={iconName} size={20} className="mb-1" />
                    <span className="truncate w-full text-center">{iconName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};