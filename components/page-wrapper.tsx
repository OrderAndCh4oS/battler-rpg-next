import React, {FC, ReactNode} from "react";
import Footer from "./footer";
import Link from "next/link";

const PageWrapper: FC<{ children: ReactNode }> = ({children}) =>
    <div className='p-10'>
        <header className='flex'>
            <h1 className='pb-4 text-3xl'>
                RPG Battler
            </h1>
            <div className='flex ml-auto gap-6'>
                <Link href="/">
                    One Player
                </Link>
                <Link href="two-player">
                    Two Player
                </Link>
            </div>
        </header>
        {children}
        <Footer/>
    </div>

export default PageWrapper;
