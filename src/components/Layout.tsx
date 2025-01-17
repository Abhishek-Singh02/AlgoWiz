import { FC } from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export type LayoutProps = {};

export const Layout: FC<LayoutProps> = () => {
    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <Outlet />
        </div>
    );
};
