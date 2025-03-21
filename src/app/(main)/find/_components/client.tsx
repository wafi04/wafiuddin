"use client"

import { useState, useEffect } from "react"
import { HeaderFindInvoice } from "./header-find-invoice"
import { trpc } from "@/utils/trpc"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MessageSquare } from "lucide-react"
import { MostPurchases } from "./mostPembelians"

export function ClientPage() {
  const [term, setTerm] = useState<string>("")
  const [debouncedTerm, setDebouncedTerm] = useState<string>("")
  
  // Debounce the search term with 300ms delay
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term)
    }, 300)
    
    return () => clearTimeout(timerId)
  }, [term])

  // Using trpc to fetch invoice data when debounced term changes
  // const { data, isLoading, error } = trpc.inv.findById.useQuery(
  //   { id: debouncedTerm },
  //   { enabled: debouncedTerm.length > 10 } 
  // )

  // Handle the onChange event properly
  const handleSearchChange = (newTerm: string) => {
    setTerm(newTerm)
  }

  const maskInvoiceNumber = (invoiceNumber: string) => {
    if (!invoiceNumber) return '';
    
    // Extract the first 3 characters (INV)
    const prefix = invoiceNumber.substring(0, 3);
    
    // Extract the last 4 characters (85r4)
    const suffix = invoiceNumber.slice(-4);
    
    // Create asterisks to replace everything in between
    const middleLength = invoiceNumber.length - 3 - 4;
    const maskedMiddle = '*'.repeat(middleLength);
    
    // Return the masked invoice number
    return prefix + maskedMiddle + suffix;
  };

  // Function to mask phone number - show only first 3 digits
  const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return '—';
    
    // Show only first 3 digits followed by asterisks
    const first3Digits = phoneNumber.slice(0, 3);
    const maskedPart = '*'.repeat(phoneNumber.length - 3);
    
    return first3Digits + maskedPart;
  }

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }


  const { data: recentTransactions } = trpc.pembelians.findMostPurchase.useQuery()

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <section className="space-y-10 p-6">
        {/* Pass the correct onChange handler */}
        <HeaderFindInvoice 
          onChange={handleSearchChange} 
          term={term}
        />
        
        {/* Display error if any */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-500">Error loading invoice: {error.message}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Loading state */}
        {isLoading && debouncedTerm && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {/* Display invoice data */}
        {data && !isLoading && data.data && (
          <Table className="p-8">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>No. Handphone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-8">
              <TableRow>
                <TableCell className="font-medium">{data.data.id}</TableCell>
                <TableCell>{maskInvoiceNumber(data.data.invoiceNumber)}</TableCell>
                <TableCell>{formatCurrency(data.data.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={data.data.transaction?.paymentStatus === "PAID" ? "default" : "secondary"}>
                    {data.data.transaction?.paymentStatus || "PENDING"}
                  </Badge>
                </TableCell>
                <TableCell>{maskPhoneNumber(data.data.transaction?.noWa ?? "-")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        
       
      </section>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Recent Transactions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Latest 10 transactions across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions && recentTransactions.data.length > 0 && (
            <MostPurchases data={recentTransactions.data}/>
          )}
        </CardContent>
       
      </Card>
    </main>
  )
}