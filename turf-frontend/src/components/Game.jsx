import React from 'react'

const Game = ({ name, imgUrl, turfs }) => {
    return (
        <div className='relative border-2 rounded-2xl overflow-hidden hover:cursor-pointer'>
            <img src={imgUrl} alt="" className='w-[350px] h-[300px] object-cover' />
            <div className='absolute bottom-10 left-5 flex flex-col gap-2'>
                <p className='text-white font-bold text-3xl'>{name}</p>
                <div className='bg-[#5b6333]/90 px-3 py-1 rounded-lg'>
                    <p className='text-white text-sm font-semibold'>
                        {/* {turfs.length} Turfs Available */}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Game
