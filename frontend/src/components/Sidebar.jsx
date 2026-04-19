import React from "react";
import { Link } from "react-router-dom";

const MockData = [
    {
        title: "Trending",
        items: [
            { title: "Best Sellers", open: false },
            { title: "New Releases", open: false },
            { title: "Movers and Shakers", open: false },
        ],
    },
    {
        title: "Digital Content and Devices",
        items: [
            { title: "Echo & Alexa", open: true },
            { title: "Fire TV", open: true },
            { title: "Kindle eBooks", open: false },
            { title: "Audible Audiblebooks", open: true },
            { title: "Amazon Prime Video", open: true },
            { title: "Amazon Prime Music", open: true },
        ],
    },
    {
        title: "Shop by Catagory",
        items: [
            { title: "Mobile, Computers", open: true },
            { title: "TV, Appliances, Electronics", open: true },
            { title: "Men's Fashion", open: true },
            { title: "See All", open: true },
        ],
    },
];

const ContentContainer = ({ data }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold text-black mb-2">{data.title}</h2>
            <ul className="space-y-3">
                {data.items.map((item, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center hover:bg-gray-100 p-2 cursor-pointer text-black"
                    >
                        <span>{item.title}</span>
                        {item.open && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        )}
                    </li>
                ))}
            </ul>
            <div className="border-b border-gray-300 my-4"></div>
        </div>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    if (isOpen) {
        document.body.classList.add("overflow-hidden");
    } else {
        document.body.classList.remove("overflow-hidden");
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                    isOpen ? "opacity-70 z-40" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 left-0 h-full w-[365px] bg-white transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="bg-[#232f3e] text-white p-3 flex items-center pl-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
                    <Link to={"sign-in"}>
                        <span className="text-xl font-bold">Sign up/Login</span>
                    </Link>
                </div>

                <button
                    className="absolute top-3 right-2 text-white hover:text-gray-300"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="h-full overflow-y-auto pb-20">
                    {MockData.map((data, index) => (
                        <ContentContainer key={index} data={data} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
