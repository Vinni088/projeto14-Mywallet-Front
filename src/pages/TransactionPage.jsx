import axios from "axios";
import styled from "styled-components";
import { UserContext } from "/src/App.jsx";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

export default function TransactionsPage() {
  let [Valor, setValor] = useState("");
  let [Descrição, setDescrição] = useState("");

  /* Ferramentas da Página */
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const User = useContext(UserContext).UserData;
  const setUser = useContext(UserContext).SetUserData;
  let tokenSessao = localStorage.getItem("token");
  const params = useParams();

  /* Dados externos iniciais: */
  useEffect(() => {
    if (!tokenSessao) {
      return navigate("/");
    }

    const chave = { headers: { Authorization: `Bearer ${tokenSessao}` } };
    let promisse1 = axios.get(`${url}/usuario-logado`, chave);
    promisse1.then((resposta) => {
      setUser({
        nome: resposta.data.nome,
        email: resposta.data.email,
        tokenSessao,
      });
    });
  }, []);

  function EnviarTransação(e) {
    e.preventDefault();
    requisição_Transação();
  }

  function requisição_Transação() {
    const chave = {
      headers: {
        Authorization: `Bearer ${tokenSessao}`,
      },
    };
    let dadosTransação = {
      email: User.email,
      valor: Valor,
      descricao: Descrição
    };
    let promisse = axios.post(`${url}/nova-transacao/${params.tipo}`, dadosTransação, chave);
    promisse.then((resposta) => {
      console.log(resposta);
      navigate("/home")
    });
    promisse.catch((resposta) => console.log(resposta));
  }



  return (
    <TransactionsContainer>
      <h1>Nova TRANSAÇÃO</h1>
      <form onSubmit={EnviarTransação}>
        <input placeholder="Valor" type="text" value={Valor}
        onChange={(e) => setValor(e.target.value)}/>

        <input placeholder="Descrição" type="text" value={Descrição}
        onChange={(e) => setDescrição(e.target.value)}/>
        <button>Salvar Transação</button>
        <button onClick={()=> navigate("/home")}> Retornar </button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
