import { request } from '@/utils/axios';

export const getArtists = id => request.get(`/artists?id=${id}`);
