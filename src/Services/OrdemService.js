import http from "../http-common";

const get = id => {
  return http.get(`/ordens/${id}`);
};

const findByPlaca = (placa, params) => {
    return http.get(`ordens/veiculo/${placa}?page=${params.page}&size=${params.size}`);
  };
 
  const findByAnoMes = (ano, mes) => {
    return http.get(`/ordens/${ano}/${mes}`)
  };

  const findByFuncionario = (codFuncionario, params) => {
    return http.get(`/ordens/fucionario/${codFuncionario}`, params);
  };

const create = (codFuncionario, placa, dataA) => {
  //console.log("placa ",placa)
  return http.post(`/ordens/${codFuncionario}/${placa}?dataAbertura=${dataA}`);
};

const remove = id => {
  return http.delete(`/ordem/${id}`);
};

const update = (id, data) =>{
  return http.put(`/ordens/${id}`, data);
};


const OrdemService = {
  get,
  create,
  remove,
  findByPlaca,
  findByFuncionario,
  findByAnoMes,
  update
};

export default OrdemService;