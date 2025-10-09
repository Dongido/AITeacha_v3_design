import React, { useState, useEffect } from "react";
import { SecondaryResultData, SeniorResultTemplate, VisibilityState } from "../senior-result-template";


interface SavedTemplateConfig {
  data: SecondaryResultData;
   visibility: VisibilityState;
  columnVisibility: Record<string, boolean>;
}

export function SeniorTemplateDisplay() {
  const [loadedConfig, setLoadedConfig] = useState<SavedTemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedConfigString = localStorage.getItem('savedTemplateConfig');
      if (savedConfigString) {
        const config = JSON.parse(savedConfigString) as SavedTemplateConfig;
        setLoadedConfig(config);
      }
    } catch (e) {
      console.error("Could not load template from local storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  if (isLoading) {
    return <div className="p-4">Loading template...</div>;
  }

  if (!loadedConfig) {
    return <div className="p-4">No saved template found. Please go back and save one.</div>;
  }

 
  return (
    <div className="p-4">  
      <SeniorResultTemplate 
        data={loadedConfig.data} 
        initialVisibility={loadedConfig.visibility} 
        initialColumnVisibility={loadedConfig.columnVisibility} 
      />  
    </div>
  );
}