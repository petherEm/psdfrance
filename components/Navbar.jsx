import Link from "next/link";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const Navbar = () => {
  return (
    <div className="dark navbar bg-base-800 z-50">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl flex flex-col gap-y-1"
        >
          <span className="fi fi-fr text-4xl"></span>
          PSD Agents in France
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/hexagonview">Hexagon View</Link>
          </li>
          <li>
            <Link href="https://www.vabank.dev" target="_blank">
              <span className="text-red-600 font-bold">
                | coded by Vabank.dev
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
