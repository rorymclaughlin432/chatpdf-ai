import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/chatpdfai.png'
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

export default async function Navbar() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
<div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
  <nav className="navbar max-w-7xl m-auto flex-col sm:flex-row gap-2">
    <div className="flex-1 gap-3">
      <Link href="/">
          <Image src={logo} alt="Chat PDF AI" width={40} height={40} />
      </Link>
      </div>
      <div className="">
        {isAuth ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in">
           <Button>
           Login to get Started!
           <LogIn className="w-4 h-4 ml-2" />
         </Button>
         </Link>
        )}
      
    </div>
  </nav>
</div>
   
  )
}
