'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { MoonIcon, SunIcon, ArrowLeftIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

export default function WalletDetails() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMainnet, setIsMainnet] = useState(true)
  const [balance, setBalance] = useState('0')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const router = useRouter()
  const href = router.prefetch;
  const id = href.toString().split("/wallet/")[1];
  const { toast } = useToast()

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  useEffect(() => {
    // Simulating balance fetch
    setBalance(Math.random().toFixed(4))
  }, [id])

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulating transaction
    toast({
      title: "Transaction Sent",
      description: `Sent ${amount} SOL to ${recipient}`,
    })
    setRecipient('')
    setAmount('')
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Card className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" passHref>
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <span>Wallet Details</span>
            </div>
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
          <div className="space-y-6">
            <div>
              <Label htmlFor="balance" className="text-sm font-medium">
                Balance
              </Label>
              <div className="mt-1 text-2xl font-bold">
                {balance} SOL
              </div>
            </div>
            <form onSubmit={handleTransaction} className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-sm font-medium">
                  Recipient Address
                </Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className={`mt-1 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                  placeholder="Enter recipient's public key"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (SOL)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`mt-1 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                  placeholder="Enter amount to send"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Transaction
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}