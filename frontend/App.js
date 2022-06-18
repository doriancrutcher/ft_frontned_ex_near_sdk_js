import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import "./assets/css/global.css";
import { callSmartContractFunction, viewBlockchainState } from "./near-api";
import {
  EducationalText,
  NearInformation,
  SignInPrompt,
  SignOutButton,
} from "./ui-components";

import { getConfig } from "./config";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export function signInWithNearWallet() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn("jsvm.testnet");
}

export function signOutNearWallet() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export async function viewBalance() {
  const nearConfig = getConfig(process.env.NODE_ENV || "development");

  console.log(nearConfig.contractName);

  let account = window.walletConnection.account();

  const balance = await account.viewFunction(
    nearConfig.contractName,
    "ftTotalSupply",
    {},
    {
      jsContract: true,
    }
  );

  console.log(balance);
  return balance;
}

export default function App() {
  const [balance, changeBalance] = useState(0);
  useEffect(() => {
    const getInfo = async () => {
      console.log(await viewBalance());
      changeBalance(await viewBalance());
    };

    getInfo();
  }, []);
  return (
    <React.Fragment>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#home'>React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'></Nav>
            <Nav>
              <Nav.Link
                onClick={
                  window.accountId === ""
                    ? signInWithNearWallet
                    : signOutNearWallet
                }
              >
                {window.accountId === "" ? "Login" : window.accountId}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: "10vh" }}>
        <Card>
          <Card.Text>{balance}</Card.Text>
          <Button>Display</Button>
        </Card>
      </Container>
    </React.Fragment>
  );
}
