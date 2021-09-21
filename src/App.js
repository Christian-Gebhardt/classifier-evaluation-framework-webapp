import "./App.css";
import React from "react";
import { AppBar, Toolbar, Typography, Link, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeView from "./views/HomeView";
import TutorialView from "./views/TutorialView";
import AboutView from "./views/AboutView";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginLeft: theme.spacing(8),
    },
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className="app">
      <AppBar color="primary" position="static">
        <Toolbar className="navbar">
          <Box className="title-container">
            <Typography variant="h6" className="title" align="center">
              Evaluation von Klassifikatoren
            </Typography>
          </Box>
          <Box className="link-container">
            <Typography className={classes.root}>
              <Link href="/" color="inherit">
                Home
              </Link>
              <Link href="/about" color="inherit">
                Projekt
              </Link>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomeView />
          </Route>
          <Route path="/tutorial">
            <TutorialView />
          </Route>
          <Route path="/about">
            <AboutView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
