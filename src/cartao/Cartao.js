import {
  Button,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";
import React, { useState, useEffect, useMemo } from "react";
import Modal from 'react-bootstrap/Modal';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import CadastroDeOrdemCalendario from "../components/CadastroDeOrdemCalendario";
import ServicoService from "../Services/ServicoService";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import CurrencyInput from 'react-currency-input';
import '../styles.css'

export const Cartao = (props) => {
useEffect(()=>{},[props])

  const [collapse, setCollapse] = useState(false);
  const toggle = () => setCollapse(!collapse);

  const [item, setItem] = useState(props.item);
  const colorBody = item.aberto? "lightblue" : "green" //orden fechada = verde
  const colorHead = item.devolvido? "blue" : colorBody //veiculo devolvido -> header azul

  const setValores = () =>{
    ServicoService.getValores(item.id)
    .then(response =>{
      setItem({...item, valorTotalPecas: response.data.valorTPecas})
      setItem({...item, valorTotalServicos : response.data.valorTServicos})
      console.log(response)
    })
  }
  const [showOrdem, setShowOrdem] = useState(false);

  const [ordemUpdated, setOrdemUpdated] = useState(false)
  const handleCloseOrdem = () => {//ao fechar a janela de edição de ordem, recarrega as ordens
    setShowOrdem(false); 

    //recarrega ordens se serviços foram adicionados/editados/deletados
    if(ordemUpdated){
      setOrdemUpdated(false)
      window.location.reload();
    } 
  } 
  const handleShowOrdem = () => setShowOrdem(true);
  
 return (
  <div>
    <Card
      className="my-2"
      color="primary"
      inverse
      style={{
        width: "100%",
        textAlign: "left",
        padding: 0,
        margin: 0,
        border: 0
      }}
  >
    {console.log(item, "----", colorBody, "---", colorHead)}
      <CardHeader style={{ fontSize: "1.4vw", backgroundColor: colorHead }}>
        <div style={{display:"flex"}}>
          <div style={{flex:"90%"}}>Placa: {item.placa}</div> 
          <span onClick={handleShowOrdem} style={{flex:"10%"}}>
               <OverlayTrigger
                      key={"new"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"new"}`}>
                            <strong>{"Detalhes da ordem"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon={faFilePen} />
                    </OverlayTrigger>
          </span>
        </div>
      </CardHeader>
      <CardBody style={{ backgroundColor: colorBody}}>
        <Collapse isOpen={collapse}>
          <CardText style={{ fontSize: "1.2vw" }}>
            <table className="tabelaCard" >
            <tr><td>Cliente:</td><td>{item.veiculo.cliente.pessoa.nome}</td></tr>
              <tr><td>Modelo:</td><td>{item.veiculo.marca+" - "+item.veiculo.modelo}</td></tr>
              <tr><td>Valor em peças:</td> <td><CurrencyInput 
            style={{border:"0px", backgroundColor:"rgba(0, 0, 0, 0)", textAlign:"right"}}
            value={item.valorTotalPecas} 
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            disabled
            /></td></tr>   
            <tr><td>Valor em mão de obra:</td> <td ><CurrencyInput 
              style={{border:"0px", backgroundColor:"rgba(0, 0, 0, 0)", textAlign:"right"}}
            value={item.valorTotalServicos} 
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            disabled
            /></td></tr>    
            <tr><td>Total:</td> <td ><CurrencyInput 
            style={{border:"0px", backgroundColor:"rgba(0, 0, 0, 0)", textAlign:"right"}}
            value={item.valorTotalPecas + item.valorTotalServicos} 
            decimalSeparator="," 
            thousandSeparator="."
            prefix="R$"
            disabled
            /></td></tr>     
            </table>
          </CardText>
        </Collapse>

        <div style={{ textAlign: "center" }}>
          <Button
            onClick={toggle}
            style={{
              marginBottom: "0.1vw",
              width: "50%",
              fontSize: "1.2vw",
              backgroundColor: "rgba(223, 236, 243, 0.01)",
              border: 0,
              marginTop: "0.2vw"
            }}
          >
            {collapse ? <BiChevronUp /> : <BiChevronDown />}
          </Button>
        </div>
      </CardBody>
    </Card>

    <Modal show={showOrdem} onHide={handleCloseOrdem}>
        <Modal.Header closeButton>
        <Modal.Title>Cadastrar uma ordem</Modal.Title>    
        </Modal.Header>
        <Modal.Body> <CadastroDeOrdemCalendario ordemAberta={item} changeCrud={props.changeCrud} setUpdated={setOrdemUpdated}/></Modal.Body>
        <Modal.Footer>
         <Button variant="danger" onClick={handleCloseOrdem} style={{position:"absolute", left:"0px", bottom:"1px"}}>
            Voltar
          </Button>
<div></div><br/>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
