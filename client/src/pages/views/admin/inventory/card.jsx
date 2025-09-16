const Card = ({ title, logo: Logo, count, handleClick, value }) => {
    return (
        <div
            className="flex-1 flex flex-row gap-6 justify-between items-center cursor-pointer p-4 bg-white shadow-md rounded-md"
            onClick={() => handleClick(value)}
        >
            <div className="flex flex-col">
                <p className="text-[#525B5F] text-sm">{title} </p>
                <h1 className="text-lg font-bold">{count}</h1>
            </div>
            <Logo size={25} className="text-[#525B5F]" />
        </div>
    );
};

export default Card;
