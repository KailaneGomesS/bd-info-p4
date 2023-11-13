const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3555;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('SCA.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Crie a tabela TB_ALUNOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS CLIENTES (ID_CLI INTEGER PRIMARY KEY AUTOINCREMENT, NOME_CLI TEXT NOT NULL, END_CLI TEXT NOT NULL)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela CLIENTES:', err.message);
        } else {
            console.log('Tabela CLIENTES criada com sucesso.');
        }
    }
);

// Crie a tabela TB_ALUNOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS VENDEDORES (ID_VENDEDORES INTEGER PRIMARY KEY AUTOINCREMENT, NOME_VEND TEXT NOT NULL)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela VENDEDORES:', err.message);
        } else {
            console.log('Tabela VENDEDORES criada com sucesso.');
        }
    }
);

// Crie a tabela TB_ALUNOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS PRODUTOS (ID_PRODUTO integer, CODIGO INT NOT NULL, NOME_PROD text NOT NULL, PRECO_UNI REAL UNIQUE, PRIMARY KEY(ID_PRODUTO AUTOINCREMENT))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela PRODUTOS:', err.message);
        } else {
            console.log('Tabela PRODUTOS criada com sucesso.');
        }
    }
);

// Crie a tabela TB_ALUNOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS NOTAS_FISCAIS (COD_CLI	INT NOT NULL, COD_VEND INT NOT NULL, NUM_NF	INT, SERIE_NF TEXT NOT NULL, PRIMARY KEY(NUM_NF))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela NOTAS_FISCAIS criada com sucesso.');
        }
    }
);

// Crie a tabela ITENS_NOTAFISCAL, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS ITENS_NOTAFISCAL (ID_INF INTEGER PRIMARY KEY AUTOINCREMENT, NUM_NF INTEGER, UNIDADE INTEGER, COD_PRO INTEGER, QTD INTEGER, VALOR_ITEM REAL, FOREIGN KEY (NUM_NF) REFERENCES NOTAS_FISCAIS (NUM_NF), FOREIGN KEY (COD_PRO) REFERENCES PRODUTOS (COD_PRO))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela ITENS_NOTAFISCAL:', err.message);
        } else {
            console.log('Tabela ITENS_NOTAFISCAL criada com sucesso.');
        }
    }
);





/////////////////////////////////////////////////////////////////////////////////////////////

// Rotas para operações CRUD

// Criar um cliente
app.post('/clientes', (req, res) => {
    const { NOME_CLI, END_CLI } = req.body;
    db.run('INSERT INTO CLIENTES (NOME_CLI, END_CLI) VALUES (?, ?)', [NOME_CLI, END_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'CLIENTE criado com sucesso' });
    });
});

// Obter todos os clientes
app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM CLIENTES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ clientes: rows });
    });
});

// Obter um cliente por ID
app.get('/clientes/:ID_CLI', (req, res) => {
    const { ID_CLI } = req.params;
    db.get('SELECT * FROM CLIENTES WHERE ID_CLI = ?', [ID_CLI], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'CLIENTE não encontrado' });
            return;
        }
        res.json({ clientes: row });
    });
});

// Atualizar um cliente por ID
app.put('/clintes/:ID_CLI', (req, res) => {
    const { ID_CLI } = req.params;
    const { NOME_CLI, END_CLI } = req.body;
    db.run('UPDATE CLIENTES SET NOME_CLI = ?, END_CLI = ? WHERE ID_CLI = ?', [NOME_CLI, END_CLI, ID_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'CLIENTE atualizado com sucesso' });
    });
});

// Excluir um cliente por ID
app.delete('/clientes/:ID_CLI', (req, res) => {
    const { ID_CLI } = req.params;
    db.run('DELETE FROM CLIENTES WHERE ID_CLI = ?', [ID_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'CLIENTE excluído com sucesso' });
    });
});



//////////////////////////////////////////////////////////////////////////////////////


// Criar um vendedor
app.post('/vendedores', (req, res) => {
    const { NOME_VEND } = req.body;
    db.run('INSERT INTO VENDEDORES (NOME_VEND) VALUES (?)', [NOME_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'VENDEDOR criado com sucesso' });
    });
});

// Obter todos os vendedores
app.get('/vendedores', (req, res) => {
    db.all('SELECT * FROM VENDEDORES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedores: rows });
    });
});

// Obter um vendedor por ID
app.get('/vendedores/:ID_VENDEDORES', (req, res) => {
    const { ID_VENDEDORES } = req.params;
    db.get('SELECT * FROM VENDEDORES WHERE ID_VENDEDORES = ?', [ID_VENDEDORES], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'VENDEDORES não encontrado' });
            return;
        }
        res.json({ vendedores: row });
    });
});

// Atualizar um vendedor por ID
app.put('/vendedores/:ID_VENDEDORES', (req, res) => {
    const { ID_VENDEDORES } = req.params;
    const { NOME_VEND } = req.body;
    db.run('UPDATE VENDEDORES SET NOME_VEND = ? WHERE ID_VENDEDORES = ?', [NOME_VEND, ID_VENDEDORES], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'VENDEDOR atualizado com sucesso' });
    });
});

// Excluir um vendedor por ID
app.delete('/vendedores/:ID_VENDEDORES', (req, res) => {
    const { ID_VENDEDORES } = req.params;
    db.run('DELETE FROM VENDEDORES WHERE ID_VENDEDORES = ?', [ID_VENDEDORES], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'VENDEDORES excluído com sucesso' });
    });
});


