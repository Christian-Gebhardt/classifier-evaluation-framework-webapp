import React from "react";
import { useState } from "react";
import {
  Paper,
  Box,
  Button,
  IconButton,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { CloudUpload, Send } from "@material-ui/icons";
import { getEvaluationForInput } from "../../services/ApiService";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: "4px",
    },
  },
  input: {
    display: "none",
  },
  submitButton: {
    margin: "10px",
  },
  formControl: {
    margin: "15px",
  },
}));

export default function TabPanelInputViewOwn({
  setEvaluationResults,
  setEvaluationConfusionMatrices,
  setEvaluationClassificationReports,
  setRocAnalysisRes,
  setClassifiers,
  setView,
}) {
  const classes = useStyles();

  const [yTrue, setYTrue] = useState();
  const [yPred, setYPred] = useState();

  const [rocAnalysis, setRocAnalysis] = useState(false);

  const [checkedMetricsBinary, setCheckedMetricsBinary] = useState({
    acc: false,
    fme: false,
    prc: false,
    rcl: false,
    auc: false,
  });

  const { acc, fme, prc, rcl, auc } = checkedMetricsBinary;

  const checkedMetricsErrorBinary =
    Object.values(checkedMetricsBinary).filter((v) => v).length < 1;

  const [checkedMetricsMultinomial, setCheckedMetricsMultinomial] = useState({
    acc_m: false,
    fme_ma: false,
    prc_ma: false,
    rcl_ma: false,
    fme_mi: false,
    prc_mi: false,
    rcl_mi: false,
  });

  const { acc_m, fme_ma, prc_ma, rcl_ma, fme_mi, prc_mi, rcl_mi } =
    checkedMetricsMultinomial;

  const checkedMetricsErrorMultinomial =
    Object.values(checkedMetricsMultinomial).filter((v) => v).length < 1;

  const [checkedMetricsProbabilistic, setCheckedMetricsProbabilistic] =
    useState({
      lgl: false,
    });

  const { lgl } = checkedMetricsProbabilistic;

  const checkedMetricsErrorProbabilistic =
    Object.values(checkedMetricsProbabilistic).filter((v) => v).length < 1;

  const [targetType, setTargetType] = useState("binary");

  const [metricType, setMetricType] = useState("qualitative");

  const handleBinaryMetricsCheckboxChange = (event) => {
    setCheckedMetricsBinary({
      ...checkedMetricsBinary,
      [event.target.name]: event.target.checked,
    });
  };

  const handleMultinomialMetricsCheckboxChange = (event) => {
    setCheckedMetricsMultinomial({
      ...checkedMetricsMultinomial,
      [event.target.name]: event.target.checked,
    });
  };

  const handleProbabilisticMetricsCheckboxChange = (event) => {
    setCheckedMetricsProbabilistic({
      ...checkedMetricsProbabilistic,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTargetTypeRadioChange = (event) => {
    setTargetType(event.target.value);
  };

  const handleMetricTypeRadioChange = (event) => {
    setMetricType(event.target.value);
  };

  const handleRocAnalysisCheckboxChange = (event) => {
    setRocAnalysis(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Setting parameters for API call
    const yTrueFile = document.getElementById("icon-button-file-yTrue")
      .files[0];
    const yPredFile = document.getElementById("icon-button-file-yPred")
      .files[0];

    const metrics = [];
    if (targetType === "binary" && metricType === "qualitative") {
      for (const [key, value] of Object.entries(checkedMetricsBinary)) {
        if (value) {
          metrics.push(key.toString());
        }
      }
    } else if (targetType === "multinomial" && metricType === "qualitative") {
      for (const [key, value] of Object.entries(checkedMetricsMultinomial)) {
        if (value) {
          metrics.push(key.toString());
        }
      }
    } else if (metricType === "probabilistic") {
      for (const [key, value] of Object.entries(checkedMetricsProbabilistic)) {
        if (value) {
          metrics.push(key.toString());
        }
      }
    }

    setClassifiers(["own"]);

    console.log(yTrueFile, yPredFile, metrics);

    // API call
    const resInput = await getEvaluationForInput(
      yTrueFile,
      yPredFile,
      metrics,
      metricType,
      rocAnalysis
    );

    console.log(resInput);

    setEvaluationResults(resInput.results);
    setEvaluationConfusionMatrices(resInput.cnf_matrices);
    setEvaluationClassificationReports(resInput.clf_reports);
    setRocAnalysisRes(resInput.roc_analysis);

    // Resetting forms and state values
    document.getElementById("evaluation-input-form").reset();
    setYTrue();
    setYPred();
    Object.keys(checkedMetricsBinary).forEach((key) => {
      checkedMetricsBinary[key] = false;
    });
    Object.keys(checkedMetricsMultinomial).forEach((key) => {
      checkedMetricsMultinomial[key] = false;
    });
    setView(1);
  };

  return (
    <Box m={2} ml={12} mr={12}>
      <Paper elevation={2}>
        <Box>
          <form id="evaluation-input-form" onSubmit={(e) => handleSubmit(e)}>
            <div className={classes.root}>
              <label>Ergebnisvektor (y_true)</label>
              <input
                className={classes.input}
                id="icon-button-file-yTrue"
                type="file"
                onChange={(e) => setYTrue(e.target.files[0])}
              />
              <label htmlFor="icon-button-file-yTrue">
                <Typography>
                  {yTrue ? yTrue.name : "Bitte auswählen"}
                </Typography>
                <IconButton
                  color="default"
                  aria-label="upload picture"
                  component="span"
                >
                  <CloudUpload />
                </IconButton>
              </label>
            </div>
            <div className={classes.root}>
              <label>Ergebnisvektor (y_pred):</label>
              <input
                className={classes.input}
                id="icon-button-file-yPred"
                type="file"
                onChange={(e) => setYPred(e.target.files[0])}
              />
              <label htmlFor="icon-button-file-yPred">
                <Typography>
                  {yPred ? yPred.name : "Bitte auswählen"}
                </Typography>
                <IconButton
                  color="default"
                  aria-label="upload picture"
                  component="span"
                >
                  <CloudUpload />
                </IconButton>
              </label>
            </div>
            <div className={classes.root}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">
                  Ausprägung des Zielattributes
                </FormLabel>
                <RadioGroup
                  name="targetType"
                  value={targetType}
                  onChange={handleTargetTypeRadioChange}
                >
                  <FormControlLabel
                    value="binary"
                    control={<Radio />}
                    label="binär"
                  />
                  <FormControlLabel
                    value="multinomial"
                    control={<Radio />}
                    label="multinomial"
                  />
                </RadioGroup>
                <FormHelperText>
                  Wird benötigt um geeignete Metriken zu wählen
                </FormHelperText>
              </FormControl>
            </div>
            <div className={classes.root}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Art der Metriken</FormLabel>
                <RadioGroup
                  name="metricType"
                  value={metricType}
                  onChange={handleMetricTypeRadioChange}
                >
                  <FormControlLabel
                    value="qualitative"
                    control={<Radio />}
                    label="qualitativ"
                  />
                  <FormControlLabel
                    value="probabilistic"
                    control={<Radio />}
                    label="probabilistisch"
                  />
                </RadioGroup>
                <FormHelperText>
                  Wird benötigt um geeignete Metriken zu wählen
                </FormHelperText>
              </FormControl>
            </div>
            {targetType === "binary" && metricType === "qualitative" && (
              <div className={classes.root}>
                <FormControl
                  required
                  error={checkedMetricsErrorBinary}
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Metriken auswählen</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleBinaryMetricsCheckboxChange}
                          color="primary"
                          checked={acc}
                          name="acc"
                        />
                      }
                      label="Accuracy (acc)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleBinaryMetricsCheckboxChange}
                          color="primary"
                          checked={fme}
                          name="fme"
                        />
                      }
                      label="F-Measure (fme)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleBinaryMetricsCheckboxChange}
                          color="primary"
                          checked={prc}
                          name="prc"
                        />
                      }
                      label="Precision (prc)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleBinaryMetricsCheckboxChange}
                          color="primary"
                          checked={rcl}
                          name="rcl"
                        />
                      }
                      label="Recall (rcl)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleBinaryMetricsCheckboxChange}
                          color="primary"
                          checked={auc}
                          name="auc"
                        />
                      }
                      label="Area Under Curve (auc)"
                    />
                  </FormGroup>
                  <FormHelperText>
                    Mindestens eine Metrik auswählen.
                  </FormHelperText>
                </FormControl>
              </div>
            )}
            {targetType === "multinomial" && metricType === "qualitative" && (
              <div className={classes.root}>
                <FormControl
                  required
                  error={checkedMetricsErrorMultinomial}
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Metriken auswählen</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={acc_m}
                          name="acc_m"
                        />
                      }
                      label="Accuracy (acc_m)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={fme_ma}
                          name="fme_ma"
                        />
                      }
                      label="F-Measure Makro (fme_ma)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={prc_ma}
                          name="prc_ma"
                        />
                      }
                      label="Precision Makro (prc_ma)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={rcl_ma}
                          name="rcl_ma"
                        />
                      }
                      label="Recall Makro (rcl_ma)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={fme_mi}
                          name="fme_mi"
                        />
                      }
                      label="F-Measure Mikro (fme_mi)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={prc_mi}
                          name="prc_mi"
                        />
                      }
                      label="Precision Mikro (prc_mi)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleMultinomialMetricsCheckboxChange}
                          color="primary"
                          checked={rcl_mi}
                          name="rcl_mi"
                        />
                      }
                      label="Recall Mikro (rcl_mi)"
                    />
                  </FormGroup>
                  <FormHelperText>
                    Mindestens eine Metrik auswählen.
                  </FormHelperText>
                </FormControl>
              </div>
            )}
            {metricType === "probabilistic" && (
              <div>
                <div className={classes.root}>
                  <FormControl
                    required
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={handleRocAnalysisCheckboxChange}
                            color="primary"
                            checked={rocAnalysis}
                            name="rocAnalysis"
                          />
                        }
                        label="ROC Analyse"
                      />
                    </FormGroup>
                    <FormHelperText>
                      y_pred muss probabilistische Werte enthalten.
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className={classes.root}>
                  <FormControl
                    required
                    error={checkedMetricsErrorProbabilistic}
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">Metriken auswählen</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={handleProbabilisticMetricsCheckboxChange}
                            color="primary"
                            checked={lgl}
                            name="lgl"
                          />
                        }
                        label="Log Loss (lgl)"
                      />
                    </FormGroup>
                    <FormHelperText>
                      Mindestens eine Metrik auswählen.
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className={classes.submitButton}
              variant="contained"
              color="primary"
              endIcon={<Send />}
            >
              Auswerten
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
