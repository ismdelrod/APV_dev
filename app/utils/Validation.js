//RegisterForm

export const validateEmail = (email) => {
  const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExpEmail.test(String(email).toLocaleLowerCase());
};

export const validatePassword = (password) => {
  //Minimo 6 caracteres, máximo 15, al menos una letra mayúscula, al menos una letra minúscula, al menos un dígito, no espacios en blanco, al menos 1 caracter especial
  const regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/;
  return regExpPassword.test(String(password).toLocaleLowerCase());
};

export const validatePasswordConfirmationIsOK = (
  password,
  passwordConfirmation
) => {
  if (password === passwordConfirmation) {
    return true;
  }
  return false;
};

export const validatePhoneNumber = (phone) => {
  // Formatos España
  const regExpPhone = /^[9|6]{1}([\d]{2}[-]*){3}[\d]{2}$/;
  return regExpPhone.test(String(phone).toLocaleLowerCase());
};

export const validateWebSite = (webSite) => {
  const regExpWebSite = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  return regExpWebSite.test(String(webSite).toLocaleLowerCase());
};
