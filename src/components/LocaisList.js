import React, { useState, useEffect } from "react";
import LocaisService from "../Services/LocaisService";
import { Link, useNavigate, useParams } from "react-router-dom";
import {Dropdown,DropdownToggle,DropdownItem,DropdownMenu} from "reactstrap";
import PessoasService from "../Services/PessoasService";
import ClienteService from "../Services/ClienteService";
import JuridicaServices from "../Services/JuridicaServices";
import FisicaService from "../Services/FisicaService";
import FuncionarioService from "../Services/FuncionarioService";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const LocaisList = (props) => {
  const {id} = useParams() //pega id do cliente/funcionario na path variable
  const [show, setShow] = useState(false); //toast
  const navigate = useNavigate() 
  const [estados, setEstados] = useState([]); //Lista de estados
  const [currentEstado, setCurrentEstado] = useState(null); //Estado selecionado
  const [currentIndex, setCurrentIndex] = useState(-1); //Indice selecionado
  const [searchNome, setSearchNome] = useState(""); //Nome do estado buscado
  const [dropDownEstado, setDropDownEstado] = useState(false); //DropDown Ativo
  const [mcliente, setMcliente] = useState();
  const [cidades, setCidades] = useState([]);
  const [currentCidade, setCurrentCidade] = useState(null);
  const [currentCIndex, setCurrentCIndex] = useState(-1);
  const [dropDownCidade, setDropDownCidade] = useState(false);

  const [pessoa, setPessoa] = useState(null)

  //Expande/abre dorpdown menu
  const toggleEstado = () =>{
    setDropDownEstado(!dropDownEstado)
  }
  const toggleCidade= () =>{
    setDropDownCidade(!dropDownCidade)
  }
  useEffect(() => {
    retrieveEstados();
  }, []);

  useEffect(() => {
    setPessoa(props.pessoa)
  }, [props]);

  //Busca todos os estados no banco
  const retrieveEstados = () => {
    LocaisService.getAllEstados()
      .then(response => {
        setEstados(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  //Busca cidades pertencentes a um estado
  const retrieveCidades = (cod_estado) => {
    LocaisService.getCidadesByEstado(cod_estado)
      .then(response => {
        setCidades(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

 const [docInvalido, setDocInvalido] = useState()
  //SALVA COM POST E DEPOIS SETA A JSON COM A RESPOSTA VINDA DA API, QUE DEVE CONTER UM ID GERADO
  const saveCliente= () => {
    //pessoa a ser salva
    var data = pessoa

    //faz o Post
    PessoasService.create(data) 
      .then(response => {
        setPessoa({
            cod_pessoa: response.data.cod_pessoa, //salva pessoa no banco e recebe o id gerado
            nome: response.data.nome,
            endereco: response.data.endereco,
            telefone: response.data.telefone,
            cidade:	response.data.cidade
        });
        //depois de salvar pessoa
        if(props.personType=="juridica")
           JuridicaServices.create(props.documento, response.data) //salva juridica se houver cnpj
              .then(responsej => { 
                   console.log(responsej);//imprime 
                 })
                 .catch(e => {
                    console.log(e);
                    if(e.code=='ERR_BAD_RESPONSE')
                      setShow(true)    
                      setDocInvalido("cnpj")
                  });
        if(props.personType=="fisica")
           FisicaService.create(props.documento, response.data) //salva fisica
              .then(responsef => { 
                   console.log(responsef);//imprime 
                 })
                 .catch(e => {
                    console.log(e);
                    if(e.code=='ERR_BAD_RESPONSE')
                      setShow(true)    
                      setDocInvalido("cpf")
                  });          
        //salva como cliente
        if(props.operacao == 1)
          ClienteService.create({pessoa: response.data}) //salva a pessoa gerada como cliente
            .then(response2 => { //apos o servico acima, que retorna a resposta2
                console.log(response2);//imprime cliente salvo
                props.changeVoSubmit(); //muda estado do avo AddCliente para submitted
                navigate(`/clientes/edit/${response2.data.cod_cliente}`)
              })
              .catch(e => {
                console.log(e);
              });
         //funcionario
         if(props.operacao == 0)
          FuncionarioService.create({pessoa: response.data}) //salva a pessoa gerada como cliente
            .then(response2 => { //apos o servico acima, que retorna a resposta2
                console.log(response2);//imprime cliente salvo
                props.changeVoSubmit(); //muda estado do avo AddCliente para submitted
                navigate(`/funcionarios/edit/${response2.data.cod_funcionario}`)
              })
              .catch(e => {
                console.log(e);
              });     
     }) 
      .catch(e => {
        console.log(e);
      });
  };

  //faz o Update da pessoa vinculada ao cliente/funcionario
  const udpateCliente = () =>{
    var data = pessoa

    PessoasService.update(data.cod_pessoa, data)
    .then(response => {
      setPessoa({
        cod_pessoa: response.data.cod_pessoa, //salva pessoa no banco e recebe o id gerado
        nome: response.data.nome,
        endereco: response.data.endereco,
        telefone: response.data.telefone,
        cidade:	response.data.cidade
    });

    if(props.personType=="fisica")
    FisicaService.update(response.data.cod_pessoa,props.documento) //salva fisica
       .then(responsef => { 
            console.log(responsef);//imprime 
          })
          .catch(e => {
             console.log(e); 
             if(e.code=='ERR_BAD_RESPONSE')
                    setShow(true)    
                    setDocInvalido("cpf")
           }); 
     if(props.personType=="juridica")
    JuridicaServices.update(response.data.cod_pessoa, props.documento) //salva juridica
       .then(responsej => { 
            console.log(responsej);//imprime 
          })
          .catch(e => {
             console.log(e);
             if(e.code=='ERR_BAD_RESPONSE')
                      setShow(true)    
                      setDocInvalido("cnpj")
           });     
           
     if(props.personType=="---"){
      JuridicaServices.deleteByPessoa(response.data.cod_pessoa) //salva juridica
      .then(responsedelj => { 
           console.log(responsedelj);//imprime 
         })
         .catch(e => {
            console.log(e);
          });
          FisicaService.deleteByPessoa(response.data.cod_pessoa) //salva juridica
      .then(responsedelf => { 
           console.log(responsedelf);//imprime 
         })
         .catch(e => {
            console.log(e);
          });         
     }
    
//depois de fazer o update
      console.log(response);//imprime pessoa/cliente atualizada
      props.changeVoSubmit();
    })
    .catch(e => {
      console.log(e);
    });
  };

  //Seta Estado ativo e seu indice na lista
  const setActiveEstado = (estado, index) => {
    setCurrentEstado(estado);
    setCurrentIndex(index);
    //carrega todas as cidades do estado selecionado
    retrieveCidades(estado.id);
    setCurrentCidade(null);
    setCurrentCIndex(-1);
  };

  //cidade selecionada e inserida na pessoa vinda de AddPessoa
  const setActiveCidade = (cidade, cindex) => {
    setCurrentCidade(cidade);
    setCurrentCIndex(cindex);
    props.changeCidade(cidade);
  };

  //Busca um estado por nome no banco
  const findByNome = () => {
    LocaisService.getEstadoByNome(searchNome)
      .then(response => {
        setEstados(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const faznada = () => {}
  const volta = () =>{
    if(props.operacao ==1)
      navigate('/clientes');
    if(props.operacao == 0)
      navigate('/funcionarios')  
  }
  return (
  <div className="list row">

    {/**container estado */}
    <div style={{display:"flex", flexWrap:"wrap", padding:"5px"}}>
    <div style={{margin:"5px"}}>
      <Dropdown isOpen={dropDownEstado} toggle={toggleEstado}>
        <DropdownToggle caret color="primary">
         {currentEstado? currentEstado.name: (props.pessoa.cidade? props.pessoa.cidade.state_id.name: "Selecione um Estado")}
        </DropdownToggle>
         <DropdownMenu container="body">
            {estados &&
            estados.map((estado, index) => (
              <DropdownItem
                onClick={estado!=currentEstado?() => setActiveEstado(estado, index): ()=>faznada}
                key={index}
              >
                {estado.name}
              </DropdownItem>
            ))}
         </DropdownMenu>
      </Dropdown>
    </div>

    {/**container cidades */}
    <div style={{margin:"5px"}}>
      <Dropdown isOpen={dropDownCidade} toggle={toggleCidade} disabled={currentEstado? false: true} >
        <DropdownToggle caret color="primary">
        {currentCidade? currentCidade.name: (props.pessoa.cidade? props.pessoa.cidade.name: "Selecione uma Cidade")}
        </DropdownToggle>
         <DropdownMenu container="body">
            {cidades &&
            cidades.map((cidade, cindex) => (
              <DropdownItem
                onClick={ () => setActiveCidade(cidade, cindex)}
                key={cindex}
              >
                {cidade.name}
              </DropdownItem>
            ))}
         </DropdownMenu>
      </Dropdown>
    </div>
    </div>
    <br/>
        
        <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{docInvalido} inválido ou já cadastrado</strong>
          </Toast.Header>
          <Toast.Body>Insira um {docInvalido} válido</Toast.Body>
        </Toast></ToastContainer>
        <div style={{position:"absolute",display:"flex", marginTop:"7rem", right:"1px"}}>
              <div style={{flex:"3%"}}></div>
          <div style={{flex:"85%"}}>          
          <button onClick={volta} className="btn btn-danger">
              Voltar 
            </button>
          </div>
          <div style={{flex:"8%"}}>
          <button onClick={props.pessoa.cod_pessoa?udpateCliente :saveCliente} className="btn btn-success" >
            {props.pessoa.cod_pessoa? "Salvar" : "Salvar"}
          </button>
            </div>
        </div>
  </div>
  );
};

export default LocaisList;