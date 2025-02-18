import { Loading } from '@/components/misc/Loading'

export default function PreferencesLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading AI preferences...
      </p>
    </Loading>
  )
} 