import Link from "next/link";
import React from "react";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { GrMail } from "react-icons/gr";

export default function Footer() {
  return (
    <React.Fragment>
      <footer className="footer items-center p-4 bg-neutral text-neutral-content mt-4">
        <aside className="items-center grid-flow-col">
          <p>© 2023 Copyright | Designed by Przemysław Romańczuk</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <Link href="https://github.com/Gamattowicz">
            <FaGithubSquare className="icons" />
          </Link>
          <Link href="mailto: p.romanczuk31@gmail.com">
            <GrMail className="icons" />
          </Link>
          <Link href="https://linkedin.com/in/przemysław-romańczuk">
            <FaLinkedin className="icons" color="primary" />
          </Link>
        </nav>
      </footer>
    </React.Fragment>
  );
}
