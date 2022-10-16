import axios from "axios";

export default axios.create({
  baseURL: "https://oficina-gesma.herokuapp.com/api",
  proxy: "https://oficina-gesma.herokuapp.com/",
  headers: {
    "Content-type": "application/json"
  }
});