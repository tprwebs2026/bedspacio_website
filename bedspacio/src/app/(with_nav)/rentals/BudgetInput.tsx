"use client"


type BudgetProps = {
    minBudget: string,
    maxBudget: string,
    setMinBudget: React.Dispatch<React.SetStateAction<string>>
    setMaxBudget: React.Dispatch<React.SetStateAction<string>>
}

export default function BudgetInput ({ minBudget, maxBudget, setMinBudget, setMaxBudget }: BudgetProps) {

    const number_regex = /^\d*\.?\d*$/;

    return (

        <div className={`relative flex items-start justify-between w-full h-full xl:w-fit lg:w-fit gap-1`}>
            <input type="text" name="budget" id="min_budget" placeholder="Enter minimum Budget" value={minBudget} 
            onChange={(e) => {
                if (number_regex.test(e.target.value)) {
                    setMinBudget(e.target.value)
                }
            }}
            className={`text-[#1D242B] p-3 rounded-[10px] text-[18px] font-bold w-full h-[57.5px] whitespace-nowrap w-[300px] min-w-[150px] truncate focus:outline-none ${minBudget ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B] bg-[#FAFAFA]'}`}/>

            <input type="text" name="budget" id="max_budget" placeholder="Enter maximum budget" value={maxBudget} 
            onChange={(e) => {
                if (number_regex.test(e.target.value)) {
                    setMaxBudget(e.target.value)
                }
            }}
            className={`text-[#1D242B] p-3 rounded-[10px] text-[18px] font-bold w-full h-[57.5px] whitespace-nowrap w-[300px] min-w-[150px] truncate focus:outline-none ${maxBudget ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B] bg-[#FAFAFA]'}`}/>
        </div>
    )
}