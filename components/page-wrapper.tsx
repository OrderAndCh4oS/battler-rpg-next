import {FC, ReactNode} from "react";
import Footer from "./footer";

const PageWrapper: FC<{ children: ReactNode }> = ({children}) =>
    <div className='p-10'>
        {children}
        <Footer/>
    </div>

export default PageWrapper;
