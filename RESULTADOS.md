# RESULTADOS

A partir do levantamento bibliográfico e do diagnóstico das dificuldades enfrentadas por pequenas empresas no controle de estoque, foi desenvolvida uma ferramenta web automatizada de baixo custo, denominada **Stock Manager**, voltada para auxiliar pequenos empreendedores na gestão de produtos, fornecedores, clientes e movimentações de entrada e saída de mercadorias. A solução foi concebida com base nos princípios de simplicidade operacional, baixo custo de infraestrutura, escalabilidade e usabilidade, sendo distribuída em duas aplicações que se comunicam por meio de uma API REST: o **stock-api**, responsável pela camada de negócio e persistência dos dados, e o **stock-web**, responsável pela interface gráfica utilizada pelo usuário final.

## Arquitetura e Tecnologias Utilizadas

A arquitetura da ferramenta foi estruturada seguindo o padrão de aplicação cliente-servidor, com clara separação de responsabilidades entre as camadas. O **back-end** foi implementado em Node.js com TypeScript, utilizando o framework Express para roteamento HTTP e o TypeORM como Object-Relational Mapping (ORM) para a manipulação dos dados em um banco de dados relacional PostgreSQL. A injeção de dependências foi gerenciada pela biblioteca tsyringe, e a validação dos dados de entrada foi realizada com celebrate em conjunto com Joi. Para o controle de autenticação, optou-se pelo uso de JSON Web Tokens (JWT), garantindo que apenas usuários autenticados tenham acesso às rotas protegidas. O Redis foi utilizado como mecanismo de cache para otimizar consultas recorrentes.

O **front-end** foi desenvolvido em React com TypeScript, utilizando styled-components para a estilização das interfaces, react-router-dom para a navegação entre páginas, axios para a comunicação com a API e Yup para validações de formulário. A organização do código segue a separação clara entre páginas, componentes reutilizáveis, hooks customizados, serviços e tipos, o que favorece a manutenibilidade e a evolução da aplicação.

A escolha das tecnologias foi orientada pela busca por ferramentas de código aberto, amplamente documentadas e com curva de aprendizado favorável, características que se alinham com a proposta de manter o custo de implantação reduzido e tornar viável a sua adoção por pequenos empreendedores.

## Funcionalidades Implementadas

A ferramenta foi organizada em módulos funcionais que cobrem o ciclo completo da gestão de estoque de uma pequena empresa, desde o cadastro inicial de informações até a análise gerencial dos dados.

### Módulo de Autenticação e Gestão de Usuários

Para garantir a segurança das informações armazenadas, foi implementado um módulo de autenticação completo, composto pelas funcionalidades de cadastro de usuário, login, recuperação de senha por e-mail, redefinição de senha e edição de perfil. Adicionalmente, foi desenvolvido um sistema de convites, permitindo que um administrador da empresa convide outros colaboradores para acessar a plataforma com credenciais próprias. Todas as rotas que manipulam dados sensíveis exigem autenticação via JWT, e o token é validado a cada requisição por meio de um middleware específico.

### Módulo de Cadastros Básicos

Foram implementados módulos de cadastro para as entidades essenciais ao funcionamento de uma pequena empresa: **fornecedores**, **clientes**, **produtos**, **marcas**, **modelos**, **categorias** e **fabricantes**. Cada entidade possui sua própria interface de listagem, criação, edição e remoção, seguindo o padrão de operações CRUD (Create, Read, Update, Delete).

O cadastro de **fornecedores** contempla informações como razão social, nome fantasia, CNPJ, endereço completo (com integração ao serviço ViaCEP para preenchimento automático), dados de contato e nome do representante. O cadastro de **clientes** inclui nome, documento, contato e endereço. Para o cadastro de **produtos**, foram disponibilizados campos como nome, código, descrição, marca, modelo, categoria, fabricante, unidade de medida, estoque atual e imagem ilustrativa, sendo possível também ativar ou desativar um produto sem a necessidade de removê-lo do banco de dados.

### Módulo de Movimentações de Estoque

O módulo de movimentações constitui o núcleo operacional da ferramenta, sendo responsável por registrar todas as alterações no estoque. Foram contemplados três tipos de movimentação: **entrada**, **saída** e **ajuste de estoque**. Cada movimentação registra o produto envolvido, a quantidade movimentada, o motivo, o estoque resultante após a operação e, conforme o tipo, o fornecedor (em entradas) ou o cliente (em saídas). Para garantir a integridade dos dados, a operação de movimentação é executada dentro de uma transação no banco de dados, com bloqueio pessimista no produto envolvido, evitando inconsistências em cenários de concorrência. A movimentação do tipo *ajuste* foi pensada para permitir a correção do estoque após contagens físicas, calculando automaticamente a diferença entre o valor informado e o estoque atual e registrando-a como entrada ou saída, conforme o caso.

