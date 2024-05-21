import React from 'react'
import DetailsCard from './DetailsCard';



const Tab8 = ({data}) => {


    return (
        <div>
            <div className='tab1-hold flex justify-center md:mb-48 mb-28 items-center sm:gap-12 gap-0 -mt-16 flex-wrap w-full'>
                {data?.map((item, index)=>{
                    return (
                        <DetailsCard item={item} key={index} />
                    )
                })}
            </div>
        </div>
    )
}

export default Tab8