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
        <table className="table">
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
  </div>
);};
export default Charts 