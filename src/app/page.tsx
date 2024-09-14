'use client'

// frontend stuff imports
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { EyeIcon, EyeOffIcon, CopyIcon, TrashIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


//web3 imports
import { mnemonicToSeed, generateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import  bs58  from "bs58"; 

interface Wallet {
  id: number;
  publicKey: string;
  privateKey: string;
}

export default function WalletList() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMainnet, setIsMainnet] = useState(true)
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  function generateMn() {
    const mn = generateMnemonic();
    setSeedPhrase(mn);
    setIsWarningOpen(true)
  }

  const addWallet = async () => {
    if (seedPhrase) {
      const seed = await mnemonicToSeed(seedPhrase);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex(currentIndex + 1);
      const newWallet = {
        id:currentIndex,
        publicKey:keypair.publicKey.toString(),
        privateKey: bs58.encode(keypair.secretKey)
      }
      setWallets([...wallets, newWallet])
      toast({
        title: "Wallet Added",
        description: "A new wallet has been successfully added.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please generate a seed phrase first.",
        variant: "destructive",
      })
    }
  }

  const deleteWallet = (id: number) => {
    setWallets(wallets.filter(wallet => wallet.id !== id))
    toast({
      title: "Wallet Deleted",
      description: "The selected wallet has been removed.",
      variant: "destructive",
    })
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: `The ${type} has been copied to your clipboard.`,
    })
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Card className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <span className="mb-4 sm:mb-0">Solana Wallet</span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <SunIcon className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  aria-label="Toggle dark mode"
                />
                <MoonIcon className="h-4 w-4" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Devnet</span>
                <Switch
                  checked={isMainnet}
                  onCheckedChange={setIsMainnet}
                  aria-label="Toggle network"
                />
                <span className="text-sm">Mainnet</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seedPhrase" className="text-sm font-medium">
                Seed Phrase
              </Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center mt-1 space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  id="seedPhrase"
                  type={showSeedPhrase ? "text" : "password"}
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  className={`flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                  placeholder="Generate or enter your seed phrase"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  >
                    {showSeedPhrase ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(seedPhrase, "seed phrase")}
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy seed phrase</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={generateMn} disabled={!!seedPhrase} className="w-full sm:w-auto">
                Generate Seed Phrase
              </Button>
              <Button onClick={addWallet} disabled={!seedPhrase} className="w-full sm:w-auto">
                Add Wallet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`w-full max-w-2xl mx-auto mt-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardContent>
          <AnimatePresence>
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value={`wallet-${wallet.id}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <span>Wallet {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <Link href={`/wallet/${wallet.id}`} passHref>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteWallet(wallet.id)
                          }}
                          className="h-8 w-8"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete wallet</span>
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`publicKey-${wallet.id}`} className="text-sm font-medium">
                            Public Key
                          </Label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center mt-1 space-y-2 sm:space-y-0 sm:space-x-2">
                            <Input
                              id={`publicKey-${wallet.id}`}
                              value={wallet.publicKey}
                              readOnly
                              className={`flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(wallet.publicKey, "public key")}
                            >
                              <CopyIcon className="h-4 w-4" />
                              <span className="sr-only">Copy public key</span>
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`privateKey-${wallet.id}`} className="text-sm font-medium">
                            Private Key
                          </Label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center mt-1 space-y-2 sm:space-y-0 sm:space-x-2">
                            <Input
                              id={`privateKey-${wallet.id}`}
                              value={wallet.privateKey}
                              type="password"
                              readOnly
                              className={`flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(wallet.privateKey, "private key")}
                            >
                              <CopyIcon className="h-4 w-4" />
                              <span className="sr-only">Copy private key</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AlertDialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keep Your Seed Phrase Secret</AlertDialogTitle>
            <AlertDialogDescription>
              Your seed phrase is the master key to your wallet. Never share it with anyone and store it securely.
              Anyone with access to your seed phrase can control your funds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsWarningOpen(false)
              toast({
                title: "Seed Phrase Generated",
                description: "A new seed phrase has been generated. Keep it secret and safe!",
              })
            }}>I Understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}