// @ts-nocheck
import axiosClient from "./anilistAxiosClient";

import anilistApiConfig from "./anilistApiConfig";
import axios from "axios";

const anilistApi = {
    getOptions: (query, variables) => {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

        return options;
    },
    getMoviesList: async (variables) => {
        let query;

        if (variables.search === '') {
            query = anilistApiConfig.noSearchQuery + `format: MOVIE` + anilistApiConfig.query2;
        }
        else {
            query = anilistApiConfig.searchQuery + `format: MOVIE` + anilistApiConfig.query2;
        }

        const params = {
            'query': query,
            'variables': variables
        };

        const response = await axiosClient.post('/', params).then(res => res);
        return response.data.Page;
    },
    getTvList: async (variables) => {
        let query;

        if (variables.search === '') {
            query = anilistApiConfig.noSearchQuery + `format_in: [TV, TV_SHORT]` + anilistApiConfig.query2;
        }
        else {
            query = anilistApiConfig.searchQuery + `format_in: [TV, TV_SHORT]` + anilistApiConfig.query2;
        }

        const params = {
            'query': query,
            'variables': variables
        };

        const response = await axiosClient.post('/', params).then(res => res);
        return response.data.Page;
    },
    getDetails: async (variables) => {
        let query = anilistApiConfig.detailsQuery;

        const params = {
            'query': query,
            'variables': variables
        };

        const response = await axiosClient.post('/', params).then(res => res);
        return response.data
    },
    getSimilar: async (variables) => {
        let query = anilistApiConfig.trendingQuery + anilistApiConfig.query2;

        const params = {
            'query': query,
            'variables': variables
        };

        const response = await axiosClient.post('/', params).then(res => res);
        return response.data
    }
}

export default anilistApi;