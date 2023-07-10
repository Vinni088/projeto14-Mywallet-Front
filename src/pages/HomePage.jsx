import axios from "axios";
import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { UserContext } from "/src/App.jsx";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";

export default function HomePage() {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const User = useContext(UserContext).UserData;
  const setUser = useContext(UserContext).SetUserData;

  useEffect(() => {
    let tokenSessao = localStorage.getItem("token");
    const chave = {
      headers: {
        Authorization: `Bearer ${tokenSessao}`,
      },
    };

    let promisse = axios.get(`${url}/usuario-logado`, chave);

    promisse.then((resposta) => {
      setUser({
        nome: resposta.data.nome,
        email: resposta.data.email,
        tokenSessao,
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
          <h1>{`Olá, ${User.nome} `}</h1>
          <Pointer>
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
            <ListItemContainer>
              <div>
                <span>30/11</span>
                <strong>Almoço mãe</strong>
              </div>
              <Value color={"negativo"}>120,00</Value>
            </ListItemContainer>

            <ListItemContainer>
              <div>
                <span>15/11</span>
                <strong>Salário</strong>
              </div>
              <Value color={"positivo"}>3000,00</Value>
            </ListItemContainer>
          </ul>

          <article>
            <strong>Saldo</strong>
            <Value color={"positivo"}>2880,00</Value>
          </article>
        </TransactionsContainer>

        <ButtonsContainer>
          <button>
            <AiOutlinePlusCircle />
            <p>
              Nova <br /> entrada
            </p>
          </button>
          <button>
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
