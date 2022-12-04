import React, { useState, useEffect, useMemo, useRef } from "react";
import ClienteService from "../Services/ClienteService";
import { Link, Route,useNavigate } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faTrashCan, faPlus, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import OrdemService from  "../Services/OrdemService";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddOrdem from './AddOrdem';
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";
import ServicoService from  "../Services/ServicoService";
import moment from "moment-timezone";
library.add(faPenToSquare, faTrashCan, faPlus);

const OrdemList = (props) => {

  const veiculoRef = useRef()
  veiculoRef.current = props.veiculo;
    const navigate = useNavigate();
  const [ordens, setOrdens] = useState([]);
  const [submitted, setSubmitted] = useState(false)
  const ordensRef = useRef(); //persiste entre renders ao mudar paginacao, caixa de etxto ou qqr
  ordensRef.current = ordens; //lista inicial de clientes é mantida
  const [page, setPage] = useState(1); //inicia na pagina 1
  const [count, setCount] = useState(0); 
  const [pageSize, setPageSize] = useState(3); //3 itens por pag
  const pageSizes = [3, 6, 9]; //itens por pagina opcoes
  const [data, setData] = useState(new Date())
  const initialOrdemState =
    {
        placa: "",
        codFuncionario: null,
        dataAbertura: moment.tz(data,"America/Sao_Paulo").format("yyyy-MM-DD"),
        valorTotalServicos: 0,
        valorTotalPecas: 0,
        aberto: true,
        atrasado: false,
        devolvido: false
        }
      
  const [ordem, setOrdem] = useState(initialOrdemState);
  //o filho acessa props.ordem e muda os valores quando tem seus inputs alterados
  //a ordem é setada no filho, e salva aqui
  const handleInputChange = event => {
   // console.log(event.target)
    const { name, value } = event.target;
    setOrdem({ ...ordem, [name]: value });
    console.log(ordem)
  };

  const handleInputCheckChange = event => {
    const { name, checked } = event.target;
    if(name=="aberto")
    setOrdem({ ...ordem, [name]: !checked });
    if(name=="devolvido")
    setOrdem({ ...ordem, [name]: checked });
    console.log(ordem)
    };
 
  const [ordemCriada, setOrdemCriada] = useState(false); 
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false); setOrdem(initialOrdemState);  setOrdemCriada(false)
  }
  const handleShow = () => setShow(true);
  const getRequestParams = (page, pageSize) => { //parametros para Api
    let params = {};
    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };
