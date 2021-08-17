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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@material-ui/core";

import { CloudUpload, Send, Settings } from "@material-ui/icons";
import { getComparison } from "../../services/ApiService";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 4,
    padding: 10,
  },
  inputForm: {
    paddingTop: "20px",
  },
  formControlDialog: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
    marginTop: 10,
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: 5,
  },
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
  textFieldClassifierSettings: {
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

  const [openSettings, setOpenSettings] = useState(false);

  const [selectedClassifierSetting, setSelectedClassifierSetting] =
    useState("sgd");

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

  const initialSettings = {
    sgd: {
      loss: "hinge",
      alpha: "0.0001",
      max_iter: "1000",
    },
    gnb: {},
    dct: {
      criterion: "gini",
      min_samples_split: "2",
      max_features: "None",
    },
    rfo: {
      n_estimators: "100",
      criterion: "gini",
      min_samples_split: "2",
      max_features: "None",
    },
    nnm: {
      hidden_layer_sizes: "16,8",
      activation: "relu",
      solver: "adam",
      alpha: "0.0001",
      max_iter: "1000",
    },
  };

  const [classifierSettings, setClassifierSettings] = useState(initialSettings);

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

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleSelectedClassifierSettingsChange = (e) => {
    setSelectedClassifierSetting(e.target.value);
  };

  const handleClassifierSettingsChange = (clf, attr, value) => {
    setClassifierSettings((prevState) => ({
      ...prevState,
      [clf]: {
        ...prevState[clf],
        [attr]: value,
      },
    }));
  };

  const handleResetClassifierSettings = () => {
    setClassifierSettings(initialSettings);
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

    console.log(
      datasetFile,
      yPredFile,
      indicesFile,
      classifiers,
      metrics,
      classifierSettings
    );

    // API call
    const res = await getComparison(
      datasetFile,
      indicesFile,
      yPredFile,
      classifiers,
      metrics,
      classifierSettings
    );

    console.log(res);

    setComparisonResults(res.results);
    setComparisonDetailed(res.evaluation);

    if (yPred != null && indices != null) {
      setClassifiers([...classifiers, "own"]);
    } else {
      setClassifiers(classifiers);
    }

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
        <Box className={classes.inputForm}>
          <form id="comparison-input-form" onSubmit={(e) => handleSubmit(e)}>
            <div className={classes.root}>
              <label>Datensatz</label>
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
              <label>Ergebnisvektor (y_pred)</label>
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
                  <FormControlLabel
                    control={
                      <IconButton onClick={handleOpenSettings}>
                        <Settings />
                      </IconButton>
                    }
                    label="Parameter"
                  />
                </FormGroup>
                <Dialog onClose={handleCloseSettings} open={openSettings}>
                  <DialogTitle
                    id="classifier-settings-dialog-title"
                    onClose={handleCloseSettings}
                  >
                    Parameter der Klassifikatoren
                  </DialogTitle>
                  <DialogContent dividers>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="classifier-select-label">
                        Klassifikator
                      </InputLabel>
                      <Select
                        labelId="classifier-select-label"
                        id="classifier-select-label"
                        value={selectedClassifierSetting}
                        onChange={handleSelectedClassifierSettingsChange}
                      >
                        <MenuItem value={"sgd"}>
                          Standard Gradient Descent
                        </MenuItem>
                        <MenuItem value={"gnb"}>Gaussian Naive Bayes</MenuItem>
                        <MenuItem value={"dct"}>Decision Tree</MenuItem>
                        <MenuItem value={"rfo"}>Random Forest</MenuItem>
                        <MenuItem value={"nnm"}>Neural Net</MenuItem>
                      </Select>
                    </FormControl>
                    {selectedClassifierSetting === "sgd" && (
                      <FormGroup className={classes.formControlDialog}>
                        <FormControl>
                          <InputLabel id="sgd-loss-function-label">
                            Loss Function
                          </InputLabel>
                          <Select
                            labelId="sgd-loss-function-label"
                            id="sgd-loss-function"
                            value={classifierSettings.sgd.loss}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "sgd",
                                "loss",
                                e.target.value
                              )
                            }
                            label="loss function"
                          >
                            <MenuItem value={"hinge"}>hinge</MenuItem>
                            <MenuItem value={"log"}>log</MenuItem>
                            <MenuItem value={"modified_huber"}>
                              modified_huber
                            </MenuItem>
                            <MenuItem value={"squared_hinge"}>
                              squared_hinge
                            </MenuItem>
                            <MenuItem value={"perceptron"}>perceptron</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="alpha"
                            id="sgd-input-alpha"
                            variant="outlined"
                            value={classifierSettings.sgd.alpha}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "sgd",
                                "alpha",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="max iterations"
                            id="sgd-input-maxIter"
                            variant="outlined"
                            value={classifierSettings.sgd.max_iter}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "sgd",
                                "max_iter",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                      </FormGroup>
                    )}
                    {selectedClassifierSetting === "gnb" && (
                      <FormGroup
                        className={classes.formControlDialog}
                      ></FormGroup>
                    )}
                    {selectedClassifierSetting === "dct" && (
                      <FormGroup className={classes.formControlDialog}>
                        <FormControl>
                          <InputLabel id="dct-criterion-label">
                            criterion
                          </InputLabel>
                          <Select
                            labelId="dct-criterion-label"
                            id="dct-criterion"
                            value={classifierSettings.dct.criterion}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "dct",
                                "criterion",
                                e.target.value
                              )
                            }
                            label="criterion"
                          >
                            <MenuItem value={"gini"}>gini</MenuItem>
                            <MenuItem value={"entropy"}>entropy</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="minimum samples split"
                            id="dct-input-minSamplesSplit"
                            variant="outlined"
                            value={classifierSettings.dct.min_samples_split}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "dct",
                                "min_samples_split",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <InputLabel id="dct-maxFeatures-label">
                            maximum features
                          </InputLabel>
                          <Select
                            labelId="dct-maxFeatures-label"
                            id="dct-maxFeatures"
                            value={classifierSettings.dct.max_features}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "dct",
                                "max_features",
                                e.target.value
                              )
                            }
                            label="maximum features"
                          >
                            <MenuItem value={"None"}>None</MenuItem>
                            <MenuItem value={"auto"}>auto</MenuItem>
                            <MenuItem value={"sqrt"}>sqrt</MenuItem>
                            <MenuItem value={"log2"}>log2</MenuItem>
                          </Select>
                        </FormControl>
                      </FormGroup>
                    )}
                    {selectedClassifierSetting === "rfo" && (
                      <FormGroup className={classes.formControlDialog}>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="n_estimators"
                            id="rfo-input-nEstimators"
                            variant="outlined"
                            value={classifierSettings.rfo.n_estimators}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "rfo",
                                "n_estimators",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <InputLabel id="rfo-criterion-label">
                            criterion
                          </InputLabel>
                          <Select
                            labelId="rfo-criterion-label"
                            id="rfo-criterion"
                            value={classifierSettings.rfo.criterion}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "rfo",
                                "criterion",
                                e.target.value
                              )
                            }
                            label="criterion"
                          >
                            <MenuItem value={"gini"}>gini</MenuItem>
                            <MenuItem value={"entropy"}>entropy</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="minimum samples split"
                            id="rfo-input-minSamplesSplit"
                            variant="outlined"
                            value={classifierSettings.rfo.min_samples_split}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "rfo",
                                "min_samples_split",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <InputLabel id="rfo-maxFeatures-label">
                            maximum features
                          </InputLabel>
                          <Select
                            labelId="rfo-maxFeatures-label"
                            id="rfo-maxFeatures"
                            value={classifierSettings.dct.max_features}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "rfo",
                                "max_features",
                                e.target.value
                              )
                            }
                            label="maximum features"
                          >
                            <MenuItem value={"None"}>None</MenuItem>
                            <MenuItem value={"auto"}>auto</MenuItem>
                            <MenuItem value={"sqrt"}>sqrt</MenuItem>
                            <MenuItem value={"log2"}>log2</MenuItem>
                          </Select>
                        </FormControl>
                      </FormGroup>
                    )}
                    {selectedClassifierSetting === "nnm" && (
                      <FormGroup className={classes.formControlDialog}>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="hidden layer sizes"
                            id="nnm-input-hiddenLayersSizes"
                            variant="outlined"
                            value={classifierSettings.nnm.hidden_layer_sizes}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "nnm",
                                "hidden_layer_sizes",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <InputLabel id="nnm-activation-label">
                            activation
                          </InputLabel>
                          <Select
                            labelId="nnm-activation-label"
                            id="nnm-activation"
                            value={classifierSettings.nnm.activation}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "nnm",
                                "activation",
                                e.target.value
                              )
                            }
                            label="activation"
                          >
                            <MenuItem value={"relu"}>relu</MenuItem>
                            <MenuItem value={"logistic"}>logistic</MenuItem>
                            <MenuItem value={"tanh"}>tanh</MenuItem>
                            <MenuItem value={"identity"}>identity</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <InputLabel id="nnm-solver-label">
                            maximum features
                          </InputLabel>
                          <Select
                            labelId="nnm-solver-label"
                            id="nnm-solver"
                            value={classifierSettings.nnm.solver}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "nnm",
                                "solver",
                                e.target.value
                              )
                            }
                            label="solver"
                          >
                            <MenuItem value={"adam"}>adam</MenuItem>
                            <MenuItem value={"sgd"}>sgd</MenuItem>
                            <MenuItem value={"lbfgs"}>lbfgs</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="alpha"
                            id="nnm-input-alpha"
                            variant="outlined"
                            value={classifierSettings.nnm.alpha}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "nnm",
                                "alpha",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <TextField
                            className={classes.textFieldClassifierSettings}
                            label="max iterations"
                            id="nnm-input-maxIter"
                            variant="outlined"
                            value={classifierSettings.nnm.max_iter}
                            onChange={(e) =>
                              handleClassifierSettingsChange(
                                "nnm",
                                "max_iter",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                      </FormGroup>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      autoFocus
                      onClick={handleResetClassifierSettings}
                      color="primary"
                    >
                      Zurücksetzen
                    </Button>
                  </DialogActions>
                </Dialog>
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
