import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";
import Dropdown from 'react-bootstrap/Dropdown';
import FuncionarioService from "../Services/FuncionarioService";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ServicoList from "./ServicoList";
import Button from 'react-bootstrap/Button';
import OrdemService from "../Services/OrdemService";
import Form from 'react-bootstrap/Form';
import { BiWindows } from "react-icons/bi";
import moment from "moment-timezone";
import CurrencyInput from 'react-currency-input';
import Modal from 'react-bootstrap/Modal';
import AddVeiculo from './AddVeiculo';
const CadastroDeOrdemCalendario = (props) => {

const navigate = useNavigate()
const [data, setData] = useState(new Date())
  //estado inicial da ordem
  const initialOrdemState = {
    id: null,
    placa: null,
    codFuncionario: null,
    dataAbertura:  moment.tz(data,"America/Sao_Paulo").format("yyyy-MM-DD"),
    valorTotalPecas: 0,
    valorTotalServicos: 0,
    aberto: true,
    atrasado: false,
    devolvido: false
  }

  //ordem
  const [ordem, setOrdem] = useState(initialOrdemState)

  //ordem criada?
  const [criada, setCriada] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  //OnChange dos Inputs altera estado da ordem
  const handleInputChange = (event) =>{
    const {name, value} = event.target;
    setOrdem({...ordem, [name]:value});
  }
  
  //dropdown de funcionarios
    const initialFunc = {codFuncionario: null}
    const [funcionarios, setFuncionarios] = useState([])
    const [currentFuncionario, setCurrentFuncionario] = useState(initialFunc)
    const [dropDown, setDropDown] = useState(false)

   //ao selecionar um funcionario do dropdown, atualiza ordem no campo codFuncionario
useEffect(()=>{
  setOrdem({...ordem, codFuncionario: currentFuncionario.cod_funcionario})
}, [currentFuncionario])


  //verifica se esta editando uma ordem de um cart??o
  useEffect(()=>{
    if(props.ordemAberta){
      console.log(props.ordemAberta)
      setCriada(true)
      setOrdem(props.ordemAberta)
    }
  },[props])

    //lista de funcionarios disponiveis
    useEffect(() => {
      retrieveFuncionarios(); 
    }, []);
    const retrieveFuncionarios = () => {
      FuncionarioService.getLista()
        .then(response => {
          setFuncionarios(response.data);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    };

    //atualiza o campo codFuncionario de uma ordem existente, atualiza seu campo funcionario
    useEffect(() => {
      if(criada)
          getCurrentFuncionario();
    }, [ordem.codFuncionario]);

    const getCurrentFuncionario = () =>{
      FuncionarioService.get(ordem.codFuncionario)
      .then(response => {
        setCurrentFuncionario(response.data);
        //console.log("funcionario atual ", response.data);
      })
      .catch(e => {
        console.log(e);
      });

    }

  //caso o mesmo funcionario seja slecionado
  const faznada = () =>{}

  //abre/fecha dropdown
  const toggleDrop = () =>{
    setDropDown(!dropDown)
  }

  //mostra Toast de placa nao encontrada
  const [nfoundPlaca, setNfoundPlaca] = useState(false)

  //Tenta salvar a ordem preenchida
  const salvaOrdem = () =>{
    //so permite salvar se nao for sabado ou domingo
  if(moment.tz(ordem.dataAbertura,"America/Sao_Paulo").format("d")!=6 && moment.tz(ordem.dataAbertura,"America/Sao_Paulo").format("d")!=0)
    //primeiro verifica se a placa esta cadastrada
    VeiculoService.findByPlaca(ordem.placa)
    .then(response =>{
      console.log(response.data.cliente)
      if(response.data.cliente.cAtivo)
        return response.data.placa
      else
        alert("Cliente inativo!")  
    }) //depois cadastra a ordem usando a placa
    .then( placa =>{
      OrdemService.create(currentFuncionario.cod_funcionario, placa, ordem.dataAbertura)
      .then(response2=>{
        setOrdem({
          id: response2.data.id,
          placa: response2.data.placa,
          codFuncionario: response2.data.codFuncionario,
          dataAbertura: response2.data.dataAbertura,
          valorTotalServicos: response2.data.valorTotalServicos,
          valorTotalPecas: response2.data.valorTotalPecas,
          aberto: response2.data.aberto,
          atrasado: response2.data.atrasado,
          devolvido: response2.data.devolvido
          });
          console.log("ordem criada: ",ordem)
          setCriada(true)
          setSubmitted(true)
          props.changeCrud()
      })
      .catch(e2 =>{
        console.log(e2)
      })
   }) //se a placa nao estiver cadastrada...
    .catch(e => {
      console.log(e);
      setNfoundPlaca(true)
    });
    else
      alert("Ordens n??o podem ser criadas nos s??bados e domingos")
  }

 //Faz update da ordem preenchida
  const updateOrdem = () =>{
    console.log("ordem a ser atualizada", ordem)
    //faz o Put, a placa ja esta setada
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
          setCriada(true)
          setSubmitted(true)
          console.log(response)
         window.location.reload()
  })
    .catch(e => {
      console.log(e);
    });
  }

  const handleCheckChange = event => {
    const { name, checked } = event.target;
    if(name=="aberto")
    setOrdem({ ...ordem, [name]: !checked });
    if(name=="devolvido")
    setOrdem({ ...ordem, [name]: checked });
    console.log(ordem)
    };


    //estado inicial de veiculo --> nenhum
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
//veiculo ao qual se refere a placa    
const [veic, setVeic] = useState(initialVeiculoState)
const [veiculoSubmitted, setVeiculoSubmitted] = useState(false)

//busca dono do veiculo ao buscar por placa
    const busacprop = () =>{
      VeiculoService.findByPlaca(ordem.placa)
      .then(response => {
        setVeic(response.data)
      })
      .catch(e => {
        console.log(e);
      });

    }

    //permite alterar veiculo
    const handleChangeVeic = event => {
      const { name, value } = event.target;
      setVeic({ ...veic, [name]: value });
      console.log(value)
    };
    //handle change codCliente que ?? o unico campo nao preenchido por uma form
    useEffect(() => {
      if(veic.cliente){
      setVeic({ ...veic, codCliente: veic.cliente.cod_cliente });
      }
     }, [veic.cliente]); 

    ///update de veiculo
    const updateVeiculo = () =>{
      var data = veic
      //console.log(data)
      VeiculoService.update(data.placa, data)
      .then(response => {
        setVeic({
          placa: response.data.placa,
          marca: response.data.marca,
          modelo: response.data.modelo,
          ano: response.data.ano,
          cor: response.data.cor,
          codCliente: response.data.codCliente,
          cliente: response.data.cliente
      });
       // console.log(response);//imprime pessoa atualizada
      })
      .catch(e => {
        console.log(e);
      });
      setVeiculoSubmitted(true)
    };

    const [showEdit, setShowEdit] = useState(false);
  
    const handleCloseEdit = () => {setShowEdit(false); setVeic(initialVeiculoState);
    }
    const handleShowEdit = () => setShowEdit(true);

  //Renderiza componente
  return (
    <div className="submit-form">
      <div>
      <h3 align="center">Ordem de Servi??o</h3>
        {(criada)?  //se o veiculo ja foi criado, desabilita a funcao de escrever placa
        <div className="form-group">
            <label>C??digo da ordem</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={ordem.id}
            />
        </div>
        : <></>}

           {/**container estado */}
           <div style={{display:"flex", gap:"5rem",marginTop:"45px"}}>
           
           <div>
           <label>Selecione um colaborador:</label>
    <Dropdown isOpen={dropDown} toggle={toggleDrop}>
        <Dropdown.Toggle caret>
         {(currentFuncionario.pessoa)? currentFuncionario.pessoa.nome: "Selecione colaborador"}
        </Dropdown.Toggle>
         <Dropdown.Menu container="body">
            {funcionarios &&
            funcionarios.map((func, index) => (
              <Dropdown.Item
                onClick={func!=currentFuncionario?() => setCurrentFuncionario(func): ()=>faznada}
                key={index}
                name="codFuncionario"
              >
                {func.pessoa.nome}
              </Dropdown.Item>
            ))}
         </Dropdown.Menu>
      </Dropdown>
    </div>
          
    <div>
      <label>C??digo do colaborador</label><br/>
    <input style={{width:"45px", backgroundColor:"transparent", border:"0px"}}
              type="number"
              id="codFuncionario"
              required
              disabled
              value={currentFuncionario.cod_funcionario}
              name="codFuncionario"
            />
    </div>  
    
    </div>
    <br/>
          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              className="form-control"
              id="placa"
              disabled={criada? true:false}
              value={ordem.placa}
              onChange={handleInputChange}
              name="placa"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={busacprop}
            >
              Buscar
            </button>
          </div>
          <div className="form-group">
            <label>Propriet??rio</label>
            <input
              type="text"
              className="form-control"
              id="proprietario"
              disabled
              value={veic.cliente?veic.cliente.pessoa.nome:" "}
              name="proprietario"
            />
          </div>
          <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleShowEdit}
              hidden = {veic.cliente==null}
            >
              Editar ve??culo
            </button>
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              className="form-control"
              id="dataAbertura"
              value={ordem.dataAbertura}
              onChange={handleInputChange}
              name="dataAbertura"
              disabled={!ordem.aberto}
            />
          </div>
          <div className="form-group">
            <label>Valor total em pe??as</label>
            <CurrencyInput 
            id="valorTotalPecas"
            value={ordem.valorTotalPecas} 
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            className="form-control"
            name="valorTotalPecas"
            disabled
            />
          </div>
          <div className="form-group">
            <label>Valor total em m??o de Obra</label>
            <CurrencyInput 
            id="valorTotalMaoObra"
            value={ordem.valorTotalServicos} 
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            className="form-control"
            name="valorTotalMaoObra"
            disabled
            />
          </div>
          {(criada)?  //se o veiculo ja foi criado
         <div className="form-group">
         <label>Ordem fechada</label>
         <Form.Check 
            type="switch"
            id="custom-switch"
            label="Fechar ordem"
            checked={!ordem.aberto}
            onChange={e => handleCheckChange(e)}
            name="aberto"
          />
       </div>
        : <></>}
          {(criada)?  //se o veiculo ja foi criado
         <div className="form-group">
         <label>Ve??culo devolvido</label>
         <Form.Check 
            type="switch"
            id="custom-switch"
            label="Devolver ve??culo"
            checked={ordem.devolvido}
            onChange={e => handleCheckChange(e)}
            name="devolvido"
          />
       </div>
        : <></>}

          <br/>
          <div style={{position:"absolute",right:"10px"}}>
            <Button onClick={criada?updateOrdem:salvaOrdem}>Salvar ordem</Button>
            </div>
        <br/>
        </div>
        <br/><br/>
        {criada?<ServicoList codOrdem={ordem.id} setUpdated={props.setUpdated}/>:<></>}
        
        <ToastContainer className="p-3" position={'bottom-center'} style={{zIndex:1050}}>

      <Toast onClose={() => setSubmitted(false)} show={submitted} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Ordem salva</strong>
            <small>...</small>
          </Toast.Header>
          <Toast.Body>ordem de servi??o salva com sucesso</Toast.Body>
        </Toast>
        </ToastContainer>


    <ToastContainer className="p-3" position={'bottom-end'} style={{zIndex:1050}}>
      <Toast onClose={() => setNfoundPlaca(false)} show={nfoundPlaca} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Ve??culo n??o cadastrado</strong>
            <small>...</small>
          </Toast.Header>
          <Toast.Body>A placa do ve??culo n??o foi encontrada</Toast.Body>
        </Toast>
        </ToastContainer>





        <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>{"Editar ve??culo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <AddVeiculo veiculo ={veic} handleInputChange = {handleChangeVeic} criado={true} submitted={veiculoSubmitted} setSubmitted={setVeiculoSubmitted}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Voltar
          </Button>
          <Button variant="primary" onClick={updateVeiculo}>
            Salvar
          </Button> 
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CadastroDeOrdemCalendario;