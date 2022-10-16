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
import ServicoService from "../Services/ServicoService";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AddServico from './AddServico';
import OrdemList from './OrdemList';

library.add(faPenToSquare, faTrashCan, faPlus);

const ServicoList = (props) => {

    const initialServicoState =
        {
        id: null,
        codOrdem: props.codOrdem,
        valorPecas: 0,
        valorServico: 0,
        descricao: ""
        }
      
  const [servico, setServico] = useState(initialServicoState);
  const codOrdemRef = useRef() //as vezes o codigo recebido pelo props é descarregado de props... queremos que persista mesmo nos intervalos entre renders
  codOrdemRef.current = props.codOrdem;
  const [servicoCriado, setServicoCriado] = useState(false)
  const [show, setShow] = useState(false);

  ///quando fecha a componente AddServico, seta servico criado para falso, de modo que nao mostre codigo de servico em AddServico caso clique em cadastrar novo servico
  //e tambem reseta a variavel servico, esvaziando
  const handleClose = () => {setShow(false); setServico(initialServicoState);  setServicoCriado(false)
  }
  const handleShow = () => setShow(true);

  const navigate = useNavigate()

  const [servicosList, setServicosList] = useState([])
  const servicosRef = useRef(); //persiste entre renders ao mudar paginacao, caixa de etxto ou qqr
  servicosRef.current = servicosList; //lista inicial de clientes é mantida

  const [page, setPage] = useState(1); //inicia na pagina 1
  const [count, setCount] = useState(0); 
  const [pageSize, setPageSize] = useState(3); //3 itens por pag
  const pageSizes = [3, 6, 9]; //itens por pagina opcoes
  
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

  
  useEffect(() => {
      retrieveServicos()
  }, [page, pageSize, props]); //quando muda a pagina ou pageSize, reexecuta retrieveClientes

  
///BUSCA LISTA DE SERVICOS
  const retrieveServicos = () => {
    const params = getRequestParams(page, pageSize); //pega parametros

    ServicoService.findByOrdem(codOrdemRef.current, params)
      .then(response => {
        const { servicos, totalPages } = response.data
        setServicosList(servicos);
        setCount(totalPages);
       if(response.status ==204)
            setServicosList([]);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  //PAGINACAO
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };


//DELETA UM SERVICO
  const deleteServico = (index) => {
    const id = servicosRef.current[index].id;
    ServicoService.remove(id)
      .then(response => {
        console.log(response);
        retrieveServicos();
        props.setUpdated(true)
      })
      .catch(e => {
        console.log(e);
      });
  };

  //ABRE MODAL DE EDICAO/CRIACAO DE SERVICO
  const openServico = (rowIndex) => { 
    const id = servicosRef.current[rowIndex].id; 
    getServico(id) 
    setServicoCriado(true) 
    handleShow() 
  };

  //Carrega o servico clicado pelo seu id
const getServico = (id) =>{
  ServicoService.get(id)
      .then(response => {
        setServico({
          id: response.data.id,
          codOrdem: response.data.codOrdem,
          valorPecas: response.data.valorPecas,
          valorServico: response.data.valorServico,
          descricao: response.data.descricao
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
        Header: "Codigo de Serviço",
        accessor: "id",
      },
      {
        Header: "Valor em peças",
        accessor: "valorPecas",
      },
      {
        Header: "Mão de obra",
        accessor: "valorServico",
      },
      {
        Header: "Descricao",
        accessor: "descricao",
      },
      {
        Header: " ",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id; //recebe o props de um elemento -> recebe o indice da linha
          return (
            <div className="row" align="center">
            <div className="col-sm">
              <span onClick={() => openServico(rowIdx)}> {/**rowIdx é o indice do cliente na lista clientes */}
              <OverlayTrigger
                      key={"ed"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"ed"}`}>
                            <strong>{"editar serviço"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    </OverlayTrigger>
              
              </span>
            </div>
            <div className="col-sm">
              <span onClick={() => deleteServico(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"deletar serviço"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
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
    data: servicosList, //dados com accessor
  });

  //salva um servico no banco
  const saveServico= () => {
    //faz o Post
    ServicoService.create(props.codOrdem,servico) 
      .then(response => {
        setServico({
            id: response.data.id,
            codOrdem: response.data.codOrdem,
            valorPecas: response.data.valorPecas,
            valorServico: response.data.valorServico,
            descricao: response.data.descricao
        });
            retrieveServicos();
            setServicoCriado(true) //seta para true, que é detectado como mudança em props por AddServico
            console.log(response)
            setSubmitted(true)
            props.setUpdated(true)
    })
      .catch(e => {
        console.log(e);
      });
  };
 ///atualiza um servico
 const updateServico = () =>{
  //faz o Put
  ServicoService.update(servico.id, servico) //ao clicar num servico, a funcao getServico preenche os dados do servico 
  .then(response => { //e a funcao handleInputChange deixa a component AddServico alterar dados do servico carregado
    setServico({
      id: response.data.id,
      codOrdem: response.data.codOrdem,
      valorPecas: response.data.valorPecas,
      valorServico: response.data.valorServico,
      descricao: response.data.descricao
  });
  retrieveServicos();//apos fazer update, atualiza lista de servicos
  setServicoCriado(true) //mostra codigo do servico em AddServico
  props.setUpdated(true)
console.log(response)
})
  .catch(e => {
    console.log(e);
  });
  setSubmitted(true) //mostra o toast no AddServico
}

//ATRIBUI VALORES À JSON 
const handleInputChange = event => {
  const { name, value } = event.target;
  setServico({ ...servico, [name]: value });
};

const faznada = ()=>{}

  return (
    <div className="list row" style={{paddingLeft: "0rem"}}>
      <h3 align="center">Serviços</h3>
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
        Cadastrar Servico
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
          <Modal.Title>Cadastro de Servicos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <AddServico servico ={servico} handleInputChange = {handleInputChange} criado={servicoCriado} submitted={submitted} setSubmitted={setSubmitted}
        codOrdem = {props.codOrdem}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Voltar
          </Button>
          <Button variant="primary" onClick={servicoCriado?updateServico: saveServico}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServicoList;