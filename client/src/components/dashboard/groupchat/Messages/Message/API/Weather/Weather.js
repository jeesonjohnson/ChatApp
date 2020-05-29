import React from "react";
import "./Weather.css";
import Error from "../Error/Error";


export default function App(props) {
    var response = props.response;
    if(response.cod!==200){
      return (<Error></Error>)
  }
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