import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import CurrencyInput from 'react-currency-input';

const AddServico = (props) => {

useEffect(()=>{
}, [props]) //atualiza pela props. quando o servico for criado, carrega o codigo do servico no render

const faznada = () =>{}

//ao mudar o valor de um campo currency
const mudouvalor = (event, maskedvalue, floatvalue)=>{
 //console.log(maskedvalue, "----", floatvalue)
 //console.log(event.target.name)
props.handleInputChange({
  target:{
    name: event.target.name,
    value:floatvalue
  }
 })
 //console.log(props.servico)
}

  return (
    <div className="submit-form">
      <div>
      <div>
            <label>Código da ordem: {props.codOrdem}</label>{/*props.servico.codOrdem foi setado no servicoInitialState mas demora para carregar*/}
          </div>
          <br/>
        {(props.criado)?  //se o veiculo ja foi criado, desabilita a funcao de escrever placa
        <div className="form-group">
            <label>Código do serviço</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={props.servico.id}
            />
        </div>
        : <></>
        }
        
          <div className="form-group">
            <label>valorPecas</label>
            <CurrencyInput 
            value={props.servico.valorPecas}
            onChangeEvent={mudouvalor}
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            className="form-control"
            name="valorPecas"
            />
          </div>
          
            <div className="form-group">
            <label>valorServico</label>
            <CurrencyInput 
            value={props.servico.valorServico} 
            onChangeEvent={mudouvalor}
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            className="form-control"
            name="valorServico"
            />
          </div>
          <div className="form-group">
            <label>descricao</label>
            <textarea
              type="text"
              className="form-control"
              id="descricao"
              value={props.servico.descricao}
              onChange={props.handleInputChange}
              name="descricao"
            />
          </div>
          <br/>
        <br/>
        </div>
        <ToastContainer className="p-3" position={'bottom-center'} style={{zIndex:1050}}>
        {console.log()}
      <Toast onClose={() => props.setSubmitted(false)} show={props.submitted} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Servico salvo</strong>
            <small>...</small>
          </Toast.Header>
          <Toast.Body>salvo com sucesso</Toast.Body>
        </Toast>
        </ToastContainer>
    </div>
  );
};

export default AddServico;