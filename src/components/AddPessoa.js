import React, { useState, useEffect } from "react";
import PessoasService from "../Services/PessoasService";
import LocaisList from "./LocaisList";
import VeiculosList from "./VeiculosList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { faCar } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { AddJuridica } from "./AddJuridica";
import FisicaService from "../Services/FisicaService";
import JuridicaServices from "../Services/JuridicaServices";
import { AddFisica } from "./AddFisica";
import { IMaskInput } from "react-imask";

const Addpessoa = (props) => {
  const [lgShow, setLgShow] = useState(false);
//JSON CLIENTE
  const initialPessoaState =
    {
        cod_pessoa: null,
        nome: "",
        endereco: "",
        telefone: "",
        cidade:	null
        }
  //Se o pai tiver recebido um cliente na pathvariable, carrega a pessoa desse cliente      
  const [pessoa, setPessoa] = useState(initialPessoaState);
  const [tipo, setTipo] = useState("---")
  const [documento, setDocumento] = useState()
  useEffect(() => {  
    if(props.cliente) {
    if(props.cliente.cod_cliente)
        setPessoa(props.cliente.pessoa); 
    if(props.cliente.pessoa)
          getTipoAndDocumento()
        }}, [props.cliente? props.cliente.cod_cliente: 0]);

  useEffect(() => {  
    if(props.funcionario) {
    if(props.funcionario.cod_funcionario)
        setPessoa(props.funcionario.pessoa); 
    if(props.funcionario.pessoa)
          getTipoAndDocumento()
}}, [props.funcionario? props.funcionario.cod_funcionario: 0]);
  
  //Dado o codigo da pessoa, identifica se e fisica/juridica e extrai sue documento
  const getTipoAndDocumento = () =>{
      FisicaService.findByPessoa(props.cliente? props.cliente.pessoa.cod_pessoa: props.funcionario.pessoa.cod_pessoa)
        .then(response => {
          const {cpf} = response.data;
          setDocumento(cpf)
          setTipo("fisica")
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });

        JuridicaServices.findByPessoa(props.cliente? props.cliente.pessoa.cod_pessoa: props.funcionario.pessoa.cod_pessoa)
        .then(response => {
          const {cnpj} = response.data;
          setDocumento(cnpj)
          setTipo("juridica")
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    
  }

  const changeCidade = (cd) =>{
    setPessoa({...pessoa, cidade:cd})
} 
  //ATRIBUI VALORES À JSON EM TEMPO REAL
  const handleInputChange = event => {
    const { name, value } = event.target;
    setPessoa({ ...pessoa, [name]: value });
  };


  //RESETA JSON
  const newPessoa = () => {
    setPessoa(initialPessoaState);
  };

  //Muda o estado do pai AddCliente para submitted
  const changeParentSubmit = ()=>{
    props.changePaiSubmit();
  }

  const handleTipoChange = event => {
    const value = event.target.name;
    setTipo(value);
    //console.log(tipo)
  };


const changeDocumento = (event)=>{
  setDocumento(event.target.value)
  //console.log(cnpj)
}
  return (
    <div className="submit-form">
      <div>
        {props.cliente?
        <h4>Cadastro de Clientes</h4>
        :<h4>Cadastro de funcionários</h4>
      }
      <hr/>
        {pessoa.cod_pessoa? 
        <div className="form-group">
            <label>{props.cliente? "Código do cliente" : "Código do funcionário"}</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={props.cliente? props.cliente.cod_cliente: props.funcionario.cod_funcionario}
            />
        </div>
        : <></>}
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              required
              value={pessoa.nome}
              onChange={handleInputChange}
              name="nome"
            />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input
              type="text"
              className="form-control"
              id="endereco"
              value={pessoa.endereco}
              onChange={handleInputChange}
              name="endereco"
            />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <IMaskInput
              type="text"
              className="form-control"
              id="telefone"
              value={pessoa.telefone}
              onChange={handleInputChange}
              name="telefone"
              mask='(00)00000-0000'
            />
          </div>
          <div className="form-group">
            <label>Tipo de pessoa: </label><br/>
            <Form>
            <div key={`inline-${"radio"}`} className="mb-3">
            <Form.Check
            inline
            label="Fisica"
            name="fisica"
            type="radio"
            id="inline-radio-1"
            checked ={tipo=="fisica"? true:false}
            onChange={handleTipoChange}
          />
          <Form.Check
            inline
            label="Juridica"
            name="juridica"
            type="radio"
            id="inline-radio-2"
            checked ={tipo=="juridica"? true:false}
            onChange={handleTipoChange}
          />
          <Form.Check
            inline
            label="---"
            name="---"
            type="radio"
            id="inline-radio-3"
            checked ={tipo=="---"? true:false}
            onChange={handleTipoChange}
          />
          </div></Form>
          {tipo!="---"?
          <div>
            {tipo =="juridica"?
              <AddJuridica changeHandler={changeDocumento} doc={documento}/>:
              <AddFisica changeHandler={changeDocumento} doc={documento}/>
          }
          </div>
          :<></>}
          </div>
            
          <br/> 
        <div style={{display:"flex", gap:"30%"}} className="form-group">
        <div>
            <LocaisList personType = {tipo} documento ={documento} pessoa ={pessoa} changeCidade = {changeCidade}  changeVoSubmit={changeParentSubmit}  operacao={props.cliente? 1:0}/>
        </div>
        {(props.cliente && props.cliente.cod_cliente != null)?
        <div>
          Veículos do cliente: 
          <span onClick={() => setLgShow(true)} style={{margin: "1rem"}}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"vel"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"Adicionar veículos"}</strong>.
                          </Tooltip>
                        }> 
                      <FontAwesomeIcon icon={faCar}/>
                    </OverlayTrigger>
              
              </span>
            
            <Modal
            scrollable={true}
        show={lgShow}
        onHide={() => setLgShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Cadastro de veículos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body><VeiculosList codCliente = {props.cliente.cod_cliente}/></Modal.Body>
      </Modal>
          </div> : <></>
        }        
        </div>
        </div>
    </div>
  );
};

export default Addpessoa;