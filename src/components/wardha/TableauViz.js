import React, { useEffect } from 'react';

const TableauVizComponent = () => {
  const vizUrl = "https://public.tableau.com/views/SawangiSolarDashboard/SawangiFinalDashboard?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link";

  const loadTableauLibrary = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://public.tableau.com/javascripts/api/tableau-2.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  };

  const initializeViz = () => {
    const vizOptions = {
      hideTabs: true, // Optional: Hide Tableau tabs
      hideToolbar: true // Optional: Hide Tableau toolbar
    };
    const vizContainer = document.getElementById("tableauVizContainer");
    new window.tableau.Viz(vizContainer, vizUrl, vizOptions);
  };

  useEffect(() => {
    loadTableauLibrary()
      .then(() => initializeViz())
      .catch(error => console.error("Error loading Tableau library:", error));
  }, []);

  return <div id="tableauVizContainer" style={{ width: '800px', height: '600px' }} />;
};

export default TableauVizComponent;
