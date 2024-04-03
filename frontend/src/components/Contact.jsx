import Avatar from "./Avatar"

const Contact = ({ id, onClick, selected, name, online }) => {
    return (
        <div className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (selected ? "bg-blue-50" : "")} onClick={() => onClick(id)}>
            {selected && (<div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>)}
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar name={name} userId={id} online={online} />
                <span className="text-gray-800">{name}</span>
            </div>
        </div>
    )
}

export default Contact