import axios from "axios";
import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { UserContext } from "/src/App.jsx";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";

export default function HomePage() {
  /* Ferramentas da Página */
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const User = useContext(UserContext).UserData;
  const setUser = useContext(UserContext).SetUserData;

  /* Variaveis de estado */
  let [Transações, SetTransações] = useState([]);
  let [Balanço, SetBalanço] = useState(0);
  let balanço_mov = 0;

  /* Dados externos iniciais: */
  useEffect(() => {
    let tokenSessao = localStorage.getItem("token");
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

      let promisse2 = axios.get(`${url}/transacoes`, {
        headers: { Authorization: `Bearer ${tokenSessao}` },
        params: { email: resposta.data.email },
      });
      promisse2.then((resposta) => {
        SetTransações(resposta.data);
        console.log(resposta.data);
        for (let i = 0; i < resposta.data.length; i++) {
          if (resposta.data[i].tipo === "entrada") {
            balanço_mov = balanço_mov + Number(resposta.data[i].valor)
          } else {
            balanço_mov = balanço_mov - Number(resposta.data[i].valor)
          }
        }
        /*console.log(balanço_mov)*/
        SetBalanço(balanço_mov)
      });
    });
  }, []);

  if (!User) {
    return <Centered>{<ThreeDots height={"80"} color="#FFFFFF" />}</Centered>;
  }

  if (User) {
    return (
      <HomeContainer>
        <Header>
          <h1 data-test="user-name" >{`Olá, ${User.nome} `}</h1>
          <Pointer data-test="logout">
            <BiExit
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            />
          </Pointer>
        </Header>

        <TransactionsContainer>
          <ul>
            {Transações.map((objeto) => {
              return (
              <ListItemContainer key={objeto._id}>
                <div>
                  <span>{objeto.data}</span>
                  <strong data-test="registry-name" >{objeto.descricao}</strong>
                </div>
                <Value data-test="registry-amount" 
                color={objeto.tipo === "entrada" ? "positivo" : "negativo"}>
                  {objeto.valor.toFixed(2)}
                </Value>
              </ListItemContainer>
            )})}
          </ul>

          <article>
            <strong>Saldo</strong>
            <Value data-test="total-amount" color={Balanço >= 0 ? "positivo" : "negativo"}> 
              {Balanço.toFixed(2)}
            </Value>
          </article>
        </TransactionsContainer>

        <ButtonsContainer>
          <button data-test="new-income"
            onClick={() => {
              navigate("/nova-transacao/entrada");
            }}
          >
            <AiOutlinePlusCircle />
            <p>
              Nova <br /> entrada
            </p>
          </button>
          <button data-test="new-expense"
            onClick={() => {
              navigate("/nova-transacao/saida");
            }}
          >
            <AiOutlineMinusCircle />
            <p>
              Nova <br />
              saída
            </p>
          </button>
        </ButtonsContainer>
      </HomeContainer>
    );
  }
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`;
const Pointer = styled.div`
  cursor: pointer;
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`;
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`;
const Centered = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
