import http from "../http-common";

const getAllEstados = () => {
    return http.get("/estados");
  };

  const getEstadoByNome = nome => {
    return http.get(`/estados?nome=${nome}`);
  };
  const getCidadesByEstado = id => {
    return http.get(`/estado/cidades/${id}`);
  };

  const LocaisService = {
    getAllEstados,
    getEstadoByNome,
    getCidadesByEstado
  };
  
  export default LocaisService;