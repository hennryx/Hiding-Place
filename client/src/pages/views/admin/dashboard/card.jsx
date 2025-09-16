import React from 'react'

const Card = ({ title, count, logo: Logo, logoColor = "black" }) => {
    return (
        <div className="flex-1 bg-white shadow-md rounded-2xl">
            <div className='p-4 h-full flex flex-col justify-between'>
                <h2 className="text-sm md:text-lg text-[var(--primary-color)]">{title}</h2>
                <div className="hidden md:block">
                    <p className='font-bold text-sm'>{count}</p>
                    <div className="card-actions justify-end">
                        <Logo size={30} className={`${logoColor}`} />
                    </div>
                </div>

                <div className="flex flex-row-reverse md:hidden items-start justify-end w-full mt-2">
                    <p className='font-bold text-sm'>{count}</p>
                    <div className="card-actions">
                        <Logo size={20} className={`${logoColor}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card