/////////////////////////////////////////////////////////////////////////////////////

// Criar um produto
app.post('/produtos', (req, res) => {
    const { NOME_PROD, CODIGO, PRECO_UNI} = req.body;
    db.run('INSERT INTO PRODUTOS (NOME_PROD, CODIGO, PRECO_UNI) VALUES (?, ?, ?)', [NOME_PROD, CODIGO, PRECO_UNI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'PRODUTO criado com sucesso' });
    });
});

// Obter todos os produtos
app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM PRODUTOS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produtos: rows });
    });
});

// Obter um produto por ID
app.get('/produtos/:ID_PRODUTO', (req, res) => {
    const { ID_PRODUTO } = req.params;
    db.get('SELECT * FROM PRODUTOS WHERE ID_PRODUTO = ?', [ID_PRODUTO], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'PRODUTO não encontrado' });
            return;
        }
        res.json({ produtos: row });
    });
});

// Atualizar um produto por ID
app.put('/produtos/:ID_PRODUTO', (req, res) => {
    const { ID_PRODUTO } = req.params;
    const { NOME_PROD, PRECO_UNI } = req.body;
    db.run('UPDATE PRODUTOS SET , CODIGO = ?, PRECO_UNI = ?  WHERE ID_PRODUTO = ?', [NOME_PROD,CODIGO, PRECO_UNI, ID_PRODUTO], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'PRODUTO atualizado com sucesso' });
    });
});

// Excluir um produto por ID
app.delete('/produtos/:ID_PRODUTO', (req, res) => {
    const { ID_PRODUTO } = req.params;
    db.run('DELETE FROM PRODUTOS WHERE ID_PRODUTO = ?', [ID_PRODUTO], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'PRODUTO excluído com sucesso' });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Criar um produto
app.post('/notas', (req, res) => {
    const { COD_CLI, COD_VEND, NUM_NF, SERIE_NF} = req.body;
    db.run('INSERT INTO NOTAS_FISCAIS (COD_CLI, COD_VEND, NUM_NF,SERIE_NF ) VALUES (?, ?, ?, ?)', [COD_CLI, COD_VEND, NUM_NF, SERIE_NF ], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'NOTA criada com sucesso' });
    });
});

// Obter todos os produtos
app.get('/notas', (req, res) => {
    db.all('SELECT * FROM NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ notas: rows });
    });
});

// Obter um produto por ID
app.get('/notas/:NUM_NF', (req, res) => {
    const { NUM_NF } = req.params;
    db.get('SELECT * FROM NOTAS_FISCAIS WHERE NUM_NF = ?', [NUM_NF], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'NOTA não encontrado' });
            return;
        }
        res.json({ notas: row });
    });
});

// Atualizar um produto por ID
app.put('/notas/:NUM_NF', (req, res) => {
    const { NUM_NF } = req.params;
    const { COD_CLI, COD_VEND, SERIE_NF } = req.body;
    db.run('UPDATE NOTAS_FISCAIS SET  COD_CLI = ?, COD_VEND = ?, SERIE_NF = ?  WHERE NUM_NF = ?', [COD_CLI,COD_VEND, SERIE_NF, NUM_NF], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'NOTA atualizado com sucesso' });
    });
});

// Excluir um produto por ID
app.delete('/notas/:NUM_NF', (req, res) => {
    const { NUM_NF } = req.params;
    db.run('DELETE FROM NOTAS_FISCAIS WHERE NUM_NF = ?', [NUM_NF], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'NOTA excluído com sucesso' });
    });
});


// Rotas para operações CRUD TABELA ITENS NOTAS FISCAIS

// Criar um ITEM NOTA FISCAL
app.post('/itemnotafiscal', (req, res) => {
    const { UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO  } = req.body;
    db.run('INSERT INTO ITENS_NOTAFISCAL (UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO ) VALUES (?, ?, ?, ?, ?)', [UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO ], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Item Nota Fiscal criado com sucesso' });
    });
});

// Obter todas os ITENS NOTAS FISCAIS
app.get('/itemnotafiscal', (req, res) => {
    db.all('SELECT * FROM ITENS_NOTAFISCAL', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ itemnotafiscal: rows });
    });
});

// Obter um ITEM NOTA FISCAL por ID
app.get('/itemnotafiscal/:ID_INF', (req, res) => {
    const { ID_INF } = req.params;
    db.get('SELECT * FROM ITENS_NOTAFISCAL WHERE ID_INF = ?', [ID_INF], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Item Nota fiscal não encontrada' });
            return;
        }
        res.json({ itemnotafiscal: row });
    });
});

// Atualizar um ITEM NOTA FISCAL por ID
app.put('/itemnotafiscal/:ID_INF', (req, res) => {
    const { ID_INF } = req.params;
    const { UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO } = req.body;
    db.run('UPDATE ITENS_NOTAFISCAL SET VALOR_ITEM = ?, SET QTD = ?, SET UNIDADE = ?, SET NUM_NF = ?, SET COD_PRO = ? WHERE ID_INF = ?', [VALOR_ITEM, QTD, UNIDADE, ID_INF, NUM_NF, COD_PRO], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item Nota Fiscal atualizado com sucesso' });
    });
});

// Excluir um ITEM NOTA FISCAL por ID
app.delete('/itemnotafiscal/:ID_INF', (req, res) => {
    const { ID_INF } = req.params;
    db.run('DELETE FROM ITENS_NOTAFISCAL WHERE ID_INF = ?', [ID_INF], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item Nota Fiscal excluída com sucesso' });
    });
});


// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});