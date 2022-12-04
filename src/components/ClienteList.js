import React, { useState, useEffect, useMemo, useRef } from "react";
import ClienteService from "../Services/ClienteService";
import { Link, Route,useNavigate } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faTrashCan, faPlus, faPowerOff, faUserSlash, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

library.add(faPenToSquare, faTrashCan, faPlus,faPowerOff,faUserSlash,faEyeSlash,faEye);

const ClienteList = (props) => {
    const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  /*const [currentCLiente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);*/
  const [searchNome, setSearchNome] = useState("");
  const clientesRef = useRef(); //persiste entre renders ao mudar paginacao, caixa de etxto ou qqr
  clientesRef.current = clientes; //lista inicial de clientes é mantida
  const [page, setPage] = useState(1); //inicia na pagina 1
  const [count, setCount] = useState(0); 
  const [pageSize, setPageSize] = useState(3); //3 itens por pag
  const pageSizes = [3, 6, 9]; //itens por pagina opcoes
  const getRequestParams = (searchNome, page, pageSize) => { //parametros para Api
    let params = {};

    if (searchNome) { //se houver SearchNome, se torna parametro
      params["nome"] = searchNome;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  
  useEffect(() => {
    retrieveClientes();
  }, [page, pageSize]); //quando muda a pagina ou pageSize, reexecuta retrieveClientes

  

  const retrieveClientes = () => {
    const params = getRequestParams(searchNome, page, pageSize); //pega parametros

    ClienteService.getAll(params)
      .then(response => {
        const { clientes, totalPages } = response.data
        setClientes(clientes);
        setCount(totalPages);

       if(response.status ==204)
           setClientes([])
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };
  //sera executado quando o nome SearchNome for preenchido
  const findByNome= () => {
    setPage(1);
    retrieveClientes(); //O nome se torna um parametro
  };
  const refreshList = () => {
    retrieveClientes();
    //setCurrentCliente(null);
   // setCurrentIndex(-1);
  };

  /*const setActiveCliente = (cliente, index) => {
    setCurrentCliente(cliente);
    setCurrentIndex(index);
  };*/

  const removeAllClientes = () => {
    ClienteService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const onChangeSearchNome = (e) => {
    const searchNome = e.target.value;
    setSearchNome(searchNome);
  };
  const deleteCliente = (id) => {
    const codcli = clientesRef.current[id].cod_cliente;
    ClienteService.remove(codcli)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
const telaCadastro = ()=>{
  navigate("/add")
}
  const openCliente = (rowIndex) => {
    const id = clientesRef.current[rowIndex].cod_cliente;
    if(clientesRef.current[rowIndex].cAtivo)
      navigate("/clientes/edit/" + id);
    else
      alert("Cliente inativo")  
  };

  //DEFINICAO TABELA
  const columns = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "pessoa.nome",
      },
      {
        Header: "Telefone",
        accessor: "pessoa.telefone",
      },
      {
        Header: "Cidade",
        accessor: "pessoa.cidade.name",
      },
      {
        Header: " ",
        accessor: "actions",
        Cell: (props) => { //gera varias linhas
          const rowIdx = props.row.id; //recebe o props de um elemento -> recebe o indice da linha que ta sendo gerada, é gerada uma linha pra cada cliente da lista clientesRef
          return (
            <div className="row" align="center">
            <div className="col-sm">
              <span onClick={() => openCliente(rowIdx)}> {/**rowIdx é o indice do cliente clicado na lista clientes */}
              <OverlayTrigger
                      key={"ed"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"ed"}`}>
                            <strong>{"editar cliente"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    </OverlayTrigger>
              
              </span>
            </div>
            <div className="col-sm">
              <span onClick={() => deleteCliente(rowIdx)}> 
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{clientesRef.current[rowIdx].cAtivo? "Desativar cliente":"Reativar cliente"}</strong>.{/**acessando cliente da linha rowIdx*/}
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon={clientesRef.current[rowIdx].cAtivo?"fa-solid fa-power-off":"fa-solid fa-user-slash"} />
                    </OverlayTrigger>
              
              </span>
              </div>  
              <div className="col-sm">
              <span onClick={() => navigate("/add")}>
              <OverlayTrigger
              delay={{hide: 5 }}
                      key={"cri"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"cri"}`}>
                            <strong>{"novo cliente"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-plus" />
                    </OverlayTrigger>
              </span>
              </div> 
            </div>
          );
        },
      },
    ],
    []
  );

  //Varias funcoes que recebem dados da tabela
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ //tabela usada
    columns, //colunas definidas acima
    data: clientes, //dados com acessor, sera gerada uma linha pra cada cliente da lista
  });


  //constantes que mostram ou nao usuario inativo
  const [showInativos, setShowInativos] = useState(false)
  const onclickEye = () =>{
    setShowInativos(!showInativos)
  }

  return (
    <div className="list row" style={{paddingLeft:"50px", paddingTop:"30px",width:"95%"}}>
      <h3 align="center">Clientes</h3><br/><br/><br/>
      <hr/>
      <h4>Procurar Cliente</h4>
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome do cliente"
            value={searchNome}
            onChange={onChangeSearchNome}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByNome}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-12 list">
        {/**Itens p/ pg */}
      {"Itens por página: "} {/**handlePageSize atualiza pageSize que dispara nova busca na api pelo useEffect */}
          <select onChange={handlePageSizeChange} value={pageSize}> 
            {pageSizes.map((size) => ( //opcao dos tamanhos que podem ser escolhidos
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {/**Paginacao -> indice das paginas*/}
          <div style={{display:"flex"}}>
          <div style={{flex:"80%"}}>
          <Pagination
            className="my-3"
            count={count} //contem a qtd total de paginas(paginas selecionaveis)
            page={page} //ao mudar este valor, o indice(pagina selecionada) muda
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange} //altera a pagina(indice) e dispara nova busca na api
          /></div>
          <div style={{flex:"20%", marginTop:"15px"}}>
          <span onClick={() => onclickEye()}>
          <OverlayTrigger
          delay={{hide: 5 }}
              key={"del"}
              placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"del"}`}>
                    <strong>{showInativos? "Ocultar clientes inativos":"Mostrar clientes inativos"}</strong>.{/**acessando cliente da linha rowIdx*/}
                  </Tooltip>
                }>  
            <FontAwesomeIcon icon={showInativos?"fa-solid fa-eye":"fa-solid fa-eye-slash"} />
          </OverlayTrigger>
          </span>
          </div>
          <div style={{flex:"20%"}}>
          <button onClick={telaCadastro} className="btn btn-primary" style={{height:"auto"}}>Cadastrar cliente</button>
          </div>
          </div>
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => ( //mapeia as colunas/headers extraidas
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}> {/**pega props do corpo gerado */}
            {rows.map((row, i) => { //cada row recebe indice(a lista clientes tem indices)
              prepareRow(row); {console.log(row)}
              if(row.original.cAtivo) //se o cliente tiver ativo, imprime a sua linha(table row) com celulas dentro
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
              else if(showInativos)//se não... apenas imprime se showInativos estiver true
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClienteList;