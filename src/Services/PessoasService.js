import http from "../http-common";

const getAll = () => {
  return http.get("/pessoas");
};

const get = id => {
  return http.get(`/pessoas/${id}`);
};

const create = data => {
  return http.post("/pessoas", data);
};

const update = (id, data) => {
  return http.put(`/pessoas/${id}`, data);
};

const remove = id => {
  return http.delete(`/pessoas/${id}`);
};

const removeAll = () => {
  return http.delete(`/pessoas`);
};

const PessoasService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll
};

export default PessoasService;