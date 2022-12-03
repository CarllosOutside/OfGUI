import { LineChart, Line } from 'recharts';
import React, { Component, PureComponent }  from 'react';
import moment from "moment-timezone";
import 'moment/locale/pt';
import { useState, useEffect, useRef  } from "react";
import ServicoService from "../Services/ServicoService";
import OrdemService from "../Services/OrdemService";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer,Legend } from 'recharts';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Calendar from 'react-calendar';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';


export const Charts=() => {
    const [dataPie, setDataPie] = useState([
        {
            name: "Abertas",
            value: 0
        },
        {
            name: "Fechadas",
            value: 0
        }
    ]);  
    const valorTotalMesPeca = useRef(0);
    const valorTotalMesServico=  useRef(0);
    const valorTotalMesPecaAberta = useRef(0);
    const valorTotalMesServicoAberta =  useRef(0);
    const abertas = useRef(0);    //contabiliza ordens em aberto
    const qtdOrdens= useRef(0);  //contabiliza qtd de ordens

   const dataAtual= useRef(new Date())
    let mesAtual = moment.tz(dataAtual.current,"America/Sao_Paulo").format("MM");
    let anoAtual = moment.tz(dataAtual.current,"America/Sao_Paulo").format("yyy");

    //recarrega todas as ordens do corrente mes ao trocar a data
   useEffect(() => {
    abertas.current = 0;    //contabiliza ordens em aberto
    qtdOrdens.current= 0;
    console.log("current")
    mesAtual = moment.tz(dataAtual.current,"America/Sao_Paulo").format("MM");
    anoAtual = moment.tz(dataAtual.current,"America/Sao_Paulo").format("yyy");
    retrieveOrdens()
}, [ dataAtual.current]); 

    let [currentOrdensList, setCurrentOrdensList] = useState([]) //lista de ordens
    let [currentServList, setCurrentServList] = useState([]) //lista de servicos apenas pra rerender
    //adiciona ordens à current ordens lista
    const retrieveOrdens = () =>{
        console.log("retrieving ordens")
        OrdemService.findByAnoMes(anoAtual, mesAtual) //retorna lista
        .then(
             response => {
                 setCurrentOrdensList(response.data) //salva na variavel lista
                console.log("lista de ordens", response.data)
        return response.data
      }
    )
    .then(lista =>{ //apos pegar a resposta que é uma lista de ordens a lista de ordens
      lista.map((ord) =>{ //p/ cada ordem
        qtdOrdens.current = qtdOrdens.current + 1; //incrementa qtd de ordens
        if(ord.aberto){abertas.current = abertas.current + 1;} //se estiver aberta, incrementa qtd de ordens abertas
        valorTotalMesPeca.current = 0;
        valorTotalMesServico.current=  0;
        valorTotalMesPecaAberta.current = 0;
        valorTotalMesServicoAberta.current =  0;
        //soma valores dos servicos da ordem    
            ServicoService.getValores(ord.id) //pega seus valores de servicos pelo id da ordem
                .then(response2 =>{ 
                ord.valorTotalPecas=response2.data.valorTPecas //seta valores na ordem
                valorTotalMesPeca.current = valorTotalMesPeca.current + response2.data.valorTPecas; //incrementa valores mensais de ordens
                //console.log(valorTotalMesPeca.current)
                if(ord.aberto){valorTotalMesPecaAberta.current = valorTotalMesPecaAberta.current + response2.data.valorTPecas;} //incrementa valores mensais de ordens abertas

                ord.valorTotalServicos = response2.data.valorTServicos  
                valorTotalMesServico.current = valorTotalMesServico.current + response2.data.valorTServicos;
                if(ord.aberto){valorTotalMesServicoAberta.current = valorTotalMesServicoAberta.current + response2.data.valorTServicos;}
                setCurrentServList(response2) //setando aqui apenas para que rerender seja feito e os valores totais mensais sejam atualziados
            })  
      })
    })
    .catch(e => {
      console.log(e);
    });
  }
  //useEffect atualiza dados do grafico de pizza 
  useEffect(()=>{
    //console.log("QTDS: " , qtdOrdens.current, "    abertas: ", abertas.current) 
    setDataPie(
       [ //seta os mesmos objetos
            {
                ...dataPie[0],//copia o objeto "Abertas"
                value:abertas.current, //reseta o valor
            },
            {
                ...dataPie[1], //copia o objeto "Fechadas"
                value: (qtdOrdens.current-abertas.current), //reseta o valor
            }
        ]
    );
  }
    ,[abertas.current,qtdOrdens.current])
    
  //detalhes grafico pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  //Renderiza novamente quando valores da tabela forem atualziados
  useEffect( () =>{
   // console.log("VTOTAL: " , valorTotalMesPeca.current) 
    },[valorTotalMesServico.current, valorTotalMesPecaAberta.current, valorTotalMesPeca.current, valorTotalMesServicoAberta.current])


    //constantes para modal de mês
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //funcao seta data clicada no calendario
    const selectData = (value) =>{
        dataAtual.current=value
    }


    //constantes da dropdown de colabboradores
    //dropdown de funcionarios
    const initialFunc = {codFuncionario: null}
    const [funcionarios, setFuncionarios] = useState([])
    const [currentFuncionario, setCurrentFuncionario] = useState(initialFunc)
    const [dropDown, setDropDown] = useState(false)
    const fvalorTotalMesPeca = useRef(0);
    const fvalorTotalMesServico=  useRef(0);
    const fvalorTotalMesPecaAberta = useRef(0);
    const fvalorTotalMesServicoAberta =  useRef(0);
    const fabertas = useRef(0);    //contabiliza ordens em aberto
    const fqtdOrdens= useRef(0);  //contabiliza qtd de ordens
    let [fcurrentOrdensList, setFcurrentOrdensList] = useState([]) //lista de ordens de um funcionario
    //abre/fecha dropdown
    const toggleDrop = () =>{
        setDropDown(!dropDown)
    }
    //caso o mesmo funcionario seja slecionado
    const faznada = () =>{}
    //Atualiza lista de colaboradores mensais 
    useEffect(()=>{
        //funcionarios das ordens menais sao adicinados á lista funcionarios para imprimir no dorpdwon
        currentOrdensList.forEach(ord=> //para cada ordem da lista mensal
            {
                console.log("Ordem na lista: ",ord)
                //verifica se algum funcionario retorna verdadeiro quando tem seu codigo comparado com o funcinario da ordem        se sim, nao faz nada      senao, adiciona o func da ordem na lista
                funcionarios.some(funcionario => funcionario.cod_funcionario == ord.funcionario.cod_funcionario)? faznada(): funcionarios.push(ord.funcionario)
            })      
      }
        ,[currentOrdensList])
    //Pega lista de ordens do funcionario ao selecionar funcionario
    useEffect(()=>{
        fabertas.current = 0;    //zera a qtd ordens do funcionario abertas
        fqtdOrdens.current= 0;
        fvalorTotalMesPeca.current = 0;
        fvalorTotalMesServico.current=  0;
        fvalorTotalMesPecaAberta.current = 0;
        fvalorTotalMesServicoAberta.current =  0;
        retrieveOrdensFunc()
        }
        ,[currentFuncionario,currentOrdensList]) 
    //Pega lista de ordens mensais do funcionario selecionado e computa valores
    const retrieveOrdensFunc = () =>{
        currentOrdensList.forEach(ord=> //para cada ordem da lista mensal
            {
                //se o func selecionado tem o mesmo codFuncionario da ordem
                if(currentFuncionario.cod_funcionario == ord.codFuncionario){
                    fqtdOrdens.current = fqtdOrdens.current + 1; //incrementa qtd de ordens
                    if(ord.aberto){//se estiver aberta, incrementa qtd de ordens abertas e valores de ordens abertas
                        fabertas.current = fabertas.current + 1;
                        fvalorTotalMesPecaAberta.current = fvalorTotalMesPecaAberta.current + ord.valorTotalPecas;
                        fvalorTotalMesServicoAberta.current =  fvalorTotalMesServicoAberta.current + ord.valorTotalServicos;
                        } 
                    //incrementa valores totais
                    fvalorTotalMesPeca.current = fvalorTotalMesPeca.current + ord.valorTotalPecas;
                    fvalorTotalMesServico.current=  fvalorTotalMesServico.current+ord.valorTotalServicos;
                }
            })  
            setFcurrentOrdensList([]) //apenas um set, depois de ter executado todos os calculos
    }
    //Render
    return (
        <div>
            <div style={{width:"100%", textAlign:"center", marginTop:"10px"}}>
                {/**texto que imprime data atual com tooltip e abre modal de calendario*/}
                <OverlayTrigger
                      key={"new"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"new"}`}>
                            <strong>{"Selecione uma data"}</strong>.
                          </Tooltip>
                        }>  
                      <button onClick={handleShow} style={{marginTop:"2rem", //mostra o modal de calendario
                         backgroundColor:"white", border:"0px"}} className="botaoCalendario">
                            <h3 style={{flex:"90%"}}>{moment.tz(dataAtual.current,"America/Sao_Paulo").format("DD - MMMM - YYYY")}</h3> 
                      </button>
                    </OverlayTrigger>
            </div>
        <div style={{width:"100%", height:"300px", textAlign:"center", paddingTop:"50px"}}> 
        <p>Ordens Abertas/Fechadas</p>  
        <ResponsiveContainer width="100%" height="100%">
        <PieChart width="100%" height="100%">
          <Pie
            data={dataPie}
            cx="50%"
            cy="40%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataPie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
        </ResponsiveContainer>
        </div> 
        <div style={{marginTop:"90px"}}>  
        <table className="table" style={{textAlign:"center"}}>
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Quantidade</th>
                <th scope="col">$ Peças</th>
                <th scope="col">$ Mão de obra</th>
                <th scope="col">$ Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Abertas</td>
                <td>{abertas.current}</td>
                <td>{valorTotalMesPecaAberta.current}</td>
                <td>{valorTotalMesServicoAberta.current}</td>
                <td>{valorTotalMesPecaAberta.current+valorTotalMesServicoAberta.current}</td>
                </tr>
                <tr>
                <td>Fechadas</td> 
                <td>{qtdOrdens.current-abertas.current}</td>
                <td>{valorTotalMesPeca.current-valorTotalMesPecaAberta.current}</td>
                <td>{valorTotalMesServico.current-valorTotalMesServicoAberta.current}</td>
                <td>{valorTotalMesPeca.current+valorTotalMesServico.current -valorTotalMesPecaAberta.current-valorTotalMesServicoAberta.current}</td>
                </tr>
                <tr>
                <td>Total</td>
                <td>{qtdOrdens.current}</td>
                <td>{valorTotalMesPeca.current}</td>
                <td>{valorTotalMesServico.current}</td>
                <td>{valorTotalMesPeca.current+valorTotalMesServico.current}</td>
                </tr>
            </tbody>
        </table>
        </div>  

        
        {/**modal para selecao de mês */}
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Selecione uma data</Modal.Title>    
        </Modal.Header>
        <Modal.Body> <Calendar 
        name="data"
        onClickDay={selectData} //modifica dataAtual
            defaultView='month'
            tileDisabled={({ view, date }) => ((date.getDay() == 0|| date.getDay() == 6) //desativa sabados e domingos
             && view=='month')}/></Modal.Body>
      </Modal>

      <div style={{marginTop:"90px", marginLeft:"80px"}}>
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
    {currentFuncionario.cod_funcionario!=null? <div>
        <table className="table" style={{textAlign:"center"}}>
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Quantidade</th>
                <th scope="col">$ Peças</th>
                <th scope="col">$ Mão de obra</th>
                <th scope="col">$ Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Abertas</td>
                <td>{fabertas.current}</td>
                <td>{fvalorTotalMesPecaAberta.current}</td>
                <td>{fvalorTotalMesServicoAberta.current}</td>
                <td>{fvalorTotalMesPecaAberta.current+fvalorTotalMesServicoAberta.current}</td>
                </tr>
                <tr>
                <td>Fechadas</td> 
                <td>{fqtdOrdens.current-fabertas.current}</td>
                <td>{fvalorTotalMesPeca.current-fvalorTotalMesPecaAberta.current}</td>
                <td>{fvalorTotalMesServico.current-fvalorTotalMesServicoAberta.current}</td>
                <td>{fvalorTotalMesPeca.current+fvalorTotalMesServico.current -fvalorTotalMesPecaAberta.current-fvalorTotalMesServicoAberta.current}</td>
                </tr>
                <tr>
                <td>Total</td>
                <td>{fqtdOrdens.current}</td>
                <td>{fvalorTotalMesPeca.current}</td>
                <td>{fvalorTotalMesServico.current}</td>
                <td>{fvalorTotalMesPeca.current+fvalorTotalMesServico.current}</td>
                </tr>
            </tbody>
        </table>
    </div>: ""}
  </div>
);};
export default Charts 