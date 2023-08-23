import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse, Dropdown, initTE } from "tw-elements";

export default function Navbar(props: { logout: () => void }) {
  useEffect(() => {
    initTE({ Collapse, Dropdown });
  }, []);

  const location = useLocation();
  let icon;
  let toLoc;
  switch (location.pathname) {
    case "/upload":
    case "/book":
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
      toLoc = "/library";
      break;
    case "/library":
    default:
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      );
      toLoc = "/upload";
      break;
  }

  return (
    <>
      <nav
        className="py-4 px-3 justify-between flex-no-wrap relative flex w-full bg-[#FBFBFB] py-2 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10"
        data-te-navbar-ref
      >
        <Link
          to={toLoc}
          className="text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
        >
          <span className="[&>svg]:w-5">{icon}</span>
        </Link>
        <div
          className="text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
          onClick={props.logout}
        >
          <span className="[&>svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </span>
        </div>
      </nav>
    </>
  );
}
