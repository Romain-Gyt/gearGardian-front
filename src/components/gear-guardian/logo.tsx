'use client';
import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className, size = 32 }: LogoProps) => {
  return (
      <Image
          src="/assets/logo2.png"
          alt="GearGuardian Logo"
          width={size}
          height={size}
          className={className}
          priority
      />
  );
};
