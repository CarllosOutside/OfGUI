import React, { useEffect } from "react";
import { useState } from "react";
import { IMaskInput } from "react-imask";

export const AddFisica = (props) =>{
    const initialFisicaState = {
        cpf: "",
        cod_pessoa: null
    }
    useEffect(()=>{

},[props]);

const [fisica, setFisica] = useState(initialFisicaState)
    const changeHandler = event => {
        const { name, value } = event.target;
        setFisica({ ...fisica, [name]: value });
      };

return (

    <div className="submit-form">
          <div className="form-group">
            <IMaskInput
              type="text"
              className="form-control"
              id="cpf"
              placeholder = "cpf"
              value = {props.doc}
              onChange={props.changeHandler}
              name="cpf"
              mask='000.000.000-00'
              disabled={props.initialDoc!=null}
            />
          </div>
    </div>
);
}