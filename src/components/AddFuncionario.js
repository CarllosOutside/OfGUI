import React, { useState, useEffect } from "react";
import Addpessoa  from "./AddPessoa";
import {Navigate, useParams, Link, useNavigate} from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import FuncionarioService from "../Services/FuncionarioService";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const AddFuncionario = () => {
  const navigate = useNavigate()
    //JSON CLIENTE
  const initialFuncionarioState = {
    cod_funcionario: null,
    pessoa: null
    }
//func começa sendo nulo
  const [funcionario, setFuncionario] = useState(initialFuncionarioState);

//path variable
const { id }= useParams();
 //se houver path variable
  useEffect(() => {
    if (id)
      getFuncionario(id);
  }, [id]);
//Le func passada como pathVariable
const getFuncionario = id => {
    FuncionarioService.get(id)
      .then(response => {
        setFuncionario(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  //a form comeca falsa, nao enviada
  const [submitted, setSubmitted] = useState(false);

  //quando um func for salvo, o filho muda a variavel submitted e renderiza a mensagem de salvo
  const changeSubmitted = () =>{
    setSubmitted(true) 
    setProgressCounter(100)
  };

  //Conta 4s sempre que mudar a variavle submitted e em seguida retorna para seu valor original 
  useEffect(() => {
    const timeId = setTimeout(
      () => setSubmitted(false), //"de"renderiza a mensagem
      5000
    );
    return () => {
      clearTimeout(timeId)
      //navigate(`/clientes/edit/${cliente.cod_cliente}`, {replace:true})
    }
  }, [submitted]);

  //Barra de progresso de 5s(de 20 em 20 fica ruim... e 5s e mto tempo)
  const [progressCounter, setProgressCounter] = useState(0); //barra vai de 0 a 100
  React.useEffect(() => { //executa se o valor da barra for maior que 0
    const timer = progressCounter > 0 && setTimeout( //executa a timeOut do react
      () => setProgressCounter(progressCounter - 1), 40 //a cada segundo, decrementa 20 unidades da barra(em 5s progress=0)
      ); //para 4s é preciso 25 decrementos p s, ou seja, executar 25 vezes em 1s
      return () => clearInterval(timer);
  }, [progressCounter]); //executa quando mudar o valor da barra


  return (
    <div className="submit-form" style={{paddingLeft:"50px", paddingTop:"30px",width:"95%"}}>
        <div>
            <Addpessoa funcionario = {funcionario} changePaiSubmit ={changeSubmitted}/>
        </div>
        <ToastContainer className="p-3" position={"bottom-center"}>
          <Toast show={submitted}>
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Funcionário salvo</strong>
            </Toast.Header>
            <Toast.Body><ProgressBar animated now={progressCounter} /></Toast.Body>
          </Toast>
        </ToastContainer>
    </div>
  );
};

export default AddFuncionario;