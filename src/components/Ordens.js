import { ListComponent } from "../ListComponent";
import React from "react";
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import 'moment/locale/pt';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CadastroDeOrdemCalendario from "./CadastroDeOrdemCalendario";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Ordens = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showOrdem, setShowOrdem] = useState(false);
    const handleCloseOrdem = () => setShowOrdem(false);
    const handleShowOrdem = () => setShowOrdem(true);
    
    const mesesNomes = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const [data, setData] = useState(new Date())

    useEffect(()=>{},[data])

    const selectData = (value) =>{
        setData(value)
    }

      return(
        <div style={{textAlign:"center"}}>
            <div style={{display:"flex", justifyContent:"center", gap:"35px"}}>
            <OverlayTrigger
                      key={"new"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"new"}`}>
                            <strong>{"Selecione uma data"}</strong>.
                          </Tooltip>
                        }>  
                      <button onClick={handleShow} style={{marginTop:"2rem",
                         backgroundColor:"white", border:"0px"}} className="botaoCalendario">
                            <h3 style={{flex:"90%"}}>{moment.tz(data,"America/Sao_Paulo").format("DD - MMMM - YYYY")}</h3>
                      </button>
                    </OverlayTrigger>
            
            <span onClick={handleShowOrdem}>
            <OverlayTrigger
                      key={"new"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"new"}`}>
                            <strong>{"Nova ordem de serviço"}</strong>.
                          </Tooltip>
                        }>  
                      <div style={{marginTop:"2.5em"}}><FontAwesomeIcon icon={faCalendarPlus} /></div>
                    </OverlayTrigger>
                </span>
            </div>
            <hr/>
    <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Selecione uma data</Modal.Title>    
        </Modal.Header>
        <Modal.Body> <Calendar 
        name="data"
        onClickDay={selectData}
            defaultView='month'
            tileDisabled={({ view, date }) => ((date.getDay() == 0|| date.getDay() == 6) //desativa sabados e domingos
             && view=='month')}/></Modal.Body>
      </Modal>

      <Modal show={showOrdem} onHide={handleCloseOrdem}>
        <Modal.Header closeButton>
        <Modal.Title>Cadastrar uma ordem</Modal.Title>    
        </Modal.Header>
        <Modal.Body> <CadastroDeOrdemCalendario/></Modal.Body>
        <Modal.Footer>
         <Button variant="danger" onClick={handleCloseOrdem} style={{position:"absolute", left:"0px", bottom:"1px"}}>
            Voltar
          </Button>
<div></div><br/>
        </Modal.Footer>
      </Modal>
           
            </div>
            <br/>
        <div style = {{display: "flex", marginTop: 8}}>
            <ListComponent dataAtual={data}/>
        </div>
        </div>
    );
};

export default Ordens;