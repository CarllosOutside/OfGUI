import http from "../http-common";

const findByCpf = cpf => {
  return http.get(`/fisicas/${cpf}`);
};

const create = (cpf, pessoa) =>{
    return http.post(`/fisicas?cpf=${cpf}`, pessoa);
};

const findByPessoa = codPessoa =>{
  return http.get(`/fisica/pessoa/${codPessoa}`)
};

const update = (codPessoa, cpf) =>{
   http.delete(`/juridicas/pessoa/${codPessoa}`)
   return  http.put(`/fisica/pessoa/${codPessoa}?cpf=${cpf}`)
  };
 
  const deleteByPessoa = codPessoa =>{
    return http.delete(`/fisicas/pessoa/${codPessoa}`);
  }

const FisicaService = {
  findByCpf,
  create,
  findByPessoa,
  update,
  deleteByPessoa
};


export default FisicaService;