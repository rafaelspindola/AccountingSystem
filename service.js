function testaCPF(strCPF) {
   let Soma;
   let Resto;
   Soma = 0;

   const digitosRepetidos = [
      '00000000000', 
      '11111111111', 
      '22222222222', 
      '33333333333', 
      '44444444444', 
      '55555555555', 
      '66666666666', 
      '77777777777', 
      '88888888888', 
      '99999999999'];
   if (digitosRepetidos.includes(strCPF))
     return false;

   for (i = 1; i <= 9; i++)
     Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
   Resto = (Soma * 10) % 11;

   if ((Resto == 10) || (Resto == 11))
     Resto = 0;

   if (Resto != parseInt(strCPF.substring(9, 10)))
     return false;

   Soma = 0;
   for (i = 1; i <= 10; i++)
     Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
   Resto = (Soma * 10) % 11;

   if ((Resto == 10) || (Resto == 11))
     Resto = 0;

   if (Resto != parseInt(strCPF.substring(10, 11)))
     return false;

   return true;
 }

const somaLancamentos = (lancamentos) => {
  const saldos = lancamentos.reduce((acumulador, valorAtual) => {
    if (!acumulador.hasOwnProperty(valorAtual?.cpf)) {
      acumulador[valorAtual?.cpf] = parseFloat(valorAtual.valor);
      return acumulador;
    }

    acumulador[valorAtual?.cpf] += parseFloat(valorAtual.valor);
    return acumulador;
  }, {});

  const listaSaldos = Object.entries(saldos).map(([cpf, valor]) => {
    return { cpf, valor };
  });

  return listaSaldos;
};

const validarEntradaDeDados = (lancamento) => {

if (!lancamento.cpf) {
  return "Por favor, preencha o campo relativo ao CPF."
}

const cpfRegex = /^\d{11}$/;
if (!cpfRegex.test(lancamento.cpf)) {
  return "Número de CPF inválido. Deve conter somente 11 caracteres numéricos.";
}

if (!testaCPF(lancamento.cpf)) {
  return "Esse número de CPF é inválido.";
}

const valueRegex = /^-?\d+(\.\d{1,2})?$/;
  if (!valueRegex.test(lancamento.valor)) {
    return "O valor deve ser numérico.";
  }

if (lancamento.valor > 15000.00 || lancamento.valor < -2000.00) {
  return "O valor não pode ser maior que R$ 15.000 ou menor que R$ -2.000.";
}

return null;
}

const recuperarSaldosPorConta = (lancamentos) => {
  const listaSaldos = somaLancamentos(lancamentos);
  return listaSaldos || [];
};

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
  const lancamentosRelevantes = lancamentos.filter(
    (lancamento) => lancamento.cpf === cpf
  );

  lancamentosRelevantes.sort((a, b) => a.valor - b.valor);

  const lancamentoMenorMaior = [
    lancamentosRelevantes[0],
    lancamentosRelevantes[lancamentosRelevantes.length - 1],
  ];

  return lancamentoMenorMaior || [];
};

const recuperarMaioresSaldos = (lancamentos) => {
  const listaSaldos = somaLancamentos(lancamentos);
  listaSaldos.sort((a, b) => b.valor - a.valor);
  return listaSaldos.slice(0, 3) || [];
  };


const recuperarMaioresMedias = (lancamentos) => {
  const medias = lancamentos.reduce((acumulador, valorAtual) => {
    if (!acumulador.hasOwnProperty(valorAtual?.cpf)) {
      acumulador[valorAtual?.cpf] = {
        saldos: parseFloat(valorAtual.valor),
        quantidadeTransacoes: 1,
        media: parseFloat(valorAtual.valor),
      };

      return acumulador;
    }

    const saldos = acumulador[valorAtual?.cpf].saldos + parseFloat(valorAtual.valor);
    const quantidadeTransacoes =
      acumulador[valorAtual?.cpf].quantidadeTransacoes + 1;

    acumulador[valorAtual?.cpf] = {
      saldos,
      quantidadeTransacoes,
      media: saldos / quantidadeTransacoes,
    };

    return acumulador;
  }, {});

  const listaMedias = Object.entries(medias).map(([cpf, values]) => ({
    cpf,
    valor: values.media,
  }));

  listaMedias.sort((a, b) => b.valor - a.valor);

  const tresMaioresMedias = listaMedias.slice(0, 3);

  return tresMaioresMedias || [];
};