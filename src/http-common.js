import axios from "axios";

export default axios.create({
  //baseURL: "https://oficina-gesma.herokuapp.com/api",
  //proxy: "https://oficina-gesma.herokuapp.com/",
  baseURL: "http://localhost:8080/api",
  proxy: "http://localhost/",
  headers: {
    "Content-type": "application/json"
  }
});