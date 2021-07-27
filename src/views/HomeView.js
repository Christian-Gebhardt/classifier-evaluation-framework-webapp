import React from "react";
import { useState } from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";
import TabPanelInput from "../components/home/TabPanelInput";
import TabPanelEvaluation from "../components/home/TabPanelEvaluation";
import TabPanelComparison from "../components/home/TabPanelComparison";

export default function HomeView() {
  const [view, setView] = useState(0);

  const [evaluationResults, setEvaluationResults] = useState();
  const [evaluationConfusionMatrices, setEvaluationConfusionMatrices] =
    useState();
  const [evaluationClassificationReports, setEvaluationClassificationReports] =
    useState();
  const [classifiers, setClassifiers] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const [comparisonResults, setComparisonResults] = useState();
  const [comparisonDetailed, setComparisonDetailed] = useState();

  const handleViewChange = (e, newValue) => {
    e.preventDefault();
    setView(newValue);
  };

  return (
    <div>
      <Paper>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          centered
          value={view}
          onChange={handleViewChange}
        >
          <Tab label="Eingabe" />
          <Tab label="Evaluation" />
          <Tab label="Vergleich" />
        </Tabs>
      </Paper>
      {view === 0 && (
        <TabPanelInput
          setEvaluationResults={setEvaluationResults}
          setEvaluationConfusionMatrices={setEvaluationConfusionMatrices}
          setEvaluationClassificationReports={
            setEvaluationClassificationReports
          }
          setClassifiers={setClassifiers}
          setMetrics={setMetrics}
          setComparisonResults={setComparisonResults}
          setComparisonDetailed={setComparisonDetailed}
          setView={setView}
        />
      )}
      {view === 1 && (
        <TabPanelEvaluation
          evaluationResults={evaluationResults}
          evaluationConfusionMatrices={evaluationConfusionMatrices}
          evaluationClassificationReports={evaluationClassificationReports}
          classifiers={classifiers}
        />
      )}
      {view === 2 && (
        <TabPanelComparison
          comparisonResults={comparisonResults}
          comparisonDetailed={comparisonDetailed}
          metrics={metrics}
          classifiers={classifiers}
        />
      )}
    </div>
  );
}
