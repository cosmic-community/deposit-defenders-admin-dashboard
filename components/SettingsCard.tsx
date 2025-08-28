import Link from 'next/link'

interface SettingsCardProps {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
}

export default function SettingsCard({ 
  title, 
  value, 
  description, 
  icon, 
  href 
}: SettingsCardProps) {
  const content = (
    <div className="metric-card cursor-pointer hover:scale-105 transition-transform">
      <div className="flex items-center justify-between mb-4">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-2xl font-bold text-foreground">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}