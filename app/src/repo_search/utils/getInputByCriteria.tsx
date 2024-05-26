import DatePicker from '@/components/DatePicker'
import Input from '@/components/ui/input'

import { formatISO } from 'date-fns'
import { SearchCriteria } from '../types'

export const getInputByCriteria = ({
    criteria,
    onChange,
}: {
    criteria: SearchCriteria
    onChange: (value: string) => void
}) => {
    switch (criteria) {
        case SearchCriteria.Language:
        case SearchCriteria.NameOrDescription:
        case SearchCriteria.Topics:
        case SearchCriteria.CodeContains:
            return (
                <Input
                    id="stringCriteria"
                    placeholder={`Enter a ${criteria}`}
                    onChange={(value) => onChange(value.target.value)}
                    className="w-40"
                    type="text"
                />
            )
        case SearchCriteria.Stars:
        case SearchCriteria.Forks:
            return (
                <Input
                    id="stars-forks"
                    placeholder={`Enter a number of ${criteria}`}
                    className="w-40"
                    type="number"
                    defaultValue={0}
                    min={0}
                    onChange={(value) => onChange(value.target.value)}
                />
            )
        case SearchCriteria.UpdatedAfter:
        case SearchCriteria.CreatedAfter:
            return (
                <div className="w-40">
                    <DatePicker
                        onSelect={(date) =>
                            onChange(
                                formatISO(date, { representation: 'date' })
                            )
                        }
                        className="w-[200px] justify-start text-left font-normal"
                    />
                </div>
            )
        default:
            return null
    }
}
