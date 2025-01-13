import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function index() {
  const router = useRouter()

  const {slug} = router.query

  return (
    <>
    <Navbar/>

    <div className='relative flex flex-col justify-center items-center p-4'>
      <div className='w-full flex items-start md:hidden'>
        <Link href={`/course/${slug}`} className=" flex justify-start gap-2 no-underline text-[#2F5FAC] font-bold hover:text-blue-500 w-20 px-2 py-1 items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.7915 11.0051H7.62148L12.5015 6.1251C12.8915 5.7351 12.8915 5.0951 12.5015 4.7051C12.1115 4.3151 11.4815 4.3151 11.0915 4.7051L4.50148 11.2951C4.11148 11.6851 4.11148 12.3151 4.50148 12.7051L11.0915 19.2951C11.4815 19.6851 12.1115 19.6851 12.5015 19.2951C12.8915 18.9051 12.8915 18.2751 12.5015 17.8851L7.62148 13.0051H18.7915C19.3415 13.0051 19.7915 12.5551 19.7915 12.0051C19.7915 11.4551 19.3415 11.0051 18.7915 11.0051Z" fill="#2F5FAC"/>
            </svg>
            Back
          </Link>
      </div>

        <div className='mt-8 md:mt-[100px] w-[343px] lg:w-[739px] mb-8 lg:mb-60 flex flex-col gap-12 items-center shadow-lg rounded-lg p-10'>
          <svg width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M66.8327 33.9998C66.8327 52.4098 51.9093 67.3332 33.4993 67.3332C15.0893 67.3332 0.166016 52.4098 0.166016 33.9998C0.166016 15.5898 15.0893 0.666504 33.4993 0.666504C51.9093 0.666504 66.8327 15.5898 66.8327 33.9998ZM20.536 46.9632C20.2236 46.6506 20.048 46.2268 20.048 45.7848C20.048 45.3429 20.2236 44.919 20.536 44.6065L31.1427 33.9998L20.536 23.3932C20.2324 23.0788 20.0644 22.6578 20.0682 22.2208C20.072 21.7838 20.2473 21.3658 20.5563 21.0568C20.8653 20.7478 21.2833 20.5725 21.7203 20.5687C22.1573 20.5649 22.5783 20.7329 22.8927 21.0365L33.4993 31.6432L44.106 21.0365C44.4204 20.7329 44.8414 20.5649 45.2784 20.5687C45.7153 20.5725 46.1334 20.7478 46.4424 21.0568C46.7514 21.3658 46.9267 21.7838 46.9305 22.2208C46.9343 22.6578 46.7663 23.0788 46.4627 23.3932L35.856 33.9998L46.4627 44.6065C46.7663 44.9208 46.9343 45.3418 46.9305 45.7788C46.9267 46.2158 46.7514 46.6339 46.4424 46.9429C46.1334 47.2519 45.7153 47.4272 45.2784 47.431C44.8414 47.4348 44.4204 47.2668 44.106 46.9632L33.4993 36.3565L22.8927 46.9632C22.5801 47.2756 22.1563 47.4511 21.7143 47.4511C21.2724 47.4511 20.8486 47.2756 20.536 46.9632Z" fill="#9B2FAC"/>
          </svg>

          
          <div className='text-center'>
            <h2 className='text-2xl font-medium'>Payment failed.  </h2>
            <h3 className='text-[#646D89] text-base font-normal'>Please check your payment details and try again</h3>
          </div>

          <div >
            <button 
              onClick={()=>router.push(`/course/${slug}/payment`)}
              className='w-[263px] lg:w-[321.5px] px-8 py-[18px] bg-[#2F5FAC] text-white font-bold rounded-xl'>
                Back to Payment
              </button>
          </div>
        </div>

          <div className='hidden md:block absolute top-10 lg:top-[100px] left-5 lg:left-[102px] w-2 h-2 border-3 border-[#2F5FAC] rounded-full'></div>

          <div className='hidden md:block  absolute top-[67px] lg:top-[159px] left-[-16px] lg:left-[43px] w-7 h-7 rounded-full bg-[#C6DCFF]'></div>

          <div className='hidden md:block  absolute z-[-1] top-[211px] lg:top-[216px] right-[-21px] lg:right-[-28px] w-[74px] h-[74px] rounded-full bg-[#C6DCFF]'></div>

          <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden md:block  absolute top-[53px] lg:top-[126px] right-[-18px] lg:right-28'>
            <path d="M11.3581 19.9099L37.1499 15.9774L27.6597 40.28L11.3581 19.9099Z" stroke="#FBAA1C" strokeWidth="3"/>
          </svg>

    </div>
    <Footer/>
  </>
  )
}
