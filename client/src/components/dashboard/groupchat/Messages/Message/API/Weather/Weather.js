import React from "react";
import "./Weather.css";


export default function App(props) {
    console.log("MESSAGE COMPONENT OUPTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    var response = props.response;
    console.log(response);
    console.log(typeof(response))
    console.log("MESSAGE FINISHEDdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
    // response = {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],"base":"stations","main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},"visibility":10000,"wind":{"speed":4.1,"deg":80},"clouds":{"all":90},"dt":1485789600,"sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},"id":2643743,"name":"London","cod":200};
  const imageLocation = "./icons/"+response.weather[0].icon+".png";
  var loading =true;
    //ui needs to be changed here
  return (
      <div className="APIcard">
        <img src={require("./icons/09d.png")} className="APIimg" style={{width:"30%",height:"30%"}}/>
        <div class="container">
        <h4><b>{response.name}</b></h4>
        <p><b>{response.weather[0].main}</b></p>
            <p>T: {(response.main.temp-273.15).toString().substring(0,4)} C</p>
            <p>H: {response.main.humidity} %</p>
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