import { Link } from 'react-router-dom'
import { ArrowLeft } from '@/components/slab'

export default function PageBack() {
  return <Link to="/" className="page-back"><ArrowLeft size={17} aria-hidden="true" /> Back to home</Link>
}
