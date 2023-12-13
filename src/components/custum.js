import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import qs from 'qs';
import { TokenManager } from '../components/getToken.js';

function Custum() {
    const userToken = TokenManager.getToken()[1]
    const { clipId } = useParams();

    useEffect(() => {
        async function fetchData() {
            let data = qs.stringify({
                'project_id': clipId
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/clip/get-by-id',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + userToken
                },
                data: data
            };

            try{
            const response = await axios(config)
            if (process.env.NODE_ENV === 'development') {
            console.log(JSON.stringify(response.data));
            }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                console.log(error);
                }
            }
        }
        fetchData();
    }, [ ])

    return (
        <div>

        </div>
    )
}

export default Custum
