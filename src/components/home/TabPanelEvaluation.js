import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@material-ui/core";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  LineChart,
} from "recharts";

const useStyles = makeStyles({
  tableClfReport: {
    minWidth: 650,
  },
  tablePaper: {
    marginTop: "25px",
  },

  tableCnfMatrix: {
    width: "50%",
  },
});

function createDataClfReport(name, f1_score, precision, recall, support) {
  return { name, f1_score, precision, recall, support };
}

function makeRowsClfReport(clf_reports) {
  if (clf_reports !== undefined && "clf_report_own" in clf_reports) {
    let clf_report = clf_reports["clf_report_own"];
    let rows = [
      createDataClfReport(`accuracy = ${clf_report["accuracy"].toFixed(2)}`),
    ];
    Object.entries(clf_report).forEach(([key, value]) => {
      rows.push(
        createDataClfReport(
          key,
          value["f1-score"],
          value["precision"],
          value["recall"],
          value["support"]
        )
      );
    });
    rows = rows.filter((item) => item.name !== "accuracy");
    return rows;
  }
}

function makeHeadersClfReport(clf_reports) {
  if (clf_reports !== undefined && "clf_report_own" in clf_reports) {
    return Object.keys(clf_reports["clf_report_own"]["macro avg"]);
  }
}

function getFillColor(name) {
  switch (name) {
    case "own":
      return "#4266f5";
    case "sgd":
      return "#f59e42";
    case "gnb":
      return "#42f5b3";
    case "dct":
      return "#f5424e";
    case "rfo":
      return "#fcba03";
    case "nnm":
      return "#8c03fc";
    default:
      return "#666057";
  }
}

function getLineColor(i) {
  const n = i % 5;
  switch (n) {
    case 0:
      return "#1b4ac2";
    case 1:
      return "#de7812";
    case 2:
      return "#08a630";
    case 3:
      return "#f5424e";
    case 4:
      return "#fcba03";
    case 5:
      return "#8c03fc";
    default:
      return "#666057";
  }
}

export default function TabPanelEvaluation({
  evaluationResults,
  evaluationConfusionMatrices,
  evaluationClassificationReports,
  classifiers,
  rocAnalysis,
}) {
  const classes = useStyles();

  const [data] = useState(evaluationResults);
  const [cnfMatrices] = useState(evaluationConfusionMatrices);
  const [classificationReports] = useState(evaluationClassificationReports);
  const [classifierNames] = useState(classifiers);
  const [roc] = useState(rocAnalysis);

  console.log(rocAnalysis);

  const headersClfReport = makeHeadersClfReport(
    evaluationClassificationReports
  );

  const rowsClfReport = makeRowsClfReport(evaluationClassificationReports);

  return (
    <Box m={2} ml={12} mr={12}>
      <Paper elevation={2}>
        {data ? (
          <Box justifyContent="center">
            <BarChart
              width={500}
              height={400}
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis type="number" domain={[0, 1]} />
              <Tooltip />
              <Legend />
              {classifierNames.map((name, index) => {
                return (
                  <Bar
                    key={index}
                    dataKey={`score_clf_${name}`}
                    maxBarSize={100}
                    fill={getFillColor(name)}
                  />
                );
              })}
            </BarChart>
            {roc && (
              <LineChart
                width={500}
                height={400}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="fpr"
                  label={{
                    value: "FPR",
                    position: "bottom",
                    offset: 20,
                  }}
                  type="number"
                  domain={[0, 1]}
                />
                <YAxis
                  type="number"
                  label={{ value: "TPR", angle: -90, position: "left" }}
                  domain={[0, 1]}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                  data={[
                    { fpr: 0, tpr: 0 },
                    { fpr: 1, tpr: 1 },
                  ]}
                  name="--"
                  legendType="none"
                  dataKey="tpr"
                  type="monotone"
                  stroke="#8884d8"
                  strokeDasharray="3 3"
                />
                {roc.roc.map((item, i) => (
                  <Line
                    data={item}
                    key={i}
                    name={`class_${i}`}
                    type="step"
                    dataKey="tpr"
                    strokeWidth={3}
                    stroke={getLineColor(i)}
                  />
                ))}
              </LineChart>
            )}
            {"clf_report_own" in classificationReports && (
              <TableContainer className={classes.tablePaper} component={Paper}>
                <Table className={classes.tableClfReport}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Classification Report (own)</TableCell>
                      {headersClfReport.map((header) => (
                        <TableCell key={header} align="right">
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowsClfReport.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">
                          {row.f1_score !== undefined
                            ? row.f1_score.toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell align="right">
                          {row.precision !== undefined
                            ? row.precision.toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell align="right">
                          {row.recall !== undefined
                            ? row.recall.toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell align="right">
                          {row.support !== undefined ? row.support : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {"cnf_matrix_own" in cnfMatrices && (
              <TableContainer className={classes.tablePaper} component={Paper}>
                <Table className={classes.tableCnfMatrix}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Confusion Matrix (own)</TableCell>
                      {cnfMatrices["cnf_matrix_own"].map((item, i) => (
                        <TableCell key={i} align="right">
                          {`class ${i}`}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cnfMatrices["cnf_matrix_own"].map((row, i) => (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          {`class ${i}`}
                        </TableCell>
                        {row.map((value, i) => (
                          <TableCell key={i} align="right">
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ) : (
          <Typography>Bitte Eingabe ausfüllen.</Typography>
        )}
      </Paper>
    </Box>
  );
}
