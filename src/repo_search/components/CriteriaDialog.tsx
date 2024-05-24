import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { CirclePlus } from 'lucide-react'
import { FC, useCallback, useState } from 'react'

import CriteriaSelect from './CriteriaSelect'
import { SearchCriteria } from '../types'
import { getInputByCriteria } from '../utils/getInputByCriteria'

interface IProps {
    onCriteriaSubmit: (criteria: SearchCriteria, value: string) => void
}

const CriteariaDialog: FC<IProps> = ({ onCriteriaSubmit }) => {
    const [criteria, setCriteria] = useState<SearchCriteria>(
        SearchCriteria.CodeContains
    )
    const [criteriaValue, setCriteriaValue] = useState<string>('')

    const getInputByCriteriaCallback = useCallback(
        ({
            criteria,
            onChange,
        }: {
            criteria: SearchCriteria
            onChange: (value: string) => void
        }) => {
            return getInputByCriteria({ criteria, onChange })
        },
        []
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-10">
                    <CirclePlus className="mr-3 h-5 w-5" /> Add new criteria
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <CriteriaSelect
                        preselectedCriteria={criteria}
                        onCriteriaChange={(critearia) => {
                            setCriteria(critearia)
                        }}
                    />
                    {getInputByCriteriaCallback({
                        criteria,
                        onChange: (value) => {
                            setCriteriaValue(value)
                        },
                    })}
                </div>
                <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            onClick={() =>
                                onCriteriaSubmit(criteria, criteriaValue)
                            }
                            type="submit"
                        >
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CriteariaDialog
