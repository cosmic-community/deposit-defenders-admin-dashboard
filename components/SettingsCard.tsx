import { ReactNode } from 'react'

export interface SettingsCardProps {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}

export default function SettingsCard({
  title,
  description,
  icon,
  children
}: SettingsCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start gap-4">
        <div className="text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}