const [ajuste, setAjuste] = useState(false)

  useEffect(() => {
    retrieveOrdens();
    setAjuste(!ajuste)
  }, [page, pageSize, props.veiculo? props.veiculo: props.funcionario]); //quando muda a pagina ou pageSize, reexecuta retrieveClientes


  const retrieveOrdens = () => {
    const params = getRequestParams(page, pageSize); //pega parametros
//acha ordens pertencentes a um veiculo
    if(props.veiculo){
     console.log("veiculo recebido de props ", props.veiculo, "   -- veiculo salvo do props: ", veiculoRef.current)
        OrdemService.findByPlaca(veiculoRef.current.placa, params)//acha lista de ordens por placa
            .then(response => { 
              if(response.status ==204){
                setOrdens([]);
                return
              }  
               const ordensGet = response.data.ordens //lista orndensGet
               const totalPages = response.data.totalPages
              //Busca valores em peças e mao de obra para cada ordem da lista
               ordensGet.map(ord => { //mapeia itens da lista(para cada ord de ordensGet)
                ServicoService.getValores(ord.id) //get valoresP e MaoObra para o item de id
                  .then(responseV =>{
                    const {valorTPecas, valorTServicos} = responseV.data;
                    ord.valorTotalPecas = valorTPecas //atualiza valores item
                    ord.valorTotalServicos = valorTServicos //seta valores de ord
                   }) 
                })
               setOrdens(ordensGet);
               setCount(totalPages);
       //console.log("ordens com valores: ", ordens);
      })
      .catch(e => {
        console.log(e);
      });
    } 
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const deleteOrdem = (rowIdx) => {
    const id = ordensRef.current[rowIdx].id; 
    OrdemService.remove(id)
      .then(response => {
        console.log(response.data);
        retrieveOrdens();
      })
      .catch(e => {
        console.log(e);
      });
  };

  //pega uma ordem do banco
  const getOrdem = (id) =>{
    OrdemService.get(id)
        .then(response => {
          ServicoService.getValores(response.data.id)
          .then(response2 =>{
            setOrdem({
              id: response.data.id,
              placa: response.data.placa,
              codFuncionario: response.data.codFuncionario,
              dataAbertura: response.data.dataAbertura,
              valorTotalServicos: response2.data.valorTServicos,
              valorTotalPecas: response2.data.valorTPecas,
              aberto: response.data.aberto,
              atrasado: response.data.atrasado,
              devolvido: response.data.devolvido
              });
          })
          .catch(e2 => {
            console.log(e2);
          });
        })
        .catch(e => {
          console.log(e);
        });


  }
  //abre ordem clicada
  const openOrdem = (rowIndex) => {
    const id = ordensRef.current[rowIndex].id;
    getOrdem(id)
    setOrdemCriada(true)
    handleShow() //abre modal de edição
  };

  //DEFINICAO TABELA
  const columns = useMemo(
    () => [
      {
        Header: "Código da ordem",
        accessor: "id",
      },
      {
        Header: "Funcionario",
        accessor: "funcionario.pessoa.nome",
      },
      {
        Header: "Placa",
        accessor: "placa",
      },
      {
        Header: " ",
        accessor: "actions",
        Cell: (props) => {
         // console.log(props)
          const rowIdx = props.row.id; //recebe o props de um elemento -> recebe o indice da linha 
          return (
            <div className="row" align="center">
            <div className="col-sm">
              <span onClick={() => openOrdem(rowIdx)}> {/**rowIdx é o indice do cliente na lista clientes */}
              <OverlayTrigger
                      key={"ed"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"ed"}`}>
                            <strong>{"editar Ordem"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    </OverlayTrigger>
              
              </span>
            </div>
            <div className="col-sm">
              <span onClick={() => deleteOrdem(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"deletar Ordem"}</strong>.
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
                            <strong>{"Servicos"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon={faScrewdriverWrench} />
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

  const rowsPersist = useRef()
  //Varias funcoes que recebem dados da tabela
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ //tabela usada
    columns, //colunas definidas acima
    data: ordens
    //dados com acessor
  });
  
  const saveOrdem= () => { 
    //faz o Post
  if(moment.tz(ordem.dataAbertura,"America/Sao_Paulo").format("d")!=6 && moment.tz(ordem.dataAbertura,"America/Sao_Paulo").format("d")!=0)
    OrdemService.create(ordem.codFuncionario,props.veiculo.placa, ordem.dataAbertura) 
      .then(response => {
        setOrdem({
            id: response.data.id,
            placa: response.data.placa,
            codFuncionario: response.data.codFuncionario,
            dataAbertura: response.data.dataAbertura,
            valorTotalServicos: response.data.valorTotalServicos,
            valorTotalPecas: response.data.valorTotalPecas,
            aberto: response.data.aberto,
            atrasado: response.data.atrasado,
            devolvido: response.data.devolvido
            });
            retrieveOrdens();
        setOrdemCriada(true)
        setSubmitted(true)
 console.log(response)
    })
      .catch(e => {
        console.log(e);
        alert("Um funcionário deve ser selecionado")
      }); 
      else
        alert("Ordens não podem ser criadas nos sábados e domingos") 

  };
const updateOrdem = () =>{
  console.log(ordem)
  //faz o Put
  OrdemService.update(ordem.id, ordem) 
  .then(response => {
    setOrdem({
        id: response.data.id,
        placa: response.data.placa,
        codFuncionario: response.data.codFuncionario,
        dataAbertura: response.data.dataAbertura,
        valorTotalServicos: response.data.valorTotalServicos,
        valorTotalPecas: response.data.valorTotalPecas,
        aberto: response.data.aberto,
        atrasado: response.data.atrasado,
        devolvido: response.data.devolvido
        });
        retrieveOrdens();
    setOrdemCriada(true)
    setSubmitted(true)

console.log(response)
})
  .catch(e => {
    console.log(e);
  });
}

  return (
    <div className="list row" style={{paddingLeft: "0rem"}}>
      <h3 align="center">Gerencie as ordens de serviço do veículo</h3><br/><br/><br/><br/>
      <div className="col-md-8">
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
            count={count} //contem a qtd total de paginas(paginas selecionaveis)
            page={page} //ao mudar este valor, o indice(pagina selecionada) muda
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange} //altera a pagina(indice) e dispara nova busca na api
          />
           <Button variant="primary" onClick={handleShow}>
        Cadastrar ordem
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
                   //console.log("celula: ", cell.value)
                    return (
                      <td {...cell.getCellProps()}>
                         {cell.render("Cell")} 
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{ordemCriada? "Editar Ordem e Serviços": "Cadastro de Ordem de serviços"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <AddOrdem ordem={ordem} veiculo={props.veiculo} handleInputChange = {handleInputChange} criada={ordemCriada} submitted={submitted} setSubmitted={setSubmitted}
         handleCheckChange={handleInputCheckChange}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Voltar
          </Button>
          <Button variant="primary" onClick={ordemCriada?updateOrdem: saveOrdem}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdemList;