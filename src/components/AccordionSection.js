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
import { AiFillDelete } from "react-icons/ai";
import { useFileSelected } from "../context/SelectionContext.js";
import axios from "axios";
import qs from "qs";
import { TokenManager } from '../components/getToken.js';
import { useSnackbar } from 'notistack';

export default function AccordionSection({ videoClips, videoURl, clips }) {
    const { fileselected, fileselecteddata,setFileDelete } = useFileSelected();
    console.log(fileselecteddata, "fileselecteddata");
    const { enqueueSnackbar } = useSnackbar();
    const [openStates, setOpenStates] = useState([true, true]);
    const [videoCount, setVideoCount] = useState(videoClips.length);
    const userToken = TokenManager.getToken()[1]
    const toggleAccordion = (index) => {
        setOpenStates((prev) =>
            prev.map((state, i) => (i === index ? !state : state))
        );
    };

    const handleAddClipClick = (event) => {
        event.stopPropagation();
        for (let i = 0; i < fileselecteddata.length; i++) {
            const element = fileselecteddata[i];
            console.log(element.src);

            let data = qs.stringify({
                'id': element.id,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/clip/delete',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${userToken}`
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    setVideoCount(videoCount - 1);
                    setFileDelete(true);
                    enqueueSnackbar('Video deleted successfully', { variant: 'success',autoHideDuration: 1500, });
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.response.data.message,
                     { variant: 'error' ,autoHideDuration: 1500,
                    });
                    setFileDelete(false);
                });

        }
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
                        <div className="relative w-full h-fit overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 ">
                            <Mainvideo />
                        </div>
                    </AccordionBody>
                </AccordionItem>

                <AccordionItem isActive={openStates[1]}>
                    <div className="flex items-center justify-between">
                        <AccordionHeader
                            onClick={() => toggleAccordion(1)}
                            className="cursor-pointer mt-4 mb-4 relative"
                        >
                            <div className="flex items-center justify-between ">
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
                            </div>
                        </AccordionHeader>
                        {fileselected && (
                            <div className="flex items-center justify-between bg-[#FEE2E2] rounded-[10px] border border-red-500 p-2 cursor-pointer select-none" onClick={handleAddClipClick}>
                                <span className="text-sm font-bold text-gray-900 mr-1">
                                    Delete
                                    ({fileselecteddata.length})
                                </span>
                                <AiFillDelete className="text-red-600 text-xl " />
                            </div>
                        )}
                    </div>
                    <AccordionBody>
                        <div className="relative w-full h-fit overflow-y-auto ">
                            <Videoclips setVideoCount={setVideoCount} videoClips={videoClips} />
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
