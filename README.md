# PASS.IN

O PASS.IN é uma aplicação de **gestão de participantes em eventos presenciais**. 

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos funcionais

O organizador poderá:
- [X] Cadastrar um novo evento;
- [X] Visualizar dados de um evento;
- [X] Visualizar a lista de participantes; 

O participante poderá:
- [X] Se inscrever em um evento;
- [X] Visualizar seu crachá de inscrição;
- [X] Realizar check-in no evento;

### Regras de negócio

- [X] O participante só pode se inscrever em um evento uma única vez;
- [X] O participante só pode se inscrever em eventos com vagas disponíveis;
- [X] O participante só pode realizar check-in em um evento uma única vez;
- [X] O participante não pode se registrar para um evento que já iniciou;
- [X] O organizador não pode criar um evento com data de início antes da data atual

### Requisitos não-funcionais

- [X] O check-in no evento será realizado através de um QRCode;

### Aprimoramentos

- [X] Criar a rota getAllEvents para buscar todos os eventos criados, podendo buscar um evento específico pelo slug
- [X] Adicionar CPF no cadastro do participante
- [X] Criar rota para Deletar Evento
- [X] Criar rota para Deletar Participante
- [X] Na tabela de Eventos, adicionar as colunas startDate e startTime
- [ ] Criar rota para Update de Evento
- [ ] Criar rota para Update de Participante
