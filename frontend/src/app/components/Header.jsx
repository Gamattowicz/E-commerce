"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../userContext";

import Image from "next/image";
import Logo from "./Logo.png";

export default function Header() {
  const { userInfo, setUserInfo } = useUser();

  const router = useRouter();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    router.push("/login");
  };
  return (
    <React.Fragment>
      <div className="navbar bg-primary text-primary-content mb-4">
        <div className="navbar-start">
          <Link className="btn btn-ghost normal-case text-xl" href="/">
            <Image src={Logo} width={50} height={50} alt="Logo" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {userInfo ? (
              <>
                {userInfo.user_type === 2 && (
                  <>
                    <li>
                      <Link href="/products">Products</Link>
                    </li>
                    <li>
                      <Link href="/top-products">Top Products</Link>
                    </li>
                    <li>
                      <div onClick={logoutHandler}>Logout</div>
                    </li>
                  </>
                )}
                {userInfo.user_type === 1 && (
                  <>
                    <li>
                      <Link href="/products">Products</Link>
                    </li>
                    <li>
                      <Link href="/orders">Orders</Link>
                    </li>
                    <li>
                      <div onClick={logoutHandler}>Logout</div>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link href="/sign-up">Sign Up</Link>
                </li>
                <li>
                  <Link href="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}
