import { RevenueRecord } from '@/types'
import { formatCurrency } from '@/lib/analytics'
import { format, parseISO } from 'date-fns'
import { CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react'

interface RevenueTableProps {
  transactions: RevenueRecord[]
}

export default function RevenueTable({ transactions }: RevenueTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />
      case 'failed':
        return <XCircle size={16} className="text-red-500" />
      case 'refunded':
        return <AlertCircle size={16} className="text-yellow-500" />
      default:
        return <CreditCard size={16} className="text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500'
      case 'failed':
        return 'text-red-500'
      case 'refunded':
        return 'text-yellow-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card'
      case 'debit_card':
        return 'Debit Card'
      default:
        return method || 'Unknown'
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No revenue transactions found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plan</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment Method</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                {transaction.metadata?.payment_date ? (
                  <div>
                    <div className="font-medium">
                      {format(parseISO(transaction.metadata.payment_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(transaction.metadata.payment_date), 'h:mm a')}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </td>
              
              <td className="py-3 px-4">
                <span className="font-medium">
                  {formatCurrency(transaction.metadata?.amount || 0)}
                </span>
              </td>
              
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {transaction.metadata?.subscription_plan === 'pro' ? 'Pro Plan' : 'Unknown'}
                </span>
              </td>
              
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-muted-foreground" />
                  <span className="text-sm">
                    {getPaymentMethodDisplay(transaction.metadata?.payment_method || '')}
                  </span>
                </div>
              </td>
              
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.metadata?.status || '')}
                  <span className={`text-sm font-medium capitalize ${getStatusColor(transaction.metadata?.status || '')}`}>
                    {transaction.metadata?.status || 'Unknown'}
                  </span>
                </div>
              </td>
              
              <td className="py-3 px-4">
                <span className="text-sm text-muted-foreground font-mono">
                  {transaction.metadata?.stripe_payment_id ? (
                    transaction.metadata.stripe_payment_id.substring(0, 16) + '...'
                  ) : (
                    transaction.id.substring(0, 8) + '...'
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}