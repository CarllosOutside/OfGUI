import React from "react";
import { useState } from "react";
import { IMaskInput } from "react-imask";

export const AddJuridica = (props) =>{
    const initialJuridicaState = {
        cnpj: "",
        cod_pessoa: null
    }
const [juridica, setJuridica] = useState(initialJuridicaState)
    const changeHandler = event => {
        const { name, value } = event.target;
        setJuridica({ ...juridica, [name]: value });
      };

return (

    <div className="submit-form">
          <div className="form-group">
            <IMaskInput
              type="text"
              className="form-control"
              id="cnpj"
              placeholder = "cnpj"
              value = {props.doc}
              onChange={props.changeHandler}
              name="cnpj"
              mask='00.000.000-0000-00'
              disabled={props.initialDoc!=null}
            />
          </div>
    </div>
);
}