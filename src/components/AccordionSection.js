import React, { useState } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Mainvideo from "./Mainvideo";
import Videoclips from "./Videoclips";

export default function AccordionSection({ videoClips }) {
    const [openStates, setOpenStates] = useState([true, true]);
    const [videoCount, setVideoCount] = useState(0);

    const toggleAccordion = (index) => {
        setOpenStates((prev) =>
            prev.map((state, i) => (i === index ? !state : state))
        );
    };

    return (
        <div className="flex-grow-0 flex-shrink-0 w-[100%] h-[90%] overflow-y-auto overflow-x-scroll">
            <Accordion alwaysOpen={true} className="p-4">
                <AccordionItem isActive={openStates[0]}>
                    <AccordionHeader
                        onClick={() => toggleAccordion(0)}
                        className="cursor-pointer flex items-center justify-between mt-2 mb-3"
                    >
                        <div className="flex items-center">
                            {openStates[0] ? (
                                <FiChevronDown className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                            ) : (
                                <FiChevronRight className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                            )}
                            <h3 className="dark:text-gray-200 text-gray-800 text-xl font-normal font-Satoshi ">
                                Main Video
                            </h3>
                        </div>
                    </AccordionHeader>
                    <AccordionBody>
                        <div className="relative w-full h-fit overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 z-10">
                            <Mainvideo />
                        </div>
                    </AccordionBody>
                </AccordionItem>

                <AccordionItem isActive={openStates[1]}>
                    <AccordionHeader
                        onClick={() => toggleAccordion(1)}
                        className="cursor-pointer flex items-center justify-between mt-4 mb-4"
                    >
                        <div className="flex items-center">
                            {openStates[1] ? (
                                <FiChevronDown className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                            ) : (
                                <FiChevronRight className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                            )}
                            <h3 className="dark:text-gray-200 text-gray-800 text-xl font-normal font-Satoshi">
                                Video Clips{" "}
                                <span className="text-sm font-thin text-gray-400">
                                    ({videoCount})
                                </span>
                            </h3>
                        </div>
                    </AccordionHeader>
                    <AccordionBody>
                        <div className="relative w-full h-fit overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 z-10">
                            <Videoclips setVideoCount={setVideoCount} videoClips={videoClips} />
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
