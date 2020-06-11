import React from "react";
import "./Weather.css";
import Error from "../Error/Error";

export default function App(props) {
  var response = props.response;
  if (response.cod !== 200) {
    return <Error></Error>;
  }
  const imageLocation = "./icons/" + response.weather[0].icon + ".png";
  return (
    <div className="outerCardContainer">

    <div className="APIcard">
      <h2 style={{ paddingLeft:8 }}><b>{response.name}</b></h2>
      <div className="APIimgdiv">
        <div>
        <img src={require(`${imageLocation}`)} style={{ height: 200, width: 200 }}/>
      </div>
      </div>
      <div className="weatherLetterPadding">
      <h4>Weather: <b>{response.weather[0].main}</b></h4>
          <h5>T: {(response.main.temp - 273.15).toString().substring(0, 4)} C</h5>
          <h5>H: {response.main.humidity} %</h5>
        </div>
  </div>
    </div>
  );
  //   return (
  //     <Card className={classes.root}>
  //       <div className={classes.details}>
  //         <CardContent className={classes.content}>
  //           <Typography component="h5" variant="h5">
  //             {response.name}
  //           </Typography>
  //           <Typography variant="subtitle1" color="textSecondary">
  //             {response.weather[0].main}
  //           </Typography>
  //           <div>
  //             <Typography variant="caption" color="textSecondary">
  //               T: {(response.main.temp-273.15).toString().substring(0,4)} C
  //             </Typography>
  //           </div>
  //           <div>
  //             <Typography variant="caption" color="textSecondary">
  //               H: {response.main.humidity} %
  //             </Typography>
  //           </div>
  //         </CardContent>
  //       </div>
  //       <CardMedia
  //         className={classes.cover}
  //         image={imageLocation}
  //       />
  //     </Card>
  //   );
}
