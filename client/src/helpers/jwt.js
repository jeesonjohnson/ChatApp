import axios from "axios"

export const getJwt =()=>{
    return localStorage.getItem("jwt")
}

export const axiosGet =(address,dataToSend={})=>
{
    const jwt = getJwt();
    return axios.get(address,{headers:{Authorization: `Bearer ${jwt}`},dataToSend});

}