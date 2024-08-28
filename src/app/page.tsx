"use client"
import { generateMnemonic, mnemonicToSeed } from "bip39";
import React, { useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl"
import { Keypair, PublicKey } from "@solana/web3.js";

export default function Home() {
  const [showButtons, setShowButtons] = useState(true);
  const [mnemonic, setMnemonic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solPublicKeys, setSolPublicKeys] = useState<PublicKey[]>([]);

  async function generateSolWallet() {

    // setting mnemonic
    const mn = generateMnemonic();
    setMnemonic(mn);

    // generating wallet
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setSolPublicKeys([...solPublicKeys, keypair.publicKey]);
  }


  const handleSolanaClick = () => {
    const buttonDiv = document.querySelector<HTMLButtonElement>(".wallet-button");

    if (buttonDiv) {
      buttonDiv.style.opacity = '0';
    }

    generateSolWallet();

    setTimeout(() => {
      setShowButtons(false);
    }, 500);
  };

  const handleEthClick = () => {
    const buttonDiv = document.querySelector<HTMLButtonElement>(".wallet-button");

    if (buttonDiv) {
      buttonDiv.style.opacity = '0';
    }

    setTimeout(() => {
      setShowButtons(false);
    }, 500);
  };

  return (
    <BackgroundBeamsWithCollision>
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center dark:text-black text-white font-sans tracking-tight">
        <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
          <span className="">House Of Wallets</span>
        </div>
      </h2>

      {showButtons && (
        <div className="wallet-button transition-opacity duration-500 ease-in-out text-center">
          <div className="mt-60 text-xl relative z-20 md:text-2xl lg:text-5xl font-bold text-center dark:text-black text-white font-sans tracking-tight">
            Select a wallet
          </div>
          <Button
            variant={"destructive"}
            className="my-10 mx-4"
            onClick={handleSolanaClick}
          >
            Solana
          </Button>
          <Button
            variant={"destructive"}
            onClick={handleEthClick}
          >
            Ethereum
          </Button>
        </div>
      )}

      {solPublicKeys && (
        <div>
          
        </div>
      )}
    </BackgroundBeamsWithCollision>
  );
}