A interface de listagem de movimentações exibe o histórico completo de operações, com informações sobre o produto, tipo, quantidade, estoque inicial, estoque após a movimentação, motivo, parte envolvida (fornecedor ou cliente) e data, possibilitando a rastreabilidade das alterações realizadas no estoque.

### Módulo de Dashboard Analítico

Como diferencial da ferramenta, foi desenvolvido um módulo de **dashboard analítico**, voltado à apresentação de indicadores gerenciais que apoiam a tomada de decisão. Este módulo disponibiliza cinco visualizações distintas, todas com colunas de ordenação configuráveis e filtro de período quando aplicável:

1. **Nível de estoque por período**: apresenta a última movimentação de cada produto dentro do intervalo de datas selecionado, exibindo o produto, a data da movimentação, o tipo e o estoque resultante. Esta visualização permite ao gestor identificar rapidamente o status atual do estoque a partir de movimentações recentes.

2. **Itens com estoque zerado**: lista todos os produtos cujo estoque atual é igual a zero, agrupados com informações de categoria e marca, permitindo que o gestor identifique de forma imediata quais itens necessitam de reposição.

3. **Resumo de movimentações**: apresenta, para cada produto, o total de quantidades movimentadas em entradas e saídas dentro do período selecionado, evidenciando os produtos com maior e menor giro.

4. **Entradas por fornecedor**: agrupa as movimentações do tipo entrada por fornecedor, contabilizando o número total de entradas registradas para cada um. Essa informação permite identificar os fornecedores mais ativos e auxilia em decisões de relacionamento e negociação.

5. **Saídas por cliente**: agrupa as movimentações do tipo saída por cliente, contabilizando o número total de saídas associadas a cada um, possibilitando a identificação dos principais clientes da empresa.

Para que essas visualizações fossem possíveis, foram criados endpoints específicos no back-end (`/dashboard/stock-levels`, `/dashboard/zero-stock`, `/dashboard/movements-summary`, `/dashboard/entries-by-supplier`, `/dashboard/exits-by-client`), cada um com consultas otimizadas via TypeORM utilizando recursos como subqueries e funções de agregação SQL (`SUM`, `COUNT`, `MAX` e `GROUP BY`), de forma a delegar ao banco de dados a maior parte do esforço computacional e reduzir a quantidade de dados trafegados pela rede.

No front-end, foi desenvolvido um hook customizado denominado `useSortableData`, responsável pela lógica de ordenação reutilizável entre as tabelas, e um componente `SortableHeader`, que exibe os indicadores visuais (setas) referentes à coluna e direção da ordenação atual. Já o componente `PeriodFilter` permite ao usuário selecionar um intervalo de datas e dispara o recarregamento automático dos dados das visualizações que dependem de período, com validação que impede a definição de uma data inicial posterior à data final.

## Discussão dos Resultados

A ferramenta desenvolvida atendeu aos requisitos funcionais elencados durante a fase de levantamento, oferecendo a uma pequena empresa uma alternativa de baixo custo para substituir controles manuais ou planilhas eletrônicas, frequentemente sujeitos a erros e inconsistências. A separação clara entre cadastros, movimentações e visualizações analíticas torna o uso da ferramenta intuitivo, mesmo para usuários sem formação específica em sistemas de informação.

A adoção de tecnologias web modernas e amplamente difundidas no mercado contribui para a manutenibilidade da solução e para a possibilidade de evolução incremental, com a inclusão futura de novas funcionalidades — como integração com emissão de notas fiscais, controle de validade de produtos ou alertas automáticos de reposição. Além disso, a arquitetura adotada permite que a aplicação seja hospedada em provedores de baixo custo ou mesmo em uma infraestrutura local da própria empresa, mantendo o objetivo de tornar a solução economicamente viável para pequenos empreendedores.

O dashboard analítico, em particular, representa um avanço relevante em relação aos controles tradicionalmente utilizados por pequenas empresas, na medida em que entrega ao gestor informações agregadas em tempo real, sem que seja necessário compilar dados manualmente. Indicadores como produtos sem estoque, fornecedores mais frequentes e clientes mais ativos passam a estar disponíveis a poucos cliques, contribuindo para uma gestão mais informada e proativa.
