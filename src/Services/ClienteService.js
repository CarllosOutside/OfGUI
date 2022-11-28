import http from "../http-common";

const getAll = (params) => {
  return http.get("/clientes",{ params });
};

const get = id => {
  return http.get(`/clientes/${id}`);
};

const create = data => {
  return http.post("/clientes", data);
};

const update = (id, data) => {
  return http.put(`/clientes/${id}`, data);
};

const remove = id => {
  return http.delete(`/clientes/${id}`);
};

const removeAll = () => {
  return http.delete(`/clientes`);
};

const findByNome = nome => {
  return http.get(`/clientes?nome=${nome}`);
};
const getLista = () =>{
  return http.get(`/clientes/lista`);
}
const ClienteService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByNome,
  getLista
};

export default ClienteService;