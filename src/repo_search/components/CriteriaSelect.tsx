import * as React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { SearchCriteria } from '../types'

interface IProps {
    preselectedCriteria?: SearchCriteria
    onCriteriaChange: (criteria: SearchCriteria) => void
}

const CriteriaSelect: React.FC<IProps> = ({
    onCriteriaChange,
    preselectedCriteria,
}) => {
    const criteriaOptions = new Map<SearchCriteria, string>([
        [SearchCriteria.CodeContains, 'Code contains'],
        [SearchCriteria.NameOrDescription, 'Name or description'],
        [SearchCriteria.Topics, 'Topics'],
        [SearchCriteria.Language, 'Language'],
        [SearchCriteria.Stars, 'Stars'],
        [SearchCriteria.Forks, 'Forks'],
        [SearchCriteria.UpdatedAfter, 'Updated after'],
        [SearchCriteria.CreatedAfter, 'Created after'],
    ])

    return (
        <Select
            defaultValue={preselectedCriteria}
            onValueChange={onCriteriaChange}
        >
            <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
                {Array.from(criteriaOptions).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default CriteriaSelect
