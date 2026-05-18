export const DefaultAvatar = ({ name }: { name: string }) => {
    const initial = name.charAt(0).toUpperCase();

    return (
        <figure className="min-w-[150px] h-[150px] rounded-full overflow-hidden">
            <div className="flex items-center justify-center w-full h-full p-2 bg-[#141414]/25">
                <span className="text-[#141414] text-8xl font-bold">{initial}</span>
            </div>
        </figure>
    )
}