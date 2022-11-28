import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Dropdown from 'react-bootstrap/Dropdown';
import ClienteService from "../Services/ClienteService";
const AddVeiculo = (props) => {
    const {id} = useParams() //id do cliente na path variable
    const [dropDown, setDropDown] = useState(false)
    const toggleDrop = () =>{
      setDropDown(!dropDown)
      //console.log(dropDown)
    }
    const [currentCliente, setCurrentCliente] = useState()
    //carrega lista de clientes
    useEffect(() => {
      retrieveClientes(); //lista de clientes disponiveis
      setCurrentCliente(props.veiculo.cliente)
    }, []);

//lista de clientes
const [clientes, setClientes] = useState([])




//pega lista ed clientes
const retrieveClientes = () => {
  ClienteService.getLista()
    .then(response => {
      setClientes(response.data);
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
};
// faz nada
const faznada = () =>{}

const desabilitar = () =>{
    if(!props.criado) //se o veiculo ainda nao foi criado, desabilita preencher os dados, permitindo so placa
        return "true" //desabilita entradas que nao sao placa
    else //se ja houver encontrado
        return "" //permite editar
}

useEffect(() => {
  //chama a funcao handleInputchange do pai
  props.handleInputChange({ //envia como argumento um evento com campo target.name e target.value
   target:{
     name:"cliente",
     value: currentCliente
   }
 })
 }, [currentCliente]); 

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
          <div>
           <label>Selecionar novo dono do veiculo:</label>
    <Dropdown isOpen={dropDown} toggle={toggleDrop}>
        <Dropdown.Toggle caret>
         {(props.veiculo.cliente)? props.veiculo.cliente.pessoa.nome: "Selecione dono"}
        </Dropdown.Toggle>
         <Dropdown.Menu container="body">
            {clientes &&
            clientes.map((cli, index) => (
              <Dropdown.Item
                onClick={cli!=currentCliente?() => setCurrentCliente(cli): ()=>faznada}
                key={index}
                name="codCliente"
              >
                {cli.pessoa.nome}
              </Dropdown.Item>
            ))}
         </Dropdown.Menu>
      </Dropdown>
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