import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Paper,
  Box,
  IconButton,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Button,
  Radio,
  RadioGroup,
} from "@material-ui/core";

import { CloudUpload, Send } from "@material-ui/icons";
import { getComparison } from "../../services/ApiService";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: "4px",
    },
  },
  input: {
    display: "none",
  },
  generateButton: {
    margin: "10px",
  },
  submitButton: {
    margin: "10px",
  },
  formControl: {
    margin: "15px",
  },
}));

export default function TabPanelInputComparison({
  setComparisonResults,
  setClassifiers,
  setComparisonDetailed,
  setView,
  setMetrics,
}) {
  const classes = useStyles();

  const [dataset, setDataset] = useState();
  const [indices, setIndices] = useState();
  const [yPred, setYPred] = useState();

  const [comapareWithClassifiers, setCompareWithClassifiers] = useState(false);

  const [targetType, setTargetType] = useState("binary");

  const [checkedComparisonClassifiers, setCheckedComparisonClassifiers] =
    useState({
      sgd: false,
      gnb: false,
      dct: false,
      rfo: false,
      nnm: false,
    });

  const { sgd, gnb, dct, rfo, nnm } = checkedComparisonClassifiers;

  const checkedComparisonClassifiersError =
    Object.values(checkedComparisonClassifiers).filter((v) => v).length < 1;

  const isDatasetSelectedError = !dataset ? true : false;

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

  const handleComparisonClassifiersCheckboxChange = (event) => {
    setCheckedComparisonClassifiers({
      ...checkedComparisonClassifiers,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTargetTypeRadioChange = (event) => {
    setTargetType(event.target.value);
  };

  const handleCompareWithClassifiersCheckboxChange = (event) => {
    setCompareWithClassifiers(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Setting parameters for API call
    const datasetFile = document.getElementById("icon-button-file-dataset")
      .files[0];
    const indicesFile = document.getElementById("icon-button-file-indices")
      .files[0];
    const yPredFile = document.getElementById("icon-button-file-yPred")
      .files[0];

    const metrics = [];
    if (targetType === "binary") {
      for (const [key, value] of Object.entries(checkedMetricsBinary)) {
        if (value) {
          metrics.push(key.toString());
        }
      }
    } else if (targetType === "multinomial") {
      for (const [key, value] of Object.entries(checkedMetricsMultinomial)) {
        if (value) {
          metrics.push(key.toString());
        }
      }
    }
    const classifiers = [];
    for (const [key, value] of Object.entries(checkedComparisonClassifiers)) {
      if (value) {
        classifiers.push(key.toString());
      }
    }

    console.log(datasetFile, yPredFile, indicesFile, classifiers, metrics);

    // API call
    const res = await getComparison(
      datasetFile,
      indicesFile,
      yPredFile,
      classifiers,
      metrics
    );

    console.log(res);

    setComparisonResults(res.results);
    setComparisonDetailed(res.evaluation);

    setClassifiers([...classifiers, "own"]);
    setMetrics(metrics);

    // Resetting forms and state values
    document.getElementById("comparison-input-form").reset();
    setDataset();
    setYPred();
    setIndices();
    Object.keys(checkedMetricsBinary).forEach((key) => {
      checkedMetricsBinary[key] = false;
    });
    Object.keys(checkedMetricsMultinomial).forEach((key) => {
      checkedMetricsMultinomial[key] = false;
    });
    Object.keys(checkedComparisonClassifiers).forEach((key) => {
      checkedComparisonClassifiers[key] = false;
    });

    setView(2);
  };

  return (
    <Box m={2} ml={12} mr={12}>
      <Paper elevation={2}>
        <Box>
          <form id="comparison-input-form" onSubmit={(e) => handleSubmit(e)}>
            <div className={classes.root}>
              <label>Datensatz:</label>
              <input
                className={classes.input}
                id="icon-button-file-dataset"
                type="file"
                onChange={(e) => setDataset(e.target.files[0])}
              />
              <label htmlFor="icon-button-file-dataset">
                <Box>
                  <Typography>
                    {dataset ? dataset.name : "Bitte auswählen"}
                  </Typography>
                  <IconButton
                    color="default"
                    aria-label="upload picture"
                    component="span"
                  >
                    <CloudUpload />
                  </IconButton>
                </Box>
              </label>
            </div>
            <div className={classes.root}>
              <label>Trainings-/Testindices</label>
              <input
                className={classes.input}
                id="icon-button-file-indices"
                type="file"
                onChange={(e) => setIndices(e.target.files[0])}
              />
              <label htmlFor="icon-button-file-indices">
                <Box>
                  <Typography>
                    {indices ? indices.name : "Bitte auswählen"}
                  </Typography>
                  <IconButton
                    color="default"
                    aria-label="upload picture"
                    component="span"
                  >
                    <CloudUpload />
                  </IconButton>
                </Box>
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
            {targetType === "binary" && (
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
            {targetType === "multinomial" && (
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
            <div className={classes.root}>
              <FormControl
                required
                error={isDatasetSelectedError}
                component="fieldset"
                className={classes.formControl}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleCompareWithClassifiersCheckboxChange}
                        color="primary"
                        checked={comapareWithClassifiers}
                        name="comparison"
                      />
                    }
                    label="Vergleich mit Klassifikatoren"
                  />
                </FormGroup>
                <FormHelperText>Datensatz muss ausgewählt sein.</FormHelperText>
              </FormControl>
            </div>
            <div className={classes.root}>
              <FormControl
                required
                error={checkedComparisonClassifiersError}
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">
                  Klassifikatoren auswählen
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleComparisonClassifiersCheckboxChange}
                        color="primary"
                        checked={sgd}
                        name="sgd"
                      />
                    }
                    label="Stochastic Gradient Descent"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleComparisonClassifiersCheckboxChange}
                        color="primary"
                        checked={gnb}
                        name="gnb"
                      />
                    }
                    label="Gaussian Naive Bayes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleComparisonClassifiersCheckboxChange}
                        color="primary"
                        checked={dct}
                        name="dct"
                      />
                    }
                    label="Decision Tree"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleComparisonClassifiersCheckboxChange}
                        color="primary"
                        checked={rfo}
                        name="rfo"
                      />
                    }
                    label="Random Forest"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleComparisonClassifiersCheckboxChange}
                        color="primary"
                        checked={nnm}
                        name="nnm"
                      />
                    }
                    label="Neural Net"
                  />
                </FormGroup>
                <FormHelperText>
                  Mindestens einen Klassifikator auswählen.
                </FormHelperText>
              </FormControl>
            </div>
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
