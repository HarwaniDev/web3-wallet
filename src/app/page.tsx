'use client'

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

interface Wallet {
  id: number;
  publicKey: string;
  privateKey: string;
}

export default function Wallet() {
  const [seedPhrase, setSeedPhrase] = useState('')
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMainnet, setIsMainnet] = useState(true)
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  const generateSeedPhrase = () => {
    const dummySeedPhrase = 'apple banana cherry date elderberry fig grape honeydew imbe jackfruit kiwi lemon'
    setSeedPhrase(dummySeedPhrase)
    setIsWarningOpen(true)
  }

  const addWallet = () => {
    if (seedPhrase) {
      const newWallet: Wallet = {
        id: Date.now(),
        publicKey: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        privateKey: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
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
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Card className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Solana Wallet</span>
            <div className="flex items-center space-x-4">
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
              <div className="flex items-center mt-1">
                <Input
                  id="seedPhrase"
                  type={showSeedPhrase ? "text" : "password"}
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  className={`flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                  placeholder="Generate or enter your seed phrase"
                 
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  className="ml-2"
                >
                  {showSeedPhrase ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(seedPhrase, "seed phrase")}
                  className="ml-2"
                >
                  <CopyIcon className="h-4 w-4" />
                  <span className="sr-only">Copy seed phrase</span>
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <Button onClick={generateSeedPhrase} disabled={!!seedPhrase}>
                Generate Seed Phrase
              </Button>
              <Button onClick={addWallet} disabled={!seedPhrase}>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteWallet(wallet.id)
                        }}
                        className="ml-auto h-8 w-8"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete wallet</span>
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`publicKey-${wallet.id}`} className="text-sm font-medium">
                            Public Key
                          </Label>
                          <div className="flex items-center mt-1">
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
                              className="ml-2"
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
                          <div className="flex items-center mt-1">
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
                              className="ml-2"
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