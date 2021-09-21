import React from "react";
import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

const useStyles = makeStyles({
  paper: {
    minHeight: 600,
  },
  errorText: {
    paddingTop: "20px",
  },
  barChart: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "20px",
  },
  tableClfReport: {
    minWidth: 650,
  },
  tablePaper: {
    marginTop: "25px",
  },
  headerRow: {
    fontWeight: 575,
  },
});

export default function TabPanelComparison({
  comparisonResults,
  comparisonDetailed,
  classifiers,
}) {
  const classes = useStyles();

  const [classifierNames] = useState(classifiers);

  const [results] = useState(comparisonResults);
  const [detailedCV] = useState(comparisonDetailed);

  console.log(classifiers, results, detailedCV);

  const getFillColor = (name) => {
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
  };

  return (
    <Box m={2} ml={12} mr={12}>
      <Paper elevation={2} className={classes.paper}>
        {results ? (
          <Box>
            <Box className={classes.barChart}>
              <BarChart
                width={500}
                height={250}
                data={results}
                justifyContent="center"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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
            </Box>
            {detailedCV &&
              classifierNames.map((clf, i) => {
                return (
                  <TableContainer
                    key={i}
                    className={classes.tablePaper}
                    component={Paper}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.headerRow}
                          >{`Classifier: ${clf}`}</TableCell>
                          {Object.values(detailedCV[clf])[0].map((item, i) => (
                            <TableCell
                              className={classes.headerRow}
                              key={i}
                              align="right"
                            >
                              {`Set ${i + 1}`}
                            </TableCell>
                          ))}
                          <TableCell
                            className={classes.headerRow}
                            align="right"
                          >
                            {"Avg"}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(detailedCV[clf]).map((metric, i) => (
                          <TableRow key={i}>
                            <TableCell
                              className={classes.headerRow}
                              component="th"
                              scope="row"
                            >
                              {`${metric}`}
                            </TableCell>
                            {detailedCV[clf][metric].map((value, i) => (
                              <TableCell key={i} align="right">
                                {value.toFixed(2)}
                              </TableCell>
                            ))}
                            <TableCell key={1} align="right">
                              {(
                                detailedCV[clf][metric].reduce(
                                  (p, c) => p + c,
                                  0
                                ) / detailedCV[clf][metric].length
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              })}
          </Box>
        ) : (
          <Typography className={classes.errorText}>
            Bitte Eingabe ausfüllen.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
