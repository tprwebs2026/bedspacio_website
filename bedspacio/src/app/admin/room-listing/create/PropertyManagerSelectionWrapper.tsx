// "use client"

// import { useState } from "react"
// import { PropertyManagerType } from "./CreateRoomPageWrapper"

// interface PropertyManagerSelectionProp {
//     managers: PropertyManagerType[]
// }

// export default function PropertyManagerSelectionWrapper ({ managers }: PropertyManagerSelectionProp) {
//     const [selectedPropertyManager, setSelectedPropertyManager] = useState<number>()

//     return (
//         <div className="flex items-center gap-1 w-full">
//             <span className="whitespace-nowrap">Assigned Property Manager</span>

//             {/* Will map all property managers later on */}
//             <select name="property_manager" id="property_manager_selection" 
//             value={selectedPropertyManager} onChange={(e) => setSelectedPropertyManager(Number(e.target.value))} className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]">
//                 <option hidden>Assign a Property Manager</option>
//                 {managers.map(manager => (
//                     <option key={manager.id} value={manager.id}>{manager.fullname}</option>
//                 ))}
//             </select>
//         </div>
//     )
// }