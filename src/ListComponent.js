import React, { useState, useEffect, useMemo, useRef } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "./helpers.js";
import { Cartao } from "./cartao";
import moment from "moment-timezone";
import OrdemService from "./Services/OrdemService";
import Ordens from "./components/Ordens";
import ServicoService from "./Services/ServicoService";
export const ListComponent = (props) => {
  
let mesAtual = moment.tz(props.dataAtual,"America/Sao_Paulo").format("MM");
let anoAtual = moment.tz(props.dataAtual,"America/Sao_Paulo").format("yyy");
let mes = moment.tz(props.dataAtual,"America/Sao_Paulo").format("MMM")
let diasMax = moment.tz(props.dataAtual,"America/Sao_Paulo").daysInMonth()
console.log(diasMax)
//  console.log(mes)
let [currentOrdensList, setCurrentOrdensList] = useState([])

let diaAtual = moment.tz(props.dataAtual,"America/Sao_Paulo").format("d"); //n-ésimo dia da semana : n in (1-7) 
let segundaAtual = moment.tz(props.dataAtual,"America/Sao_Paulo").format("DD") - diaAtual + 1; //segunda feira da semana(nº dia do mes : 1-30)
//dias do calendario de acordo com a segunda-feira

let dias = [segundaAtual, segundaAtual+1, segundaAtual+2, segundaAtual+3, segundaAtual+4]
console.log(dias)

  let [categories, setCategories] = useState([
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[0],
      name: "seg.",
      key: "segunda",
      info: dias[0],
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[1],
      name: "ter.",
      key: "terca",
      info: dias[1],
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[2],
      name: "qua.",
      key: "quarta",
      info: dias[2],
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[3],
      name: "qui.",
      key: "quinta",
      info: dias[3],
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[4],
      name: "sex.",
      key: "sexta",
      info: dias[4],
      items: []
    }
  ]);

  const updateCategories = () =>{
    
  }

 const [crud, setCrud] = useState(false) 
//carrega todas as ordens do corrente mes 
useEffect(() => {
 //console.log(categories)
retrieveOrdens()
}, [props, crud]); 

//funcao executada pelo componente AddOrdemCalendario a fim de atualizar o calendario
const changeCrud = () =>{
  setCrud(!crud)
  //setCrud(!crud)
}

//adiciona ordens à current ordens lista
  const retrieveOrdens = () =>{
    console.log("retrieving ordens")
    OrdemService.findByAnoMes(anoAtual, mesAtual)
    .then(
      response => {
        setCurrentOrdensList(response.data)
       console.log("lista de ordens", response.data)
       return response.data
      }
    )
    .then(lista =>{ //pega a lista de ordens
     // console.log("lista de ordens: ",lista)
      lista.map((ord) =>{ //p cada ordem
        ServicoService.getValores(ord.id) //pega seus valores
        .then(response2 =>{ 
          ord.valorTotalPecas=response2.data.valorTPecas //seta valores
          ord.valorTotalServicos = response2.data.valorTServicos  
        })  
      })
    })
    .catch(e => {
      console.log(e);
    });
  }

  //função mapeia cada ordem da lista buscada na Api à sua categoria
  const mapeiaOrdensCategorias = () =>{ 
    currentOrdensList.forEach(ord =>{ //para cada ordem do mes  
    //executa setcateg
      setCategories(currentCategories => //current = lista pega da api 
          //para cada categoria, atualiza se necessario.
          currentCategories.map((categ,index) => { //para cada categoria(dia semana)
            categ.id = anoAtual+"-"+mesAtual+"-"+(dias[index]>9?dias[index]:("0"+dias[index])) //atualiza id das categorias ajusta dia, ex: 5 para 05
            categ.info = (dias[index]) //recebe dia
            //console.log(categ)
            if (categ.id === ord.dataAbertura) { //se a data da categoria for a mesma da ordem
              categ.items.indexOf(ord)==-1? categ.items.push(ord) : //adiciona ordem à categoria correspondente, se ela ainda nao estiver la
              console.log()
              return categ; //retorna categ com ordem adiconada
            }
            //se nao bater as datas retorna categ old deixando a categoria como esta
            return categ; 
          }),      
      );
    });    
      //console.log("lista de categorias atual:  ", categories)
  }
  //após carregar a lista de ordens, faz o mapeamento, inserindo-as no drop
  useMemo(()=>{
    //antes de mapear a lista às categorias, esvazia os itens nas categorias
    setCategories(currentCategories => 
          currentCategories.map((categ) => { 
            categ.items = []
            return categ; 
          }),      
      );
    mapeiaOrdensCategorias()  
    //console.log("lista atual(ordens do mes):", currentOrdensList) 
  },[currentOrdensList, props])
  
  const [updatableOrdem, setUpdatableOrdem] = useState()

  const updateOrdemAfterDrop = () =>{
    //faz o Put
    OrdemService.update(updatableOrdem.id, updatableOrdem) 
    .then(response => {
      setUpdatableOrdem();
  //console.log(response)
  })
    .catch(e => {
      console.log(e);
    });
  }


