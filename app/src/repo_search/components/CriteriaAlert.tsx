import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const CriteriaAlert: React.FC<{
    criteria: string
    value: string
    onRemove: () => void
}> = ({ criteria, value, onRemove }) => {
    return (
        <Alert className="mt-10">
            <AlertTitle className="text-lg justify-center ">
                <div className="flex justify-between items-center">
                    {criteria.toLocaleUpperCase()}
                    <Button onClick={onRemove} variant={'ghost'}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </AlertTitle>
            <AlertDescription className="text-lg font-semibold">
                {value}
            </AlertDescription>
        </Alert>
    )
}

export default CriteriaAlert
