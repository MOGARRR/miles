import React from "react";
import Link from "next/link";

interface directoryProps {
  routeName: string | null;
  routeLink: string | null;
}

const Directory: React.FC<directoryProps> = ({ routeName, routeLink }) => {
  return (
    <div className="flex m-5 text-xl">
      <Link href="/" className="pr-1">
        Home
      </Link>
      {routeLink && (
        <Link href={{ pathname: routeLink }}> &gt; {routeName}</Link>
      )}
    </div>
  );
};

export default Directory;
