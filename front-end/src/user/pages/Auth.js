import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import "./Auth.css";

const Auth = () => {
  const authOnSubmitHandler = () => {};

  return (
    <form onSubmit={authOnSubmitHandler}>
      <Input
        className="-"
        element="input"
        id={id}
        type="text"
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
      <Input
        className="-"
        element="input"
        id={id}
        type="password"
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
      <Button
        className="-"
        type={props.type}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        SUBMIT
      </Button>
    </form>
  );
};

export default Auth;
