export const DefaultAvatar = ({ name }: { name: string }) => {
    const initial = name.charAt(0).toUpperCase();

    return (
        <figure
            className={`size-full rounded-full overflow-hidden [container-type:size]`}
        >
            <div className="flex items-center justify-center w-full h-full p-2 bg-[#141414]/25 rounded-full overflow-hidden">
                <span className="text-[#141414] font-bold text-[50cqi] leading-tight">{initial}</span>
            </div>
        </figure>
    )
}