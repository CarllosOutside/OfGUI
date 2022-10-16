import http from "../http-common";

const findByCnpj = cnpj => {
  return http.get(`/juridicas/${cnpj}`);
};

const create = (cnpj, pessoa) =>{
    return http.post(`/juridicas?cnpj=${cnpj}`, pessoa);
};

const findByPessoa = codPessoa =>{
  return http.get(`/juridicas/pessoa/${codPessoa}`)
};
const update = (codPessoa, cnpj) =>{
  http.delete(`/fisicas/pessoa/${codPessoa}`)
  return http.put(`/juridicas/pessoa/${codPessoa}?cnpj=${cnpj}`)

};

const deleteByPessoa = codPessoa =>{
  return http.delete(`/juridicas/pessoa/${codPessoa}`);
}
const JuridicaServices = {
  findByCnpj,
  create,
  findByPessoa,
  update,
  deleteByPessoa
};


export default JuridicaServices;