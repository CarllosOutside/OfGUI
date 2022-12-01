import React, { useState, useEffect, useMemo, useRef } from "react";
import ClienteService from "../Services/ClienteService";
import { Link, Route,useNavigate } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import FuncionarioService from  "../Services/FuncionarioService";

library.add(faPenToSquare, faTrashCan, faPlus);

const FuncionariosList = (props) => {
    const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  /*const [currentCLiente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);*/
  const [searchNome, setSearchNome] = useState("");
  const funcionariosRef = useRef(); //persiste entre renders ao mudar paginacao, caixa de etxto ou qqr
  funcionariosRef.current = funcionarios; //lista inicial de clientes é mantida
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
    retrieveFuncionarios();
  }, [page, pageSize]); //quando muda a pagina ou pageSize, reexecuta retrieveClientes

  const telaCadastro = ()=>{
    navigate("/funcionario/add")
  }

  const retrieveFuncionarios = () => {
    const params = getRequestParams(searchNome, page, pageSize); //pega parametros

    FuncionarioService.getAll(params)
      .then(response => {
        const { funcionarios, totalPages } = response.data
        setFuncionarios(funcionarios);
        setCount(totalPages);
        if(response.status ==204)
            setFuncionarios([])
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
    retrieveFuncionarios(); //O nome se torna um parametro
  };
  const refreshList = () => {
    retrieveFuncionarios();
    //setCurrentCliente(null);
   // setCurrentIndex(-1);
  };

  /*const setActiveCliente = (cliente, index) => {
    setCurrentCliente(cliente);
    setCurrentIndex(index);
  };*/


  const onChangeSearchNome = (e) => {
    const searchNome = e.target.value;
    setSearchNome(searchNome);
  };
  const deleteFuncionario = (id) => {
    const codfun = funcionariosRef.current[id].cod_funcionario;
    FuncionarioService.remove(codfun)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openFuncionario = (rowIndex) => {
    const id = funcionariosRef.current[rowIndex].cod_funcionario;
    navigate("/funcionarios/edit/" + id);
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
        Cell: (props) => {
          const rowIdx = props.row.id; //recebe o props de um elemento -> recebe o indice da linha
          return (
            <div className="row" align="center">
            <div className="col-sm">
              <span onClick={() => openFuncionario(rowIdx)}> {/**rowIdx é o indice do cliente na lista clientes */}
              <OverlayTrigger
                      key={"ed"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"ed"}`}>
                            <strong>{"editar funcionario"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    </OverlayTrigger>
              
              </span>
            </div>
            <div className="col-sm">
              <span onClick={() => deleteFuncionario(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"deletar funcionario"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                    </OverlayTrigger>
              
              </span>
              </div>  
              <div className="col-sm">
              <span onClick={() => navigate("/funcionario/add")}>
              <OverlayTrigger
              delay={{hide: 5 }}
                      key={"cri"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"cri"}`}>
                            <strong>{"novo funcionario"}</strong>.
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
    data: funcionarios, //dados com acessor
  });

  return (
    <div className="list row" style={{paddingLeft:"50px", paddingTop:"30px",width:"95%"}}>
      <h3 align="center">Colaboradores</h3><br/><br/><br/>
      <hr/>
      <h4>Procurar Colaborador</h4>
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome do colaborador"
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
          <div style={{flex:"20%"}}>
          <button onClick={telaCadastro} className="btn btn-primary" style={{height:"auto"}}>Cadastrar colaborador</button>
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
              prepareRow(row);
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

export default FuncionariosList;