useEffect(() => {
 if(updatableOrdem) 
  updateOrdemAfterDrop()
  }, [updatableOrdem? updatableOrdem:0]); 
  //ao soltar um draggable
  const handleDragEnd = (result) => {
    //recebe informacoes (source dropable, destination dropable e dropable type) 
    const { type, source, destination } = result;
    //console.log(type);
    if (!destination) return;

    //recebe id da origem e destino
    const sourceCategoryId = source.droppableId;
    const destinationCategoryId = destination.droppableId;

    //verifica se o tipo do drop é dropable
    if (type === "droppable-for-item") {
      //console.log("dropable");
      // Se o dropable de origem for o mesmo de destino
      if (sourceCategoryId === destinationCategoryId) {
        //função reordena a lista items na origem
        const updatedOrder = reorder(
          categories.find((category) => category.id === sourceCategoryId).items,
          source.index,
          destination.index
        );
        //função atualiza estado das categorias
        const updatedCategories = categories.map((category) =>
          category.id !== sourceCategoryId
            ? category
            : { ...category, items: updatedOrder }
        ); //o atributo itens recebe a lista ordenada
        //seta novo estado da lista de itens
        setCategories(updatedCategories);
        //se for um dropable diferente
      } else {
        // recebe as listas de itens da origem e destino
        const sourceOrder = categories.find(
          (category) => category.id === sourceCategoryId
        ).items;
        const destinationOrder = categories.find(
          (category) => category.id === destinationCategoryId
        ).items;

        //remove item da origem
        const [removed] = sourceOrder.splice(source.index, 1); //pega um item da lista, o item em source.index
        setUpdatableOrdem({...removed, dataAbertura: destinationCategoryId}) //ordem que sera atualziada
        removed.dataAbertura = destinationCategoryId; //atualiza id, a ordem antiga foi completamente removida
        //insere no destino
        destinationOrder.splice(destination.index, 0, removed);//insere na categoria destino com id novo
        //atualiza na lista de ordens
        //setCurrentOrdensList({})
        destinationOrder[removed] = sourceOrder[removed];
        delete sourceOrder[removed];

        //atualiza lista de ordens, e o useMemo chama mapeamento. Como a ordem de id destination ja esta na categoria de destino, o mapeamento nao vai inserir a ordem no destino duplicada
        setCurrentOrdensList(current =>
          current.map(orde => {//outros itens com mesma dataAbertura nao foram removidos do source
            if (orde.dataAbertura === sourceCategoryId && orde.id === removed.id) {
              //atualiza apenas item dropado, que foi removido do dropsource, e sera inserido em dest
              return {...orde, dataAbertura: destinationCategoryId}; //remove da lista curr a ordem antiga, e sobrescreve com id novo
            }
            return orde;
          }),
        );

        //função que atualiza as categorias
        const updatedCategories = categories.map((category) =>
          //para cada categoria, se for origem, recebe a lista sem elemento removido
          category.id === sourceCategoryId
            ? { ...category, items: sourceOrder }
            : //se for destino, recebe a lista de itens com novo elemento
            category.id === destinationCategoryId
            ? { ...category, items: destinationOrder }
            : category
        );
        //executa funcao de update 
        //setCategories(updatedCategories);
      }
    }
  }; 

  return (
    //DragAndDrop executa OnDragEnd função
    <DragAndDrop onDragEnd={handleDragEnd}>
      {/**mapeia cada categoria do estado */}
      {categories.map((category, categoryIndex) => {
        if(category.info>0 && category.info<=diasMax)
        return (
          <div className="category-container">
            <h4 className="titulo" align="center">
              {category.name + "/"+mes}
            </h4>
            {/**Cria um elemento dropable */}
            <Drop key={category.id} id={category.id} type="droppable-for-item">
              {/**Mapeia cada item */}
              {category.items.map((item, index) => {
                return (
                  //Cria elementos draggables 
                  <Drag key={item.id} id={``+item.id} index={index}>
                    <Cartao item={item} key={item.id} changeCrud = {changeCrud}/>
                  </Drag>
                );
              })}
            </Drop>
          </div>   
        );
      })} 
    </DragAndDrop>
  );
};
