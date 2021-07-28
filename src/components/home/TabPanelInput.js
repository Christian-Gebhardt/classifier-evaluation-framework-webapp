import React from "react";
import { useState } from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";
import TabPanelInputOwn from "./TabPanelInputOwn";
import TabPanelInputComparison from "./TabPanelInputComparison";

export default function TabPanelInput(props) {
  const [view, setView] = useState(0);

  const handleViewChange = (e, newValue) => {
    e.preventDefault();
    setView(newValue);
  };
  return (
    <div>
      <Paper>
        <Tabs
          indicatorColor="secondary"
          textColor="secondary"
          centered
          value={view}
          onChange={handleViewChange}
        >
          <Tab label="Eigener" />
          <Tab label="Vergleich" />
        </Tabs>
      </Paper>
      {view === 0 && (
        <TabPanelInputOwn
          setEvaluationResults={props.setEvaluationResults}
          setEvaluationConfusionMatrices={props.setEvaluationConfusionMatrices}
          setEvaluationClassificationReports={
            props.setEvaluationClassificationReports
          }
          setRocAnalysisRes={props.setRocAnalysis}
          setClassifiers={props.setClassifiers}
          setView={props.setView}
        />
      )}
      {view === 1 && (
        <TabPanelInputComparison
          setComparisonResults={props.setComparisonResults}
          setComparisonDetailed={props.setComparisonDetailed}
          setClassifiers={props.setClassifiers}
          setMetrics={props.setMetrics}
          setView={props.setView}
        />
      )}
    </div>
  );
}
