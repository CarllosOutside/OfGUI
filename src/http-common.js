import axios from "axios";

export default axios.create({
  baseURL: "https://oficinamecanica-production.up.railway.app/api",
  proxy: "https://oficinamecanica-production.up.railway.app/",
  //baseURL: "http://localhost:8080/api",
  //proxy: "http://localhost/",
  headers: {
    "Content-type": "application/json"
  }
});