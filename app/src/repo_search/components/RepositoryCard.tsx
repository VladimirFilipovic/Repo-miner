import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Repository } from '../types'
import { Button } from '@/components/ui/button'

const RepositoryCard: React.FC<{ repository: Repository }> = ({
    repository,
}) => {
    return (
        <Card className="mb-10">
            <CardHeader>
                <CardTitle className="text-blue-500">
                    {repository.fullName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{repository.id}</p>
                <p>{repository.name}</p>
                {repository.description && <p>{repository.description}</p>}
                <Button size="sm" variant="link">
                    <a href={repository.url}>{repository.url}</a>
                </Button>
                <Button variant="link">
                    <a href={repository.htmlUrl}>{repository.htmlUrl}</a>
                </Button>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default RepositoryCard
