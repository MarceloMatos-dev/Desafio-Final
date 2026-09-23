# ReliefFlow Salvador

Projeto Angular acadêmico para organização de doações e metas de arrecadação em Salvador, Bahia.

## Perfis
- **Doador:** cadastra-se, visualiza metas e registra intenções de doação.
- **ONG:** possui cadastro próprio, informa bairro, descrição e metas por categoria. A ONG passa a aparecer na rede de apoio.
- **Administrador:** confirma ou recusa recebimentos e acompanha o dashboard geral.

## Como as metas funcionam
Cada ONG possui uma quantidade atual e uma meta para Água, Alimentos, Higiene, Medicamentos e Roupas. A porcentagem é calculada por `atual / meta * 100`. A intenção de doação mostra uma prévia do impacto, mas a porcentagem oficial só muda quando o administrador confirma o recebimento.

## Login administrativo
- E-mail: admin@reliefflow.org
- Senha: admin123

## Executar
```bash
npm install
npm start
```
Acesse `http://localhost:4200`.

> Os nomes, metas e quantidades iniciais usados na demonstração são dados simulados para fins acadêmicos; não representam necessidades oficiais em tempo real.
