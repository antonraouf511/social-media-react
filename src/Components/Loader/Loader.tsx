
import { RotateLoader } from 'react-spinners'

export default function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center"><RotateLoader color="#6366f1" size={23} margin={3} speedMultiplier={1.25} /></div>
  )
}
