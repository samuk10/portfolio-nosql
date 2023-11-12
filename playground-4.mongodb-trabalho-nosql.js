// Select the database to use.
use('lojadb');

// // Criando a coleção "vendas" e inserindo dados dos clientes
db.vendas.insertMany([
  {
    nome: "João",
    clienteVIP: true,
    email: "joao@email.com",
    telefone: ["9999-1111", "8888-1111"]
  },
  {
    nome: "Marcos",
    clienteVIP: false,
    email: "",
    telefone: ["9999-2222"]
  },
  {
    nome: "Maria",
    clienteVIP: true,
    email: "maria@email.com",
    telefone: ["9999-3333", "8888-3333", "9988-3000"]
  }
])

// Atualizando o endereço do João
db.vendas.updateOne({nome: "João"}, {
  $set: {
    endereco: {
      rua: "Rua Um",
      numero: 1000,
      complemento: "Apto 1 Bloco 1",
      cidade: "São Paulo",
      estado: "SP"
    }
  }
})

// Atualizando o endereço do Marcos
db.vendas.updateOne({nome: "Marcos"}, {
  $set: {
    endereco: {
      rua: "Rua Dois",
      numero: 4000,
      cidade: "Campinas",
      estado: "SP"
    }
  }
})

// Atualizando o endereço da Maria
db.vendas.updateOne({nome: "Maria"}, {
  $set: {
    endereco: {
      rua: "Rua Três",
      numero: 3000,
      cidade: "Londrina",
      estado: "PR"
    }
  }
})

// Inserindo as compras do João
db.vendas.updateOne({nome: "João"}, {
  $set: {
    compras: [
      {
        nomeProduto: "notebook",
        preco: 5000.00,
        quantidade: 1
      }
    ]
  }
})

// Inserindo as compras do Marcos
db.vendas.updateOne({nome: "Marcos"}, {
  $set: {
    compras: [
      {
        nomeProduto: "caderno",
        preco: 20.00,
        quantidade: 1
      },
      {
        nomeProduto: "caneta",
        preco: 3.00,
        quantidade: 5
      },
      {
        nomeProduto: "borracha",
        preco: 2.00,
        quantidade: 2
      }
    ]
  }
})

// Inserindo as compras da Maria
db.vendas.updateOne({nome: "Maria"}, {
  $set: {
    compras: [
      {
        nomeProduto: "tablet",
        preco: 2500.00,
        quantidade: 1
      },
      {
        nomeProduto: "capa para tablet",
        preco: 50.00,
        quantidade: 1
      }
    ]
  }
})

// QUERY'S
// Retornando todos os documentos da collection
db.vendas.find().pretty()

// Localizando as informações da cliente "Maria"
db.vendas.find({nome: "Maria"}).pretty()

// Retornar os clientes VIPs da loja (VIP = 1/true), exibindo apenas o campo "nome"
db.vendas.find({clienteVIP: true}).pretty()

// Exibir as compras efetuadas por "Marcos"
db.vendas.find({ nome: "Marcos" }, { _id: 0, compras: 1 }).pretty()

// Retornar todos os nomes de produtos comprados por todos os clientes
// Usando o operador $distinct() busca por ocorrências únicas de um campo 
db.vendas.distinct("compras.nomeProduto")

// Outra forma de fazer é usando a pipeline de agregação 
// que desdobra o array de compras, 
// projeta apenas os nomes dos produtos, 
// agrupa por nome do produto e 
// conta a quantidade de ocorrências 
// de cada produto ($sum: 1).
// A última etapa do $project é usada para formatar a saída.
db.vendas.aggregate([
  { $unwind: "$compras" },
  { $project: { _id: 0, nomeProduto: "$compras.nomeProduto" } },
  { $group: { _id: "$nomeProduto", total: { $sum: 1 } } },
  { $project: { _id: 0, nomeProduto: "$_id", total: 1 } }
]).pretty()
