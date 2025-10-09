

import React, { useState, useEffect } from "react";
import { JuniorResultTemplate, StudentData } from "../junior-result-template";
interface SavedJuniorTemplateConfig {
  data: StudentData;
  visibleSections?: Record<string, boolean>;
}

export function JuniorTemplateDisplay() {
  const [loadedData, setLoadedData] = useState<StudentData | null>(null);
  const [loadedVisibility, setLoadedVisibility] = useState<Record<string, boolean> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedConfigString = localStorage.getItem('savedJuniorTemplateConfig');
      if (savedConfigString) {
        const config = JSON.parse(savedConfigString) as SavedJuniorTemplateConfig;
        setLoadedData(config.data);
        setLoadedVisibility(config.visibleSections);
      }
    } catch (e) {
      console.error("Could not load template from local storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="p-8 text-lg text-blue-600 font-medium">Loading saved template...</div>;
  }

  if (!loadedData) {
    return (
      <div className="p-8 text-lg text-red-600">
        No saved template found. Please return to the editor and save your design.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <JuniorResultTemplate
          data={loadedData}
          initialVisibility={loadedVisibility}
        />   
      </div>
    </div>
  );
}
