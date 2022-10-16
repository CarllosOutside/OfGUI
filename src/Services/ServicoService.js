import http from "../http-common";

const get = id => {
  return http.get(`/servicos/${id}`);
};

const findByOrdem = (codOrdem, params) => {
    return http.get(`/servicos/ordem/${codOrdem}?page=${params.page}&size=${params.size}`);
  };


const create = (codOrdem,data) => {
  return http.post(`/servicos/${codOrdem}`, data);
};

const remove = id => {
  return http.delete(`/servico/${id}`);
};

const update = (id,data) => {
  return http.put(`/servicos/${id}`, data);
};


const getValores = codOrdem =>{
  return http.get(`/ordem/${codOrdem}/valores`);
}

const ServicoService = {
  get,
  create,
  remove,
  findByOrdem,
  update,
  getValores
};

export default ServicoService;