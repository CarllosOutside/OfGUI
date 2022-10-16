import { ListComponent } from "./ListComponent";
import "./styles.css";
import React, { useState, useEffect } from "react";
import { Cartao } from "./cartao";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCliente from "./components/AddCliente";
import Cliente from "./components/Cliente";
import ClienteList from "./components/ClienteList";
import LocaisList from "./components/LocaisList";
import Ordens from "./components/Ordens";
import VeiculosList from "./components/VeiculosList";
import AddVeiculo from "./components/AddVeiculo";
import AddFuncionario from "./components/AddFuncionario";
import FuncionariosList from "./components/FuncionariosList";

export default function App() {
  return (
    /*<div className="containerTest">
      <ListComponent />
    </div>*/
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark" style={{"--bs-navbar-padding-x": "0.5rem", width:"100%"}}>
        <a href="/calendario" className="navbar-brand">
          GeSMA
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/calendario"} className="nav-link">
              Ordens de Serviço
            </Link>
          </li>
        </div>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/clientes"} className="nav-link">
              Clientes
            </Link>
          </li>
        </div>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/funcionarios"} className="nav-link">
              Funcionarios
            </Link>
          </li>
        </div>
      </nav>

      <div style={{paddingRight: 0, marginLeft:0}}>
        <Routes>
          <Route path="/" element={<div>
      <Ordens />
    </div>} />
          <Route path="/calendario" element={<div>
      <Ordens />
    </div>} />
          <Route path="/clientes" element={<ClienteList/>} />
          <Route path="/funcionarios" element={<FuncionariosList/>} />
          <Route path="/add" element={<AddCliente/>} />
          <Route path="/clientes/edit/:id" element={<AddCliente/>} />
          <Route path="/funcionario/add" element={<AddFuncionario/>} />
          <Route path="/funcionarios/edit/:id" element={<AddFuncionario/>} />
          <Route path="/locais" element={<LocaisList/>} />  
          <Route path="/clientes/edit/:id/addveiculo/:placa" element={<AddVeiculo/>} />
        </Routes>
      </div>
    </div>
  );
}
