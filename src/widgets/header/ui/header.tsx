"use client";

import React from "react";
import Link from "next/link";
import { ProfileIcon } from "../assets/profile-icon";
import s from "./header.module.scss";
import { useIsScrolled } from "../hooks";
import cn from "classnames";

export const Header = () => {
  const isScrolled = useIsScrolled();

  return (
    <header className={cn(s.root, { [s.scrolled]: isScrolled })} role="banner">
      <div className={s.container}>
        <Link href="/" className={s.logo} aria-label="Открыть главную страницу">
          Home
        </Link>

        <Link
          href="/profile"
          className={s.profile}
          aria-label="Открыть профиль"
        >
          <span className={s.profileIcon}>
            <ProfileIcon />
          </span>
        </Link>
      </div>
    </header>
  );
};
