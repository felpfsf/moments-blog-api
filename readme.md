# moments blog

[English version](readme-en.md)

Com o objetivo de criar uma API REST utilizando Node.js, optei por utilizar o framework **Fastify** como base para o projeto. Para garantir a validação dos dados de entrada das requisições HTTP, utilizei a biblioteca **Zod** como mecanismo de validação de esquemas.

Para gerenciar a autenticação dos usuários, escolhi utilizar o **JWT (JSON Web Token)** como mecanismo de autenticação. Isso permitiu que eu implementasse uma solução de autenticação segura e facilmente escalável. Para armazenar os dados do aplicativo, utilizei o **Prisma** como ORM (Object-Relational Mapping) e o **MongoDB** como banco de dados, permitindo criar um sistema de banco de dados flexível e facilmente gerenciável.

Para implementar as rotas, criei diversos módulos separados, cada um responsável por gerenciar uma determinada funcionalidade. Isso me permitiu dividir o código em partes mais manejáveis e fáceis de entender. Para poder exportar os schemas gerados com o Zod tive que usar a biblioteca **fastify-type-provider-zod**, ela me permitiu gerenciar os schemas adequados para cada rota, garantindo uma melhor segurança na tipagem dos dados.

Utilizei o **Insomnia** para realizar os testes de funcionalidades para cada endpoint disponibilizado, através dela pude realizar diversos testes de integração.

Durante o desenvolvimento me deparei com o problema de que os erros gerados pela Zod estavam sendo retornados com uma formatação incorreta. Isso ocorria porque a biblioteca não possuía uma formatação padrão para os erros gerados, o que poderia ser confuso para os usuários da API. Para resolver esse problema, tive que criar um mecanismo para formatar os erros gerados pelo Zod de maneira mais clara e fácil de entender. Isso envolveu criar uma função que recebia os erros gerados pelo Zod e os formatava de acordo com um padrão específico.

```js
  server.setErrorHandler((error, request, reply) => {
    const toSend = {
      message: 'Validation error',
      errors: JSON.parse(error.message),
      statusCode: error.statusCode || 500
    }

    reply.code(toSend.statusCode).send(toSend)
  })
```

Além disso, optei por separar os esquemas de validação criados com o Zod em um arquivo separado, bem como as demais funções do usuário. Isso me permitiu manter o código mais organizado e fácil de entender.

Essas alterações foram importantes para garantir que a API fosse fácil de usar e que os erros gerados fossem claros e precisos, o que foi fundamental para garantir a qualidade e a sua funcionalidade.

A API que criei possui os seguintes endpoints:

  **`POST /users`**: endpoint para criar um novo usuário na base de dados. Esse endpoint recebe um objeto JSON com os dados do usuário (nome, email, senha e a confirmação de senha) e cria um novo registro na base de dados.

  **`POST /login`**: endpoint para realizar o login de um usuário. Esse endpoint recebe um objeto JSON com o email e a senha do usuário, e retorna um token JWT válido se as credenciais forem corretas.

  **`GET /users`**: endpoint para listar todos os usuários cadastrados na base de dados. Esse endpoint não recebe nenhum parâmetro e retorna uma lista com todos os usuários cadastrados. Esse endpoint está protegido por autenticação JWT, o que significa que só é possível acessá-lo se o usuário fornecer um token válido.

  **`GET /users/dashboard`**: endpoint para obter um usuário específico pelo seu ID. Esse endpoint recebe o ID do usuário como parâmetro e retorna os dados desse usuário. Esse endpoint está protegido por autenticação JWT, o que significa que só é possível acessá-lo se o usuário fornecer um token válido.

  **`PATCH /users/:id`**: endpoint para atualizar os dados de um usuário específico. Esse endpoint recebe o ID do usuário e um objeto JSON com os dados a serem atualizados, e atualiza os dados do usuário na base de dados. Esse endpoint também está protegido por autenticação JWT.

  **`DELETE /users/:id`**: endpoint para apagar um usuário da base de dados. Esse endpoint recebe o ID do usuário como parâmetro e apaga o registro do usuário da base de dados. Esse endpoint também está protegido por autenticação JWT.

Esses são os principais endpoints da API que criei. Eles foram projetados para fornecer uma ampla gama de funcionalidades para gerenciar usuários, incluindo criar, listar, atualizar e apagar usuários. Além disso, a API também inclui uma rota de login para permitir que os usuários façam login e recebam um token JWT válido para acessar os endpoints protegidos por autenticação.

No geral, o desenvolvimento deste projeto foi uma experiência bastante enriquecedora. Além de me permitir aprender sobre o desenvolvimento de API REST com Node.js e sobre as melhores práticas de desenvolvimento de software, o projeto também me permitiu aplicar os conhecimentos adquiridos em uma situação real e criar uma API funcional.

A utilização de ferramentas como o Fastify, o Zod, o JWT e o Prisma também foi muito útil para garantir que a API fosse desenvolvida de maneira rápida, segura e escalável. Isso me permitiu me concentrar no desenvolvimento das funcionalidades em vez de me preocupar com questões de baixo nível, o que foi muito valioso.

No final, fiquei muito satisfeito com o resultado final e acredito que foi uma experiência muito enriquecedora que me ajudou a crescer como desenvolvedor.
