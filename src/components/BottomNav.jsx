import React from 'react';
import { Building, Layers, Sparkles, FolderArchive } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'catalog', label: 'Imóveis', icon: Building },
    { id: 'floorplans', label: 'Plantas', icon: Layers },
    { id: 'assistant', label: 'Assistente IA', icon: Sparkles },
    { id: 'drive', label: 'Drive Hub', icon: FolderArchive },
  ];

  return (
    <nav className="bottom-nav-bar glass-panel">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item-btn ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            {isActive && <div className="nav-active-indicator" />}
            <div className="nav-icon-wrap">
              <IconComponent size={20} strokeWidth={isActive ? 2.4 : 1.8} />
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
