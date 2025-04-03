export function validateCPF(cpf: string): boolean {
    
    if (cpf.length !== 11){
        return false
    }

    if (cpf === cpf[0].repeat(cpf.length)){
        return false
    }

    // Calcula o primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++){
        sum += parseInt(cpf[i]) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 >= 10){
        digit1 = 0
    }

    // Calcula o segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++){
        sum += parseInt(cpf[i]) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if(digit2 >= 10){
        digit2 = 0
    }

    if (parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2){
        return true
    }

    return false
}

