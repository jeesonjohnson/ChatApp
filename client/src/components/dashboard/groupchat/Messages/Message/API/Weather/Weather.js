import React from "react";
import "./Weather.css";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';



//Styling for material UI
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));


export default function App({response}) {
//   var response = {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],"base":"stations","main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},"visibility":10000,"wind":{"speed":4.1,"deg":80},"clouds":{"all":90},"dt":1485789600,"sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},"id":2643743,"name":"London","cod":200};
  const classes = useStyles();
  const theme = useTheme();
  const imageLocation = "../icons/"+response.weather[0].icon+".png";

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {response.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {response.weather[0].main}
          </Typography>
          <div>
            <Typography variant="caption" color="textSecondary">
              T: {(response.main.temp-273.15).toString().substring(0,4)} C
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="textSecondary">
              H: {response.main.humidity} %
            </Typography>
          </div>
        </CardContent>
      </div>
      <CardMedia
        className={classes.cover}
        image={imageLocation}
      />
    </Card>
  );
}