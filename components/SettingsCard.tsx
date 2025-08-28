import { ReactNode } from 'react'

interface SettingsCardProps {
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
}

export default function SettingsCard({ 
  title, 
  description, 
  icon, 
  children 
}: SettingsCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-start gap-3 mb-4">
        {icon && (
          <div className="text-primary mt-1">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}