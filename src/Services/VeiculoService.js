import http from "../http-common";

const getAll = () => {
  return http.get("/veiculos");
};

const create = (placa, codCliente) => {
  return http.post(`/veiculos/${placa}?cod_cliente=${codCliente}`);
};

const findByPlaca = placa => {
    return http.get(`/veiculos/${placa}`);
  };
  const update = (placa, data) => {
    return http.put(`/veiculos/${placa}` ,data);
  };

  const findByMarca = marca => {
    return http.get(`/veiculos?marca=${marca}`);
  };  
  
  const findByCliente = (codCliente, params) => {
    return http.get(`/veiculos/cliente/${codCliente}`, {params});
  };
  const remove = placa => {
    return http.delete(`/veiculos/${placa}`);
  }; 

const VeiculoService = {
  getAll,
  findByMarca,
  findByCliente,
  create,
  findByPlaca,
    remove,
    update
};

export default VeiculoService;