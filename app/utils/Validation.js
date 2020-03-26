//RegisterForm

export const validateEmail = email => {
  const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExpEmail.test(String(email).toLocaleLowerCase());
};

export const validatePassword = password => {
  //Minimo 6 caracteres, máximo 15, al menos una letra mayúscula, al menos una letra minúscula, al menos un dígito, no espacios en blanco, al menos 1 caracter especial
  const regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/;
  return regExpPassword.test(String(password).toLocaleLowerCase());
};

export const validatePasswordConfirmationIsOK = (password, passwordConfirmation) => {
    if(password === passwordConfirmation){return true}
    return false;
  };
