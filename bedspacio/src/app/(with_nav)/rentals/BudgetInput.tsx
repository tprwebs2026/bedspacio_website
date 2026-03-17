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
            <div className="flex flex-col w-full items-start">
                <span className={`text-[#FAFAFA] text-[16px] pb-1 pl-2 font-bold`}>Minimum Budget</span>
                <input type="text" name="budget" id="min_budget" placeholder="Enter minimum Budget" value={minBudget} 
                onChange={(e) => {
                    if (number_regex.test(e.target.value)) {
                        setMinBudget(e.target.value)
                    }
                }}
                className={`text-[#1D242B] rounded-[5px] text-[18px] font-bold w-full h-[50px] px-3 whitespace-nowrap w-[300px] min-w-[150px] truncate focus:outline-none bg-[#FAFAFA]`}/>
            </div>

            <div className="flex flex-col w-full items-start">
                <span className={`text-[#FAFAFA] text-[16px] pb-1 pl-2 font-bold`}>Maximum Budget</span>
                <input type="text" name="budget" id="max_budget" placeholder="Enter maximum budget" value={maxBudget} 
                onChange={(e) => {
                    if (number_regex.test(e.target.value)) {
                        setMaxBudget(e.target.value)
                    }
                }}
                className={`text-[#1D242B] rounded-[5px] text-[18px] font-bold w-full w-full h-[50px] px-3 whitespace-nowrap w-[300px] min-w-[150px] truncate focus:outline-none bg-[#FAFAFA]`}/>
            </div>
        </div>
    )
}