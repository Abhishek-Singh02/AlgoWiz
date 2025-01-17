import { sentenceCase } from "change-case";
import { FC } from "react";
import { useLocation } from "react-router-dom";

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
    const { pathname } = useLocation();
    const isRoot = pathname === "/";
    return (
        <div className="w-full flex gap-2 items-center px-6 py-3 border-b border-neutral-800">
            {isRoot && (
                <img
                    src="/logo.png"
                    height="20"
                    width="20"
                    className="w-8 h-8"
                />
            )}
            <span className="text-2xl font-bold text-neutral-200">
                {!isRoot ? `${sentenceCase(pathname)} Algorithm` : "AlgoWiz"}
            </span>
        </div>
    );
};
