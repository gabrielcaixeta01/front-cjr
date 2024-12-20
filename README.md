README - UnbReview

Sobre o Projeto:
  UnbReview é uma plataforma interativa desenvolvida para os alunos da Universidade de Brasília (UnB). O site permite que os alunos avaliem professores, compartilhem experiências e opiniões sobre disciplinas, e comentem   em avaliações feitas por outros usuários. O objetivo principal do projeto é criar uma comunidade colaborativa que auxilie os estudantes a tomarem decisões mais informadas sobre seus cursos e professores.

Funcionalidades Principais
	1.	Cadastro e Login
  	•	Cadastro de novos alunos.
  	•	Login seguro com autenticação JWT.
  	•	Login automático após o cadastro bem-sucedido.
	2.	Feed de Professores
  	•	Visualize uma lista de professores cadastrados, organizados por departamentos e disciplinas.
  	•	Busque por professores pelo nome ou departamento.
  	•	Ordene professores por nome ou data de cadastro.
	3.	Avaliações
  	•	Escreva avaliações sobre professores.
  	•	Leia avaliações publicadas por outros alunos.
  	•	Comente em avaliações para interagir com outros usuários.
	4.	Perfil do Usuário
  	•	Cada aluno possui um perfil personalizável com foto, nome, departamento e programa de estudo.
  	•	Editar e atualizar informações pessoais.
  	•	Excluir o perfil.
	5.	Interação e Comunidade
  	•	Sistema de comentários em avaliações.
  	•	Acompanhe o feedback de outros alunos.

Tecnologias Utilizadas
  Frontend:
  	•	Framework: Next.js (React)
  	•	Linguagem: TypeScript
  	•	Estilização: Tailwind CSS
  	•	Bibliotecas Auxiliares:
    	-	Formik & Yup (Validação de Formulários)
    	-	React Toastify (Notificações)
    	-	Axios (Requisições HTTP)
      - class-validator (validar dados)

  Backend:
  	•	Nest.js
  	•	Banco de Dados: Prisma ORM

  Autenticação:
  	•	JSON Web Tokens (JWT)
