import { Link, useRouter } from '@tanstack/react-router'
import { DialogClose } from '@radix-ui/react-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Button } from '../components/ui/button'

const Header = () => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.navigate({
      to: '/login',
      replace: true,
    })
  }

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold text-blue-600 tracking-tight select-none">
            Fincart
          </span>
          <nav className="flex gap-4 text-base font-medium">
            <Link
              to="/service"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            >
              Services
            </Link>
            <Link
              to="/slots"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            >
              Slots
            </Link>
          </nav>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="font-semibold">
              Logout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to logout? You will need to login again to
                access your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}

export default Header
