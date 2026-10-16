import { Link } from "react-router-dom";

function Navbar() {
return ( <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 rounded-2xl bg-white/20 p-4 text-white shadow-lg"> <Link className="rounded-lg px-4 py-2 hover:bg-white/20" to="/">
Home </Link>


  <Link className="rounded-lg px-4 py-2 hover:bg-white/20" to="/about">
    About
  </Link>

  <Link className="rounded-lg px-4 py-2 hover:bg-white/20" to="/favorites">
    Favorites
  </Link>
</nav>

);
}

export default Navbar;
