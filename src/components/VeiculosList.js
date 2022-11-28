import React, { useState, useEffect, useMemo, useRef } from "react";
import ClienteService from "../Services/ClienteService";
import { Link, Route,useNavigate, useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faTrashCan, faPlus, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import VeiculoService from "../Services/VeiculoService";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AddVeiculo from './AddVeiculo';
import OrdemList from './OrdemList';

library.add(faPenToSquare, faTrashCan, faPlus);

const VeiculosList = (props) => {
  const [show, setShow] = useState(false);

  const [showOrdem, setShowOrdem] = useState(false);

  const handleClose = () => {setShow(false); setVeiculo(initialVeiculoState);  setVeiculoCriado(false)
  }
  const handleShow = () => setShow(true);

  const handleCloseOrdem = () =>{ setShowOrdem(false);setVeiculo(initialVeiculoState);}
  
  const handleShowOrdem = () => setShowOrdem(true);


  const navigate = useNavigate()
  const [searchPlaca, setSearchPlaca] = useState();
  const [veiculosList, setVeiculosList] = useState([])
  const veiculosRef = useRef(); //persiste entre renders ao mudar paginacao, caixa de etxto ou qqr
  veiculosRef.current = veiculosList; //lista inicial de clientes é mantida

  const codCliente = useRef() //salva uma variavel entre renders, mas nao entre reloads
  codCliente.current = props.codCliente //persiste o codigo cliente recebido por props

  const {id} = useParams() //id do cliente carregado na pagina -> ver App.js :id

  const [page, setPage] = useState(1); //inicia na pagina 1
  const [count, setCount] = useState(0); 
  const [pageSize, setPageSize] = useState(3); //3 itens por pag
  const pageSizes = [3, 6, 9]; //itens por pagina opcoes
  
  const getRequestParams = (placa, page, pageSize) => { //parametros para Api  
    let params = {};

    if (placa) { //se houver placa
      params["placa"] = placa;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params; //{placa: "aaa", page: 2, pageSize: 3}
  };

  
  useEffect(() => {
      retrieveVeiculos(props.codCliente)
  }, [page, pageSize]); //quando muda a pagina ou pageSize, reexecuta retrieveClientes

  

  const retrieveVeiculos = (propsCod) => {
    const params = getRequestParams(searchPlaca, page, pageSize); //pega parametros

    VeiculoService.findByCliente(id, params)
      .then(response => {
        const { veiculos, totalPages } = response.data
        setVeiculosList(veiculos);
        setCount(totalPages);
       if(response.status ==204)
            setVeiculosList([]);
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
  const findByPlaca= () => {
    setPage(1);
    retrieveVeiculos(); //O nome se torna um parametro
  };
  const refreshList = () => {
    retrieveVeiculos();
    //setCurrentCliente(null);
   // setCurrentIndex(-1);
  };

  /*const setActiveCliente = (cliente, index) => {
    setCurrentCliente(cliente);
    setCurrentIndex(index);
  };*/


  const onChangeSearchPlaca = (e) => {
    const searchNome = e.target.value;
    setSearchPlaca(searchNome);
  };
  const deleteVeiculo = (id) => {
    const placa = veiculosRef.current[id].placa;
    VeiculoService.remove(placa)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openVeiculo = (rowIndex) => { //ao clicar em editar abre um veiculo
    const placa = veiculosRef.current[rowIndex].placa; //pega sua placa na celula da tabela
    getVeiculo(placa) //busca no banco
    setVeiculoCriado(true) //permite edicao
        handleShow() //mostra modal
  };
  const openOrdem = (rowIndex) => { //ao clicar em editar abre um veiculo
    const placa = veiculosRef.current[rowIndex].placa; //pega sua placa na celula da tabela
    getVeiculo(placa) //busca no banco
    handleShowOrdem() //mostra modal
  };
const getVeiculo = (placa) =>{
  VeiculoService.findByPlaca(placa)
      .then(response => {
        setVeiculo({
          placa: response.data.placa, //preenche json
          marca: response.data.marca,
          modelo: response.data.modelo,
          ano: response.data.ano,
          cor: response.data.cor,
          codCliente: response.data.codCliente,
          cliente: response.data.cliente
      });
      })
      .catch(e => {
        console.log(e);
      });
}
  //DEFINICAO TABELA
  const columns = useMemo(
    () => [
      {
        Header: "Placa",
        accessor: "placa",
      },
      {
        Header: "Marca",
        accessor: "marca",
      },
      {
        Header: "Modelo",
        accessor: "modelo",
      },
      {
        Header: "ano",
        accessor: "ano",
      },
      {
        Header: " ",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id; //recebe o props de um elemento -> recebe o indice da linha
          return (
            <div className="row" align="center">
            <div className="col-sm">
              <span onClick={() => openVeiculo(rowIdx)}> {/**rowIdx é o indice do cliente na lista clientes */}
              <OverlayTrigger
                      key={"ed"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"ed"}`}>
                            <strong>{"editar veiculo"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    </OverlayTrigger>
              
              </span>
            </div>
            <div className="col-sm">
              <span onClick={() => deleteVeiculo(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"deletar veiculo"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                    </OverlayTrigger>
              
              </span>
              </div>  
              <div className="col-sm">
              <span onClick={() => openOrdem(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"ordens de serviço"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon={faClipboardList} />
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
const [submitted, setSubmitted] = useState(false)
  //Varias funcoes que recebem dados da tabela
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ //tabela usada
    columns, //colunas definidas acima
    data: veiculosList, //dados com accessor
  });

  const initialVeiculoState =
  {
      placa: "",
      marca: "",
      modelo: "",
      ano: "",
      cor: "",
      codCliente: null,
      cliente: null
      }
    
const [veiculo, setVeiculo] = useState(initialVeiculoState);
const [veiculoCriado, setVeiculoCriado] = useState(false);

  const saveVeiculo= () => {
    //faz o Post
    VeiculoService.create(veiculo.placa, id) 
      .then(response => {
        setVeiculo({
            placa: response.data.placa,
            marca: response.data.marca,
            modelo: response.data.modelo,
            ano: response.data.ano,
            cor: response.data.cor,
            codCliente: response.data.codCliente,
            cliente: response.data.cliente
        });
        retrieveVeiculos(props.codCliente);
        setVeiculoCriado(true)
 console.log(response)
 setSubmitted(true)
    })
      .catch(e => {
        console.log(e);
      });
  };
const updateVeiculo = () =>{
    var data = veiculo
    console.log(data)
    VeiculoService.update(data.placa, data)
    .then(response => {
      setVeiculo({
        placa: response.data.placa,
        marca: response.data.marca,
        modelo: response.data.modelo,
        ano: response.data.ano,
        cor: response.data.cor,
        codCliente: response.data.codCliente,
        cliente: response.data.cliente
    });
    retrieveVeiculos(props.codCliente);
      console.log(response);//imprime pessoa atualizada
    })
    .catch(e => {
      console.log(e);
    });
    setSubmitted(true)
  };
  const saveOrdem = () =>{}
//ATRIBUI VALORES À JSON VEICULO EM TEMPO REAL
const handleInputChange = event => {
  const { name, value } = event.target;
  setVeiculo({ ...veiculo, [name]: value });
  //console.log(value)
};

useEffect(() => {
  if(veiculo.cliente){
    console.log(veiculo.cliente.cod_cliente)
  setVeiculo({ ...veiculo, codCliente: veiculo.cliente.cod_cliente });
  console.log(veiculo.codCliente)
  }
 }, [veiculo.cliente]); 

  return (
    <div className="list row" style={{paddingLeft: "0rem"}}>
      <h3 align="center">Busque ou cadastre veículos do cliente</h3><br/><br/><br/><br/>
      <h4>Procurar Veículo</h4>
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Placa do veículo"
            value={searchPlaca}
            onChange={onChangeSearchPlaca}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByPlaca}
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
          <Pagination
            className="my-3"
            count={count} //contem a qtd total de paginas
            page={page} //ao mudar este valor, o indice muda
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange} //altera a pagina(indice) e dispara nova busca na api
          />
          <Button variant="primary" onClick={handleShow}>
        Cadastrar veículo
      </Button>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{veiculoCriado?"Editar veículo":"Cadastrar novo veículo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <AddVeiculo veiculo ={veiculo} handleInputChange = {handleInputChange} criado={veiculoCriado} submitted={submitted} setSubmitted={setSubmitted}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Voltar
          </Button>
          <Button variant="primary" onClick={veiculoCriado?updateVeiculo: saveVeiculo}>
            Salvar
          </Button> 
        </Modal.Footer>
      </Modal>




      <Modal show={showOrdem} onHide={handleCloseOrdem} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ordens de servico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <OrdemList veiculo ={veiculo}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOrdem}>
            Voltar
          </Button>
          <Button variant="primary" onClick={saveOrdem}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VeiculosList;