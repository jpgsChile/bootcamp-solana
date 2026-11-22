import "./polyfills"; // primero, antes de cualquier import de Solana

import React from "react";
import ReactDOM from "react-dom/client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import "@solana/wallet-adapter-react-ui/styles.css";

import { ENDPOINT } from "./solana/conexion";
import App from "./App";
import "./index.css";

/*
Tres providers, de afuera hacia adentro:

  ConnectionProvider   la conexion de web3.js que el wallet adapter necesita para
                       firmar. Nuestras lecturas no pasan por aqui: van por el rpc
                       de @solana/kit (src/solana/conexion.ts).

  WalletProvider       combina Wallet Standard (extensiones detectadas) con una
                       lista estable de adapters. Solflare se declara en Devnet
                       para que aparezca en Preview/HTTPS aunque el Standard no
                       lo registre; si Standard ya lo detecta, el provider omite
                       el adapter duplicado por nombre.

  WalletModalProvider  la ventana para elegir wallet y el boton que la abre.
*/
const wallets = [
  new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);
