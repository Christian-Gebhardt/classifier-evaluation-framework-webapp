import { Paper, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  aboutPaper: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "75%",
    margin: "20px",
    padding: "15px",
  },
}));

export default function AboutView() {
  const classes = useStyles();
  return (
    <Paper className={classes.aboutPaper}>
      <Typography style={{ textAlign: "center" }}>
        Dieses Projekt wurde 2021 im Rahmen der Bachelorarbeit "Enwicklung eines
        webbasierten Rahmenwerkes zur Evaluation von Klassifikatoren" von
        Christian Gebhardt (christian.gebhardt@uni-bayreuth.de) an der
        Universität Bayreuth entwickelt. Für mehr Informationen siehe folgende
        Github Repositories (insbesondere die Hilfsskripte zur Benutzung im
        Repository API){": "}
        <a href="https://github.com/Christian-Gebhardt/classifier-evaluation-framework-API">
          API
        </a>{" "}
        und{" "}
        <a href="https://github.com/Christian-Gebhardt/classifier-evaluation-framework-webapp">
          Webapp
        </a>
      </Typography>
    </Paper>
  );
}
