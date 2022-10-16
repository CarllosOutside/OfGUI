import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
const AddVeiculo = (props) => {
    const {id} = useParams() //id do cliente na path variable

useEffect(()=>{
}, [props])
const desabilitar = () =>{
    if(!props.criado) //se o veiculo ainda nao foi criado, desabilita preencher os dados, permitindo so placa
        return "true" //desabilita entradas que nao sao placa
    else //se ja houver encontrado
        return "" //permite editar
}
  return (
    <div className="submit-form">
      <div>
        {(props.criado)?  //se o veiculo ja foi criado, desabilita a funcao de escrever placa
        <div className="form-group">
            <label>Placa do veículo</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={props.veiculo.placa}
            />
        </div>
        : <div className="form-group">
        <label>Placa do veículo</label>
        <input
        type="text"
        id="placa"
        name="placa"
        onChange={props.handleInputChange}
        className="form-control"
          value={props.veiculo.placa}
        />
        </div>}

          <div className="form-group">
            <label>Marca</label>
            <input
              type="text"
              disabled={desabilitar()}
              className="form-control"
              id="marca"
              required
              value={props.veiculo.marca}
              onChange={props.handleInputChange}
              name="marca"
            />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input
              type="text"
              className="form-control"
              disabled={desabilitar()}
              id="modelo"
              value={props.veiculo.modelo}
              onChange={props.handleInputChange}
              name="modelo"
            />
          </div>
          <div className="form-group">
            <label>Ano</label>
            <input
              type="number"
              className="form-control"
              disabled={desabilitar()}
              id="ano"
              value={props.veiculo.ano}
              onChange={props.handleInputChange}
              name="ano"
            />
          </div>
          <div className="form-group">
            <label>Cor</label>
            <input
              type="text"
              className="form-control"
              disabled={desabilitar()}
              id="cor"
              value={props.veiculo.cor}
              onChange={props.handleInputChange}
              name="cor"
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
            <strong className="me-auto">Veículo salvo</strong>
            <small>...</small>
          </Toast.Header>
          <Toast.Body>salvo com sucesso</Toast.Body>
        </Toast>
        </ToastContainer>
    </div>
  );
};

export default AddVeiculo;