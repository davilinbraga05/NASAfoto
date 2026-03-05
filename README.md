# NASA APOD - Descubra o Cosmos no seu Aniversário 2IAA <3 Carlos
Este projeto consiste em um site que utiliza a API APOD (Astronomy Picture of the Day) da NASA para mostrar qual foi a imagem astronômica capturada no dia do seu aniversário (ou em qualquer data selecionada).

## 🚀 Como Iniciar

Siga os passos abaixo no terminal para configurar o ambiente e rodar o projeto.

### 1. Configurar Política do PowerShell (Apenas Windows)
Para permitir que o terminal execute o ambiente virtual, rode este comando como **Administrador**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Configurar o Backend e Ambiente Virtual

Entre na pasta do backend, crie o ambiente virtual e instale as dependências:

```powershell
# Vá para a pasta do backend
cd Backend

# Crie o ambiente virtual
python -m venv venv

# Ative o ambiente virtual
.\venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt
```

### 3. Configurar a Chave da API da NASA
O projeto já possui um arquivo `.env` na pasta `Backend`. Certifique-se de que ele contém sua chave:
`NASA_API_KEY=SUA_CHAVE_AQUI` (ou use `DEMO_KEY` para testes limitados).

### 4. Iniciar o Servidor
Com o ambiente virtual ativado, rode o comando:
```powershell
uvicorn main:app --reload
```

### 5. Acessar o Frontend
O servidor FastAPI servirá o frontend automaticamente. Abra o seu navegador e acesse:
[http://localhost:8000](http://localhost:8000)

## 🛠️ Tecnologias Utilizadas
- **Backend:** Python, FastAPI, Uvicorn, Requests, Python-dotenv.
- **Frontend:** HTML5, CSS3 (Glassmorphism, Dark Mode), Vanilla JavaScript.
- **API:** NASA Planetary API (APOD).
